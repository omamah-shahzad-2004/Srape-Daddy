const puppeteer = require('puppeteer');

async function scrape(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Extract headings
        const headings = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(el => el.textContent.trim());
        }).catch(() => []);

        // Extract paragraphs
        const paragraphs = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('p')).map(p => p.textContent.trim());
        }).catch(() => []);

        // Extract links
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map(a => {
                return {
                    href: a.href,
                    text: a.textContent.trim()
                };
            });
        }).catch(() => []);

        await browser.close();

        return { headings, paragraphs, links };
    } catch (error) {
        console.error('Error occurred while scraping:', error);
        return { headings: [], paragraphs: [], links: [] };
    }
}

module.exports = scrape;
