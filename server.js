const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Serve the input form at the root URL
app.get('/', (req, res) => {
    res.render('index');  // Renders the index.ejs form
});

// Handle form submission to scrape the URL
app.post('/scrape', (req, res) => {
    const url = req.body.url;
    
    // Placeholder for scraping logic (you would call your scraper here)
    // For now, we just simulate scraping and saving to a file

    // Simulated data (replace with actual scraping logic)
    const data = {
        title: "Pesto Pasta Caprese Salad",
        image: "https://www.allrecipes.com/thmb/KKjETerN3AmGxsJBrDEkYCwetg4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/4794067-pesto-pasta-caprese-salad-Buckwheat-Queen-4x3-1-d575cee6c24c4dd5a87cf06f5f0ebb6d.jpg",
        ingredients: "1 ½ cups rotini pasta, 3 tablespoons pesto, or to taste, 1 tablespoon extra-virgin olive oil, ¼ teaspoon salt, or to taste, ¼ teaspoon granulated garlic, ⅛ teaspoon ground black pepper, ½ cup halved grape tomatoes, ½ cup small (pearlini) fresh mozzarella balls, 2 leaves fresh basil leaves, finely shredded"
    };

    // Save the scraped data to a JSON file
    fs.writeFileSync('scrapedData.json', JSON.stringify(data, null, 2));

    // Render the result page with the scraped data
    res.render('result', { data: data });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
