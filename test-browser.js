const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('BROWSER ERROR:', msg.text());
        }
    });
    page.on('pageerror', err => {
        console.log('PAGE EXCEPTION:', err.toString());
    });

    await page.goto('http://localhost:5173/admin/construction', { waitUntil: 'networkidle0' });
    await browser.close();
})();
