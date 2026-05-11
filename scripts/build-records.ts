import * as fs from 'fs';
import * as path from 'path';
import type { UFORecord, Agency, RecordType, RecordsData } from '../lib/types';

const MEDIA_BASE = 'https://media.githubusercontent.com/media/ckpxgfnksd-max/uap-release-01/main';
const GITHUB_TREE_URL = 'https://api.github.com/repos/ckpxgfnksd-max/uap-release-01/git/trees/main?recursive=1';
const CSV_FILE = path.join(__dirname, '..', 'data', 'pdfs', 'uap-records.csv');
const OUT_FILE = path.join(__dirname, '..', 'data', 'records.json');
const RELEASE_DATE = '2026-05-08';

// ── CSV parsing (RFC 4180) ────────────────────────────────────────────────────

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let i = 0;
  const len = csv.length;
  while (i < len) {
    const row: string[] = [];
    while (i < len) {
      let field = '';
      if (csv[i] === '"') {
        i++;
        while (i < len) {
          if (csv[i] === '"') {
            if (i + 1 < len && csv[i + 1] === '"') { field += '"'; i += 2; }
            else { i++; break; }
          } else { field += csv[i++]; }
        }
      } else {
        while (i < len && csv[i] !== ',' && csv[i] !== '\r' && csv[i] !== '\n') {
          field += csv[i++];
        }
      }
      row.push(field.trim());
      if (i < len && csv[i] === ',') { i++; } else { break; }
    }
    if (i < len && csv[i] === '\r') i++;
    if (i < len && csv[i] === '\n') i++;
    if (row.length > 0 && row.some(f => f.length > 0)) rows.push(row);
  }
  return rows;
}

function normalizeDate(d: string): string {
  if (!d || d === 'N/A' || d === 'TBD' || d === 'n/a') return '';
  const rangeMatch = d.match(/^(\d{1,2}\/\d{1,2}\/\d{2,4})\s*[-–]/);
  if (rangeMatch) return normalizeDate(rangeMatch[1]);
  const shortDate = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (shortDate) {
    const yr = parseInt(shortDate[3]);
    const fullYr = yr >= 40 ? `19${shortDate[3].padStart(2, '0')}` : `20${shortDate[3].padStart(2, '0')}`;
    return `${fullYr}-${shortDate[1].padStart(2, '0')}-${shortDate[2].padStart(2, '0')}`;
  }
  const fullDate = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (fullDate) return `${fullDate[3]}-${fullDate[1].padStart(2, '0')}-${fullDate[2].padStart(2, '0')}`;
  return d;
}

function mapAgency(a: string): Agency {
  const u = a.trim().toUpperCase();
  if (u === 'FBI') return 'FBI';
  if (u === 'DOW' || u.includes('WAR')) return 'DOW';
  if (u === 'NASA') return 'NASA';
  if (u === 'DIA') return 'DIA';
  if (u === 'CIA') return 'CIA';
  if (u === 'USAF' || u.includes('AIR FORCE')) return 'USAF';
  if (u === 'ARMY' || u.includes('ARMY')) return 'ARMY';
  if (u === 'INDOPACOM' || u.includes('INDO-PACIFIC')) return 'INDOPACOM';
  if (u === 'AARO') return 'AARO';
  if (u === 'ODNI' || u.includes('NATIONAL INTELLIGENCE')) return 'ODNI';
  if (u === 'DOE' || u.includes('ENERGY')) return 'DOE';
  if (u === 'DOS' || u.includes('STATE')) return 'DOS';
  return 'DOW';
}

function mapType(title: string): RecordType {
  const t = title.toLowerCase();
  if (t.includes('composite')) return 'COMPOSITE';
  if (t.includes('gemini') || t.includes('apollo') || t.includes('skylab') || t.includes('transcript') || t.includes('archival') || /^(18|38|59|255|331|341|342|65)_/.test(title)) return 'ARCHIVAL';
  if (t.includes('photo') && !t.includes('photo-b')) return 'PHOTO';
  if (t.includes('memo') || t.includes('correspondence') || t.includes('cable')) return 'DOCUMENT';
  if (t.includes('mission report') || t.includes('misrep') || t.includes('range fouler') || t.includes('debrief')) return 'REPORT';
  if (t.includes('.mp4')) return 'VIDEO';
  return 'DOCUMENT';
}

function estimateCoord(loc: string): [number, number] | undefined {
  const l = loc.toLowerCase();
  if (l.includes('western united states')) return [37.5, -119];
  if (l.includes('southeastern united states')) return [33.5, -84];
  if (l.includes('southern united states')) return [30, -90];
  if (l.includes('north america')) return [45, -100];
  if (l.includes('iraq')) return [33.3, 44.4];
  if (l.includes('syria')) return [34.8, 38.9];
  if (l.includes('middle east')) return [25, 45];
  if (l.includes('arabian gulf') || l.includes('persian gulf') || l.includes('gulf of oman') || l.includes('uae') || l.includes('united arab emirates') || l.includes('djibouti') || l.includes('gulf of aden') || l.includes('strait of hormuz')) return [24.5, 54.4];
  if (l.includes('arabian sea')) return [17, 65];
  if (l.includes('greece') || l.includes('mediterranean')) return [38, 23.7];
  if (l.includes('africa')) return [5, 20];
  if (l.includes('japan') || l.includes('indopacom') || l.includes('east china sea') || l.includes('pacific')) return [35, 139];
  if (l.includes('germany')) return [51.2, 10.4];
  if (l.includes('netherlands')) return [52.1, 5.3];
  if (l.includes('papua new guinea')) return [-9.4, 147.2];
  if (l.includes('kazakhstan')) return [48.0, 66.9];
  if (l.includes('iran')) return [32.4, 53.7];
  return undefined;
}

function extractCaseNumber(title: string): string | undefined {
  const fbi = title.match(/(\d{2}-[A-Z]{2}-\d{5,})/i);
  if (fbi) return fbi[1].toUpperCase();
  const parts = title.replace(/\s+/g, '_').split('_');
  if (parts.length >= 3 && /^\d{1,4}$/.test(parts[0]) && /^\d{5,}$/.test(parts[1])) {
    return `${parts[0]}-${parts[1]}`;
  }
  return undefined;
}

function generateId(title: string, agency: Agency): string {
  const docMatch = title.match(/^([A-Z]+-UAP-[A-Z0-9]+)/i);
  if (docMatch) return docMatch[1].toUpperCase();
  const fbiCase = title.match(/(\d{2}-[A-Z]{2}-\d{5,})/i);
  if (fbiCase) return `${agency}-${fbiCase[1]}`.toUpperCase();
  const parts = title.replace(/\s+/g, '_').split('_');
  if (parts.length >= 2 && /^\d{1,4}$/.test(parts[0]) && /^\d{5,}$/.test(parts[1])) {
    return `${agency}-${parts[0]}-${parts[1]}`.toUpperCase();
  }
  return title.split(',')[0].replace(/[^A-Z0-9]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 50).toUpperCase();
}

// ── GitHub file list ──────────────────────────────────────────────────────────

async function fetchGithubFiles(): Promise<string[]> {
  const res = await fetch(GITHUB_TREE_URL);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json() as { tree: Array<{ path: string; type: string }> };
  return data.tree
    .filter(t => t.type === 'blob' && !t.path.startsWith('.') && t.path !== 'README.md')
    .map(t => t.path);
}

function mediaUrl(filename: string): string {
  return `${MEDIA_BASE}/${encodeURIComponent(filename).replace(/%20/g, '%20')}`;
}

// ── Filename matching ─────────────────────────────────────────────────────────

function normKey(s: string): string {
  return s.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function findMatchingFiles(record: UFORecord, files: string[]): string[] {
  const idKey = normKey(record.id);
  const matches = files.filter(f => normKey(f).startsWith(idKey));
  if (matches.length) return matches;

  if (record.caseNumber) {
    const caseKey = normKey(record.caseNumber);
    const caseMatches = files.filter(f => normKey(f).includes(caseKey));
    if (caseMatches.length) return caseMatches;
  }

  return [];
}

// ── Record grouping ───────────────────────────────────────────────────────────

function groupByCaseNumber(records: UFORecord[]): UFORecord[] {
  const groups = new Map<string, UFORecord[]>();
  for (const r of records) {
    const key = r.caseNumber || r.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }
  return [...groups.values()].map(group => {
    if (group.length === 1) return group[0];
    const primary = { ...group[0] };
    const allUrls = [...new Set(group.map(r => r.downloadUrl).filter(Boolean) as string[])];
    return {
      ...primary,
      downloadUrl: allUrls[0],
      downloadUrls: allUrls,
      sectionCount: group.length,
      tags: [...new Set(group.flatMap(r => r.tags || []))],
    };
  });
}

// ── Build new records for files not in CSV ────────────────────────────────────

function buildExtraRecord(filename: string): UFORecord | null {
  const ext = filename.split('.').pop()?.toLowerCase();
  const base = filename.replace(/\.[^.]+$/, '');
  const url = mediaUrl(filename);

  if (ext === 'mp4') {
    const agencyPrefix = filename.startsWith('dow-') ? 'DOW'
      : filename.startsWith('255_') ? 'DOW'
      : 'DOW';
    const agency: Agency = agencyPrefix as Agency;

    // Extract PR number for DOW videos
    const prMatch = filename.match(/pr(\d+)/i);
    const id = prMatch
      ? `DOW-UAP-PR${prMatch[1]}`
      : base.replace(/[^A-Z0-9]/gi, '-').replace(/-+/g, '-').toUpperCase().substring(0, 40);

    const location = 'Unknown';
    const tags: string[] = [agency.toLowerCase(), 'video', 'uap'];

    // Try to infer date from filename for some known cases
    let incidentDate = '';
    const yearMatch = filename.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) incidentDate = yearMatch[0];

    return {
      id,
      agency,
      releaseDate: RELEASE_DATE,
      incidentDate,
      incidentLocation: location,
      type: 'VIDEO',
      description: `UAP observation video from PURSUE Release 01. Declassified aerial surveillance footage.`,
      classification: 'DECLASSIFIED',
      videoUrl: url,
      tags,
      localFilename: filename,
    };
  }

  if (ext === 'png') {
    const numMatch = filename.match(/fbi-photo-a(\d+)/i);
    if (!numMatch) return null;
    const n = numMatch[1];
    return {
      id: `FBI-PHOTO-A${n}`,
      agency: 'FBI',
      releaseDate: RELEASE_DATE,
      incidentDate: '2025',
      incidentLocation: 'Western United States',
      coordinates: [37.5, -119],
      type: 'PHOTO',
      description: `FBI sensor/infrared photograph A${n} from PURSUE Release 01. Unidentified aerial phenomenon captured by ground-based sensor system.`,
      classification: 'DECLASSIFIED',
      imageUrl: url,
      imageUrls: [url],
      tags: ['fbi', 'photo', 'sensor', 'infrared', 'western-united-states'],
      localFilename: filename,
    };
  }

  if (ext === 'jpg') {
    const vmMatch = filename.match(/nasa-uap-vm(\d+)-([^.]+)/i);
    if (!vmMatch) return null;
    const n = vmMatch[1];
    const missionSlug = vmMatch[2];
    const mission = missionSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const yearMatch = filename.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? yearMatch[0] : '';
    return {
      id: `NASA-UAP-VM${n}`,
      agency: 'NASA',
      releaseDate: RELEASE_DATE,
      incidentDate: year,
      incidentLocation: 'Low Earth Orbit',
      type: 'PHOTO',
      description: `NASA visual media image from ${mission}. Unidentified object observed during mission photography.`,
      classification: 'DECLASSIFIED',
      imageUrl: url,
      imageUrls: [url],
      tags: ['nasa', 'photo', 'apollo', year].filter(Boolean),
      localFilename: filename,
    };
  }

  if (ext === 'pdf') {
    // DOS cables
    if (filename.startsWith('dos-uap-')) {
      const cableMatch = filename.match(/dos-uap-d(\d+)-cable-\d+-([^-]+)-(.+)\.pdf/i);
      const n = cableMatch ? cableMatch[1] : filename.match(/dos-uap-d(\d+)/i)?.[1] ?? '0';
      const locationSlug = cableMatch ? cableMatch[2] : 'unknown';
      const location = locationSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const yearMatch = filename.match(/(\w+)-(\d{4})\.pdf$/i);
      const year = yearMatch ? yearMatch[2] : '';
      const monthSlug = yearMatch ? yearMatch[1] : '';
      const months: Record<string, string> = { january: '01', february: '02', march: '03', april: '04', may: '05', june: '06', july: '07', august: '08', september: '09', october: '10', november: '11', december: '12' };
      const monthNum = months[monthSlug.toLowerCase()] ?? '';
      const incidentDate = year ? (monthNum ? `${year}-${monthNum}` : year) : '';
      return {
        id: `DOS-UAP-D${n}`,
        agency: 'DOS',
        releaseDate: RELEASE_DATE,
        incidentDate,
        incidentLocation: location || 'Unknown',
        coordinates: estimateCoord(location),
        type: 'DOCUMENT',
        description: `Declassified State Department cable from PURSUE Release 01. Diplomatic communication regarding unidentified aerial phenomenon report.`,
        classification: 'DECLASSIFIED',
        downloadUrl: url,
        tags: ['dos', 'cable', 'diplomatic', location.toLowerCase().split(' ')[0]].filter(Boolean),
        localFilename: filename,
      };
    }

    // FBI photo-b series
    if (filename.startsWith('fbi-photo-b')) {
      const n = filename.match(/fbi-photo-b(\d+)/i)?.[1] ?? '0';
      return {
        id: `FBI-PHOTO-B${n}`,
        agency: 'FBI',
        releaseDate: RELEASE_DATE,
        incidentDate: '',
        incidentLocation: 'Unknown',
        type: 'PHOTO',
        description: `FBI photographic document B${n} from PURSUE Release 01. Declassified FBI records related to UAP visual documentation.`,
        classification: 'DECLASSIFIED',
        downloadUrl: url,
        tags: ['fbi', 'photo', 'document'],
        localFilename: filename,
      };
    }

    // 059uap series
    if (filename.startsWith('059uap')) {
      const n = filename.match(/059uap(\d+)/i)?.[1] ?? '0';
      return {
        id: `DOW-059UAP-${n}`,
        agency: 'DOW',
        releaseDate: RELEASE_DATE,
        incidentDate: '',
        incidentLocation: 'Unknown',
        type: 'DOCUMENT',
        description: `Declassified document from the 059 UAP series. PURSUE Release 01.`,
        classification: 'DECLASSIFIED',
        downloadUrl: url,
        tags: ['dow', 'document'],
        localFilename: filename,
      };
    }

    // Redacted serials
    if (filename.includes('redacted') || filename.includes('serial')) {
      const id = base.replace(/[^A-Z0-9]/gi, '-').replace(/-+/g, '-').toUpperCase().substring(0, 40);
      return {
        id,
        agency: 'FBI',
        releaseDate: RELEASE_DATE,
        incidentDate: '',
        incidentLocation: 'Unknown',
        type: 'DOCUMENT',
        description: `Partially redacted FBI serial document from PURSUE Release 01.`,
        classification: 'DECLASSIFIED',
        downloadUrl: url,
        tags: ['fbi', 'document', 'redacted'],
        localFilename: filename,
      };
    }

    // western_us event slides
    if (filename.includes('western_us_event')) {
      return {
        id: 'DOW-WESTERN-US-SLIDES',
        agency: 'DOW',
        releaseDate: RELEASE_DATE,
        incidentDate: '2026-05-08',
        incidentLocation: 'Western United States',
        coordinates: [37.5, -119],
        type: 'COMPOSITE',
        description: `Presentation slides summarizing Western United States UAP events. Released as part of PURSUE Release 01, May 8, 2026.`,
        classification: 'DECLASSIFIED',
        downloadUrl: url,
        tags: ['dow', 'composite', 'western-united-states', '2026'],
        localFilename: filename,
      };
    }

    if (filename.includes('usper-statement')) {
      return {
        id: 'DOW-USPER-STATEMENT',
        agency: 'DOW',
        releaseDate: RELEASE_DATE,
        incidentDate: '',
        incidentLocation: 'Unknown',
        type: 'DOCUMENT',
        description: `Redacted U.S. Person (USPER) statement from PURSUE Release 01.`,
        classification: 'DECLASSIFIED',
        downloadUrl: url,
        tags: ['dow', 'document', 'statement', 'redacted'],
        localFilename: filename,
      };
    }

    if (filename.includes('composite-sketch')) {
      return {
        id: 'DOW-COMPOSITE-SKETCH-2024',
        agency: 'DOW',
        releaseDate: RELEASE_DATE,
        incidentDate: '2024-04-30',
        incidentLocation: 'Unknown',
        type: 'COMPOSITE',
        description: `Composite sketch document released April 30, 2024. Part of PURSUE Release 01.`,
        classification: 'DECLASSIFIED',
        downloadUrl: url,
        tags: ['dow', 'composite', '2024'],
        localFilename: filename,
      };
    }
  }

  return null;
}

// ── CSV → records ─────────────────────────────────────────────────────────────

function parseCsvRecords(csvPath: string): UFORecord[] {
  const csv = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csv);
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.toLowerCase().trim());
  const COL_TITLE    = headers.findIndex(h => h === 'title');
  const COL_TYPE     = headers.findIndex(h => h === 'type');
  const COL_DESC     = headers.findIndex(h => h.includes('description') || h.includes('blurb'));
  const COL_AGENCY   = headers.findIndex(h => h === 'agency');
  const COL_DATE     = headers.findIndex(h => h.includes('incident date'));
  const COL_LOCATION = headers.findIndex(h => h.includes('incident location'));
  const COL_PDF_LINK = headers.findIndex(h => h.includes('pdf') && h.includes('link'));
  const COL_THUMB    = headers.findIndex(h => h.includes('modal image'));

  const seenUrls = new Set<string>();
  const records: UFORecord[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 12) continue;

    const type = COL_TYPE >= 0 ? row[COL_TYPE] : '';
    if (type && type.toUpperCase() !== 'PDF') continue;

    const pdfUrl = COL_PDF_LINK >= 0 ? row[COL_PDF_LINK] : '';
    if (!pdfUrl || !pdfUrl.startsWith('http')) continue;
    if (seenUrls.has(pdfUrl)) continue;
    seenUrls.add(pdfUrl);

    const title       = COL_TITLE    >= 0 ? row[COL_TITLE]    : '';
    const agencyStr   = COL_AGENCY   >= 0 ? row[COL_AGENCY]   : '';
    const dateRaw     = COL_DATE     >= 0 ? row[COL_DATE]     : '';
    const locationRaw = COL_LOCATION >= 0 ? row[COL_LOCATION] : '';
    const descRaw     = COL_DESC     >= 0 ? row[COL_DESC]     : '';
    const thumbUrl    = COL_THUMB    >= 0 && row[COL_THUMB] ? row[COL_THUMB] : undefined;

    const agency         = mapAgency(agencyStr);
    const incidentDate   = normalizeDate(dateRaw);
    const incidentLocation = (!locationRaw || locationRaw === 'N/A') ? 'Unknown' : locationRaw.trim();
    const description    = descRaw.replace(/\s+/g, ' ').trim().substring(0, 600);
    const coordinates    = estimateCoord(incidentLocation);
    const recordType     = mapType(title);
    const caseNumber     = extractCaseNumber(title);
    const id             = generateId(title, agency);
    const year           = incidentDate ? incidentDate.slice(0, 4) : '';
    const tags = [...new Set([
      agency.toLowerCase(),
      recordType.toLowerCase(),
      ...(year ? [year] : []),
      ...(incidentLocation !== 'Unknown' ? [incidentLocation.toLowerCase().split(',')[0].trim().split(' ')[0]] : []),
    ].filter(Boolean))];

    records.push({
      id,
      caseNumber,
      agency,
      releaseDate: RELEASE_DATE,
      incidentDate,
      incidentLocation,
      coordinates,
      type: recordType,
      description,
      imageUrl: thumbUrl,
      downloadUrl: pdfUrl,
      classification: 'DECLASSIFIED',
      section: 'Release 1',
      tags,
    });
  }

  return records;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching GitHub file list...');
  const allFiles = await fetchGithubFiles();
  console.log(`  ${allFiles.length} files in repo`);

  const pdfFiles = allFiles.filter(f => f.endsWith('.pdf'));
  const mp4Files = allFiles.filter(f => f.endsWith('.mp4'));
  const imgFiles = allFiles.filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
  console.log(`  PDFs: ${pdfFiles.length}  MP4s: ${mp4Files.length}  Images: ${imgFiles.length}`);

  // Load CSV records
  let csvRecords: UFORecord[] = [];
  if (fs.existsSync(CSV_FILE)) {
    csvRecords = parseCsvRecords(CSV_FILE);
    console.log(`CSV: ${csvRecords.length} PDF records`);
  } else {
    console.log('CSV not found — building from GitHub files only');
  }

  // Track which files are matched to CSV records
  const matchedFiles = new Set<string>();

  // Update CSV records with GitHub media URLs
  const updatedCsvRecords = csvRecords.map(record => {
    const matches = findMatchingFiles(record, allFiles);
    if (matches.length === 0) return record;

    matches.forEach(f => matchedFiles.add(f));

    if (matches.length === 1) {
      return { ...record, downloadUrl: mediaUrl(matches[0]), localFilename: matches[0] };
    }
    // Multi-section: update all download URLs
    const urls = matches.map(mediaUrl);
    return {
      ...record,
      downloadUrl: urls[0],
      downloadUrls: urls,
      sectionCount: matches.length,
      localFilename: matches[0],
    };
  });

  // Group CSV records by case number
  const grouped = groupByCaseNumber(updatedCsvRecords);
  console.log(`CSV records grouped: ${csvRecords.length} → ${grouped.length}`);

  // Build extra records from unmatched files
  const extraRecords: UFORecord[] = [];
  for (const f of allFiles) {
    if (matchedFiles.has(f)) continue;
    const rec = buildExtraRecord(f);
    if (rec) extraRecords.push(rec);
  }
  console.log(`Extra records from unmatched files: ${extraRecords.length}`);

  const allRecords = [...grouped, ...extraRecords];

  const output: RecordsData & { scrapedAt: string; source: string } = {
    scrapedAt: new Date().toISOString(),
    source: 'https://github.com/ckpxgfnksd-max/uap-release-01',
    totalRecords: allRecords.length,
    records: allRecords,
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${allRecords.length} total records to ${OUT_FILE}`);
  console.log(`  CSV-derived: ${grouped.length}`);
  console.log(`  Extra (GitHub-only): ${extraRecords.length}`);
  const videoCount = allRecords.filter(r => r.type === 'VIDEO' || r.videoUrl).length;
  const photoCount = allRecords.filter(r => r.type === 'PHOTO').length;
  console.log(`  Videos: ${videoCount}  Photos: ${photoCount}`);
}

main().catch(err => { console.error(err); process.exit(1); });
