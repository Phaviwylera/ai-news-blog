const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Allow frontend requests
const cors = require('cors');
app.use(cors());

// Serve news articles from posts.json
app.get('/api/news', (req, res) => {
  const filePath = path.join(__dirname, 'posts.json');

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    try {
      const posts = JSON.parse(data);
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: 'Failed to parse posts.json' });
    }
  } else {
    res.status(404).json({ error: 'posts.json not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
