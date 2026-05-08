import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  // Log all requests
  page.on('request', req => {
    if (req.url().includes('ufo') || req.url().includes('json') || req.url().includes('api') || req.url().includes('Interactive')) {
      console.log('REQUEST:', req.url());
    }
  });

  page.on('response', async resp => {
    const url = resp.url();
    if (url.includes('json') || url.includes('api') || url.includes('Interactive')) {
      console.log('RESPONSE:', resp.status(), url);
      if (url.endsWith('.json')) {
        try {
          const body = await resp.text();
          console.log('  JSON body (first 500):', body.substring(0, 500));
        } catch { /* ignore */ }
      }
    }
  });

  console.log('Loading page...');
  await page.goto('https://www.war.gov/ufo/', { waitUntil: 'networkidle', timeout: 60000 });

  // Wait extra time for JS
  await page.waitForTimeout(5000);

  // Scroll to trigger lazy load
  await page.evaluate(async () => {
    for (let i = 0; i < 20; i++) {
      window.scrollBy(0, window.innerHeight);
      await new Promise(r => setTimeout(r, 300));
    }
  });
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: path.join(__dirname, 'screenshot.png'), fullPage: true });
  console.log('Screenshot saved');

  // Dump full page HTML (first 10000 chars)
  const html = await page.content();
  fs.writeFileSync(path.join(__dirname, 'page.html'), html);
  console.log('HTML saved, length:', html.length);

  // Log all elements that might be records
  const info = await page.evaluate(() => {
    const result: Record<string, unknown> = {};

    // All tables
    result.tables = document.querySelectorAll('table').length;
    result.tableHTML = Array.from(document.querySelectorAll('table')).map(t => t.outerHTML.substring(0, 500));

    // All images
    result.images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: (img as HTMLImageElement).src,
      alt: (img as HTMLImageElement).alt,
    }));

    // Elements with IDs
    result.ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id).filter(id => id.length > 3);

    // Any divs/sections that mention "record" or "release"
    result.recordDivs = Array.from(document.querySelectorAll('[class*="record"], [class*="release"], [class*="file"], [class*="document"]'))
      .map(el => ({ tag: el.tagName, classes: el.className, text: el.textContent?.substring(0, 100) }));

    // Any list items
    result.listItems = document.querySelectorAll('li').length;

    // Page title
    result.title = document.title;

    // All text nodes with "FBI" or "DOW" or "UAP"
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const uapTexts: string[] = [];
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim() || '';
      if ((text.includes('FBI') || text.includes('DOW') || text.includes('UAP') || text.includes('PR-')) && text.length > 5 && text.length < 200) {
        uapTexts.push(text);
      }
    }
    result.uapTexts = uapTexts.slice(0, 50);

    return result;
  });

  console.log('\n=== PAGE ANALYSIS ===');
  console.log('Title:', info.title);
  console.log('Tables:', info.tables);
  console.log('Images:', (info.images as Array<{src: string; alt: string}>).length);
  console.log('\nImage URLs:');
  (info.images as Array<{src: string; alt: string}>).forEach(img => console.log(' ', img.src, '|', img.alt));
  console.log('\nElement IDs (sample):');
  (info.ids as string[]).slice(0, 30).forEach(id => console.log(' ', id));
  console.log('\nRecord-like divs:');
  (info.recordDivs as Array<{tag: string; classes: string; text: string}>).forEach(d => console.log(' ', d.tag, d.classes, '|', d.text));
  console.log('\nUAP/DOW/FBI text nodes:');
  (info.uapTexts as string[]).forEach(t => console.log(' ', t));
  if ((info.tableHTML as string[]).length > 0) {
    console.log('\nTable HTML (first table):');
    console.log((info.tableHTML as string[])[0]);
  }

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
