const clientPromise = require('./mongodb.js');
const puppeteer = require('puppeteer');

//Function to connect to MongoDB and store scrapped data in it
async function storeInDB(scrapped_data) {
    const client = await clientPromise;

    try{
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const db = client.db("scrappedInfo");
        const collection = db.collection("webInfo");

        const res = await collection.insertOne(scrapped_data);
        console.log(`New document inserted with _id: ${res.insertedId}`);
    } catch(error) {
        console.error("Error connecting to MongoDB Atlas:", error)
    } finally {
        await client.close();
    }
}

const url = 'https://www.allrecipes.com/recipe/232211/pesto-pasta-caprese-salad/';  // Replace with your URL

//Function to scrape the web page
async function scrapeWebPage() {
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

        //Create a data object to store in MongoDB
        const scrapedData = {
            url,
            title, 
            image,
            ingredients,
            data: new Date(),
        }

        //Save the data to the database
        await storeInDB(scrapedData);

        await browser.close();
    } catch (error) {
        if(error.response && error.response.status === 404) {
            console.error("Page not found (404):", url);
        }
        else {
            console.error('Error fetching the webpage:', error.message);
        }
    }
}

//Running the Scrapper
scrapeWebPage();
