const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage'
  ]
});

const page = await browser.newPage();

await page.setExtraHTTPHeaders({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7'
});

  const lines = fs.readFileSync('prova.m3u', 'utf8').split('\n');
  const output = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('http')) {
      try {
        await page.goto(trimmed, { waitUntil: 'networkidle0', timeout: 15000 });
        output.push(page.url());
      } catch (err) {
        console.error('Failed:', trimmed);
        output.push(trimmed);
      }
    } else {
      output.push(line);
    }
  }

  await browser.close();

  // Write file and force exit
  try {
    fs.writeFileSync('ipradioita_new.m3u', output.join('\n'));
    console.log('File written successfully');
  } catch (err) {
    console.error('Write failed:', err.message);
  }

  process.exit(0); // Ensure clean exit
})();   
