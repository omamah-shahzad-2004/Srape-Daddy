const express = require('express');
const fs = require('fs');
const path = require('path');
const scrape = require('./scraper'); // Import the scrape function from scraper.js
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., CSS, JS, images) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the input form at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));  // Serve the index.html file
});

app.get('/landing', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'landing.html'));  // Serve the index.html file
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));  // Serve the index.html file
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));  // Serve the index.html file
});

// Handle form submission to scrape the URL
app.post('/scrape', async (req, res) => {
    const url = req.body.url;

    try {
        // Perform the actual scraping
        const data = await scrape(url);

        // Save the scraped data to a JSON file
        fs.writeFileSync('scrapedData.json', JSON.stringify(data, null, 2));

        // Redirect to the result page after scraping
        res.redirect('/result');
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).send('An error occurred while scraping the data.');
    }
});

// Serve the result page after scraping
app.get('/result', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'result.html'));  // Serve the result.html file
});

// Serve the scrapedData.json file
app.get('/scrapedData.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'scrapedData.json'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
