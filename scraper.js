const puppeteer = require('puppeteer');

const url = 'https://www.allrecipes.com/recipe/232211/pesto-pasta-caprese-salad/';  // Replace with your URL

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Extend navigation timeout
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }); // 60 seconds timeout


        // Extract title
        const title = await page.$eval('h1', el => el.textContent.trim()).catch(() => 'Title not found');
        console.log('Title:', title);

        // Extract image URL
        const image = await page.$eval('img', img => img.getAttribute('data-src') || img.src).catch(() => 'Image URL not found');
        console.log('Image URL:', image);

         /// Extract ingredients
        const ingredients = await page.evaluate(() => {
            // Find the ingredients list container
            const ingredientsList = document.querySelector('#mm-recipes-structured-ingredients_1-0 .mm-recipes-structured-ingredients__list');
            if (!ingredientsList) return 'Ingredients list not found';

            // Extract text from each list item
            return Array.from(ingredientsList.querySelectorAll('li')).map(li => li.textContent.trim()).join(', ') || 'Ingredients not found';
        }).catch(() => 'Ingredients not found');

        console.log('Ingredients:', ingredients);
        await browser.close();
    } catch (error) {
        console.error('Error fetching the webpage:', error);
    }
})();
