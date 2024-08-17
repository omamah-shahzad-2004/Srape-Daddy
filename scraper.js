const puppeteer = require('puppeteer');

async function scrape(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Extend navigation timeout
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }); // 60 seconds timeout

        // Extract title
        const title = await page.$eval('h1', el => el.textContent.trim()).catch(() => 'Title not found');

        // Extract image URL
        const image = await page.$eval('img', img => img.getAttribute('data-src') || img.src).catch(() => 'Image URL not found');

        // Extract ingredients
        const ingredients = await page.evaluate(() => {
            const ingredientsList = document.querySelector('#mm-recipes-structured-ingredients_1-0 .mm-recipes-structured-ingredients__list');
            if (!ingredientsList) return 'Ingredients list not found';
            return Array.from(ingredientsList.querySelectorAll('li')).map(li => li.textContent.trim()).join(', ') || 'Ingredients not found';
        }).catch(() => 'Ingredients not found');

        // Return the scraped data
        const data = { title, image, ingredients };
        await browser.close();
        return data;
    } catch (error) {
        console.error('Error occurred while scraping:', error);
        return { title: 'Error', image: '', ingredients: 'Error occurred while scraping' };
    }
}

module.exports = scrape;
