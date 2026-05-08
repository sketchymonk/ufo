import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

// pdf-parse uses require
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');

const BASE_URL = 'https://www.war.gov';
const UFO_URL = 'https://www.war.gov/ufo/';
const PDF_DIR = path.join(__dirname, 'pdfs');
const OUT_FILE = path.join(__dirname, '..', 'data', 'records.json');

interface ScrapedRecord {
  id: string;
  caseNumber?: string;
  agency: string;
  releaseDate: string;
  incidentDate: string;
  incidentLocation: string;
  type: string;
  description: string;
  imageUrl?: string;
  downloadUrl?: string;
  classification: string;
  pdfPageCount?: number;
  pdfText?: string;
  classificationMarkings?: string[];
  redactedSectionCount?: number;
  coordinates?: [number, number];
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const fullUrl = url.startsWith('http') ? url : BASE_URL + url;
    const proto = fullUrl.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(fullUrl, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        downloadFile(res.headers.location!, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function extractClassificationMarkings(text: string): string[] {
  const patterns = [
    /TOP SECRET\/\/[A-Z\/\-]+/g,
    /TOP SECRET/g,
    /SECRET\/\/[A-Z\/\-]+/g,
    /SECRET/g,
    /CONFIDENTIAL/g,
    /UNCLASSIFIED\/\/[A-Z\/\-]+/g,
    /UNCLASSIFIED/g,
    /DECLASSIFIED/g,
    /NOFORN/g,
    /ORCON/g,
    /FOUO/g,
  ];
  const found = new Set<string>();
  for (const pat of patterns) {
    const matches = text.match(pat);
    if (matches) matches.forEach(m => found.add(m));
  }
  return Array.from(found);
}

function estimateCoordinates(location: string): [number, number] | undefined {
  const loc = location.toLowerCase();
  if (loc.includes('western united states') || loc.includes('western us')) return [37.5, -119];
  if (loc.includes('southeastern united states') || loc.includes('southeastern us')) return [33.5, -84];
  if (loc.includes('southern united states') || loc.includes('southern us')) return [30, -90];
  if (loc.includes('north america')) return [45, -100];
  if (loc.includes('middle east')) return [25, 45];
  if (loc.includes('united arab emirates') || loc.includes('uae')) return [24.5, 54.4];
  if (loc.includes('greece')) return [38, 23.7];
  if (loc.includes('africa')) return [5, 20];
  if (loc.includes('japan') || loc.includes('indopacom')) return [35, 139];
  if (loc.includes('moon') || loc.includes('apollo')) return undefined;
  return undefined;
}

async function parsePdf(filePath: string): Promise<{ text: string; pages: number; markings: string[]; redacted: number }> {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    const text = data.text || '';
    const markings = extractClassificationMarkings(text);
    // Count [REDACTED] or █ blocks as redaction markers
    const redacted = (text.match(/\[REDACTED\]|\[redacted\]|█+/g) || []).length;
    return { text, pages: data.numpages || 1, markings, redacted };
  } catch {
    return { text: '', pages: 0, markings: [], redacted: 0 };
  }
}

async function main() {
  fs.mkdirSync(PDF_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  console.log('Navigating to PURSUE portal...');
  await page.goto(UFO_URL, { waitUntil: 'networkidle', timeout: 60000 });

  // Wait for table rows to load (max 30s)
  try {
    await page.waitForSelector('table tbody tr, .record-row, [data-record-id]', { timeout: 30000 });
  } catch {
    console.log('No table rows found with standard selectors, continuing with page content...');
  }

  // Scroll to bottom to trigger lazy loading
  await page.evaluate(async () => {
    for (let i = 0; i < 10; i++) {
      window.scrollBy(0, window.innerHeight);
      await new Promise(r => setTimeout(r, 500));
    }
  });
  await page.waitForTimeout(3000);

  // Extract slideshow/carousel images
  const slideshowImages = await page.evaluate(() => {
    const imgs: { src: string; alt: string; caption: string }[] = [];
    document.querySelectorAll('[class*="carousel"] img, [class*="slideshow"] img, [class*="slider"] img, .carousel img, .slideshow img').forEach((el) => {
      const img = el as HTMLImageElement;
      const caption = img.closest('[class*="slide"], [class*="item"]')?.querySelector('[class*="caption"], figcaption, p')?.textContent?.trim() || '';
      imgs.push({ src: img.src, alt: img.alt, caption });
    });
    // Also grab all portals/Interactive/2026/UFO images
    document.querySelectorAll('img[src*="Interactive/2026/UFO"]').forEach((el) => {
      const img = el as HTMLImageElement;
      const caption = img.closest('[class*="slide"], [class*="item"], figure')?.querySelector('[class*="caption"], figcaption, p, .caption')?.textContent?.trim() || img.alt || '';
      const exists = imgs.some(i => i.src === img.src);
      if (!exists) imgs.push({ src: img.src, alt: img.alt, caption });
    });
    return imgs;
  });
  console.log(`Found ${slideshowImages.length} slideshow images`);

  // Extract all table rows from the records table
  const tableRecords = await page.evaluate(() => {
    const rows: Record<string, string>[] = [];
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
      const headers: string[] = [];
      table.querySelectorAll('thead th, thead td').forEach((th) => {
        headers.push(th.textContent?.trim().toLowerCase().replace(/\s+/g, '_') || '');
      });
      if (headers.length === 0) {
        // Try first row as header
        const firstRow = table.querySelector('tr');
        firstRow?.querySelectorAll('th, td').forEach((th) => {
          headers.push(th.textContent?.trim().toLowerCase().replace(/\s+/g, '_') || '');
        });
      }
      table.querySelectorAll('tbody tr, tr:not(:first-child)').forEach((tr) => {
        const cells = tr.querySelectorAll('td');
        if (cells.length > 0) {
          const row: Record<string, string> = {};
          cells.forEach((td, i) => {
            const key = headers[i] || `col_${i}`;
            row[key] = td.textContent?.trim() || '';
            // Capture any links
            const link = td.querySelector('a');
            if (link) row[`${key}_href`] = link.href;
          });
          // Capture row-level link
          const rowLink = tr.querySelector('a');
          if (rowLink) row['row_href'] = rowLink.href;
          if (Object.values(row).some(v => v)) rows.push(row);
        }
      });
    });
    return rows;
  });
  console.log(`Found ${tableRecords.length} table rows`);

  // Try clicking each row to get detail view
  const detailedRecords: ScrapedRecord[] = [];

  // First process rows that have data
  for (let i = 0; i < tableRecords.length; i++) {
    const row = tableRecords[i];
    console.log(`Processing table row ${i + 1}/${tableRecords.length}...`);

    const record: ScrapedRecord = {
      id: `record-${i + 1}`,
      agency: row['agency'] || row['col_0'] || '',
      releaseDate: row['release_date'] || row['col_1'] || '',
      incidentDate: row['incident_date'] || row['col_2'] || '',
      incidentLocation: row['incident_location'] || row['col_3'] || '',
      type: row['type'] || row['col_4'] || '',
      description: '',
      classification: 'DECLASSIFIED',
    };

    // Try to click the row for details
    try {
      const rowEl = await page.$(`table tbody tr:nth-child(${i + 1})`);
      if (rowEl) {
        await rowEl.click();
        await page.waitForTimeout(1500);

        // Extract detail panel content
        const detail = await page.evaluate(() => {
          const panel = document.querySelector('[class*="detail"], [class*="modal"], [class*="drawer"], [class*="popup"], [role="dialog"]');
          if (!panel) return null;
          const desc = panel.querySelector('p, [class*="description"], [class*="summary"]')?.textContent?.trim() || '';
          const downloadLink = (panel.querySelector('a[href*=".pdf"], a[download], a[href*="download"]') as HTMLAnchorElement)?.href || '';
          const imgEl = panel.querySelector('img') as HTMLImageElement;
          const imgSrc = imgEl?.src || '';
          const caseNum = panel.querySelector('[class*="case"], [class*="id"], code')?.textContent?.trim() || '';
          const classification = panel.querySelector('[class*="classif"], [class*="marking"]')?.textContent?.trim() || '';
          return { desc, downloadLink, imgSrc, caseNum, classification };
        });

        if (detail) {
          record.description = detail.desc;
          record.downloadUrl = detail.downloadLink || undefined;
          record.imageUrl = detail.imgSrc || undefined;
          record.caseNumber = detail.caseNum || undefined;
          if (detail.classification) record.classification = detail.classification.toUpperCase().includes('SECRET') ? 'TOP_SECRET' : 'DECLASSIFIED';
        }

        // Close the panel
        const closeBtn = await page.$('[class*="close"], [aria-label="close"], button[class*="close"]');
        if (closeBtn) await closeBtn.click();
        await page.waitForTimeout(500);
      }
    } catch (err) {
      console.log(`  Could not get details for row ${i + 1}: ${err}`);
    }

    record.coordinates = estimateCoordinates(record.incidentLocation);
    detailedRecords.push(record);
  }

  // Also try all clickable elements that look like records (cards, list items)
  const cardLinks = await page.evaluate(() => {
    const links: { href: string; text: string }[] = [];
    document.querySelectorAll('a[href*="ufo"], a[href*="UAP"], a[href*="record"]').forEach((el) => {
      const a = el as HTMLAnchorElement;
      if (a.href && !a.href.includes('#') && a.textContent?.trim()) {
        links.push({ href: a.href, text: a.textContent.trim() });
      }
    });
    return links;
  });

  // Check for hash-based records from URL fragments observed in the portal
  const hashRecords = await page.evaluate(() => {
    const results: Array<{ id: string; element: string }> = [];
    document.querySelectorAll('[id], [data-id], [data-record]').forEach((el) => {
      const id = el.id || el.getAttribute('data-id') || el.getAttribute('data-record');
      if (id && (id.includes('_') || id.includes('-')) && id.length > 5) {
        results.push({ id, element: el.tagName });
      }
    });
    return results;
  });
  console.log(`Found ${hashRecords.length} hash-anchored elements`);

  // Process slideshow images as records (fallback / supplement)
  const slideshowRecords: ScrapedRecord[] = slideshowImages.map((img, i) => {
    const filename = img.src.split('/').pop()?.replace('.jpg', '') || `image-${i}`;
    const agency = filename.startsWith('FBI') ? 'FBI' : filename.startsWith('NASA') ? 'NASA' : filename.startsWith('DOW') ? 'DOW' : 'DOW';

    // Extract PR number from filename like DOW-UAP-PR19-...
    const prMatch = filename.match(/PR(\d+)/);
    const prNum = prMatch ? prMatch[1] : null;

    // Extract location and date from caption
    const caption = img.caption || img.alt || '';

    // Extract year from caption
    const yearMatch = caption.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? yearMatch[0] : '2026';

    // Extract month from caption
    const monthMatch = caption.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/i);
    const month = monthMatch ? monthMatch[0] : '';

    // Extract location keywords
    let location = 'Unknown';
    const locPatterns = [
      { re: /western united states/i, loc: 'Western United States' },
      { re: /southeastern united states/i, loc: 'Southeastern United States' },
      { re: /southern united states/i, loc: 'Southern United States' },
      { re: /north america/i, loc: 'North America' },
      { re: /middle east/i, loc: 'Middle East' },
      { re: /united arab emirates/i, loc: 'United Arab Emirates' },
      { re: /greece/i, loc: 'Greece' },
      { re: /africa/i, loc: 'Africa' },
      { re: /japan|indopacom/i, loc: 'Japan / INDOPACOM' },
      { re: /apollo 17|moon/i, loc: 'Moon (Apollo 17)' },
    ];
    for (const p of locPatterns) {
      if (p.re.test(caption)) { location = p.loc; break; }
    }

    const incidentDate = month ? `${month} ${year}` : year;
    const type = caption.toLowerCase().includes('composite') ? 'COMPOSITE'
               : caption.toLowerCase().includes('apollo') ? 'ARCHIVAL'
               : caption.toLowerCase().includes('video') ? 'VIDEO' : 'PHOTO';

    return {
      id: prNum ? `DOW-UAP-PR${prNum}` : filename,
      agency,
      releaseDate: '2026-05-08',
      incidentDate,
      incidentLocation: location,
      type,
      description: caption,
      imageUrl: img.src.startsWith('http') ? img.src : BASE_URL + img.src,
      classification: 'DECLASSIFIED',
      coordinates: estimateCoordinates(location),
    };
  });

  // Merge: prefer table records, supplement with slideshow records
  const allRecords = detailedRecords.length > 0 ? detailedRecords : slideshowRecords;

  // Download PDFs and parse them
  for (const record of allRecords) {
    if (record.downloadUrl && record.downloadUrl.endsWith('.pdf')) {
      const pdfName = record.id.replace(/[^a-zA-Z0-9-]/g, '_') + '.pdf';
      const pdfPath = path.join(PDF_DIR, pdfName);
      try {
        if (!fs.existsSync(pdfPath)) {
          console.log(`  Downloading PDF for ${record.id}...`);
          await downloadFile(record.downloadUrl, pdfPath);
        }
        const parsed = await parsePdf(pdfPath);
        record.pdfPageCount = parsed.pages;
        record.pdfText = parsed.text.substring(0, 5000); // limit stored text
        record.classificationMarkings = parsed.markings;
        record.redactedSectionCount = parsed.redacted;
        console.log(`  Parsed PDF: ${parsed.pages} pages, ${parsed.markings.length} markings`);
      } catch (err) {
        console.log(`  PDF download/parse failed for ${record.id}: ${err}`);
      }
    }
  }

  // Write output
  const output = {
    scrapedAt: new Date().toISOString(),
    source: UFO_URL,
    totalRecords: allRecords.length,
    records: allRecords,
    slideshowImages,
    hashAnchors: hashRecords,
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\nDone! Wrote ${allRecords.length} records to ${OUT_FILE}`);

  await browser.close();
}

main().catch((err) => {
  console.error('Scrape failed:', err);
  process.exit(1);
});
