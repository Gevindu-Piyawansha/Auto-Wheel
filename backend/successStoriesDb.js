// Node.js Express API for Success Stories with persistent storage (using a JSON file)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const DB_FILE = path.join(__dirname, 'stories.json');

app.use(cors());
app.use(bodyParser.json());

// Helper to read/write stories
function readStories() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}
function writeStories(stories) {
  fs.writeFileSync(DB_FILE, JSON.stringify(stories, null, 2));
}

// GET all success stories
app.get('/api/success-stories', (req, res) => {
  res.json(readStories());
});

// POST a new success story
app.post('/api/success-stories', (req, res) => {
  const { customerName, location, photo, description } = req.body;
  if (!customerName || !location || !photo || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const stories = readStories();
  stories.push({ customerName, location, photo, description });
  writeStories(stories);
  res.status(201).json({ message: 'Story added' });
});

app.listen(PORT, () => {
  console.log(`Success Stories API with DB running on port ${PORT}`);
});
