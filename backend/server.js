const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');
const cron = require('node-cron');

const app = express();
const PORT = 5000;

// Path to the scraped posts file (make sure this is correct!)
const POSTS_PATH = path.join(__dirname, '../news_crawler/posts.json');
const SCRAPER_PATH = path.join(__dirname, '../news_crawler/fetch_news.py');

// Enable CORS so frontend can access backend
app.use(cors());

// Endpoint to return posts
app.get('/api/posts', (req, res) => {
  fs.readFile(POSTS_PATH, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading posts.json:', err.message);
      return res.status(500).json({ error: 'Failed to read posts.json' });
    }

    try {
      const posts = JSON.parse(data);
      res.json(posts);
    } catch (parseErr) {
      console.error('Invalid JSON in posts.json:', parseErr.message);
      res.status(500).json({ error: 'Invalid JSON format in posts.json' });
    }
  });
});

// Run the Python scraper
function runScraper() {
  console.log('Running Python scraper...');

  const python = spawn('python', [SCRAPER_PATH]);

  python.stdout.on('data', (data) => {
    console.log(`[PYTHON STDOUT]: ${data.toString()}`);
  });

  python.stderr.on('data', (data) => {
    console.error(`[PYTHON ERROR]: ${data.toString()}`);
  });

  python.on('close', (code) => {
    if (code === 0) {
      console.log('Scraper finished successfully.');
    } else {
      console.error(`Scraper exited with code ${code}`);
    }
  });
}

// Run scraper on server start
runScraper();

// Run scraper every 30 minutes
cron.schedule('*/30 * * * *', () => {
  runScraper();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
