import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  // Simulate local storage token for login
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await page.type('input[name="email"]', 'membre@cjp.ul.edu.gn');
  await page.type('input[name="password"]', 'membre123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  await page.goto('http://localhost:5173/tresorerie', { waitUntil: 'networkidle0' });

  // take screenshot of the chart
  const chartElement = await page.$('h2:contains("Recettes vs Dépenses")');
  if (chartElement) {
      await page.screenshot({ path: 'chart-screenshot.png', fullPage: true });
  }

  // Get the computed height of the bars
  const barHeights = await page.evaluate(() => {
    const bars = document.querySelectorAll('.group\\/bar > div:first-child');
    return Array.from(bars).map(b => ({
       height: b.style.height,
       offsetHeight: b.offsetHeight,
       parentHeight: b.parentElement.offsetHeight
    }));
  });
  console.log(JSON.stringify(barHeights, null, 2));

  await browser.close();
})();
