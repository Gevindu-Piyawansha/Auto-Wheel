// Simple Node.js Express API for Success Stories
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// In-memory store (replace with DB for production)
let stories = [];

// GET all success stories
app.get('/api/success-stories', (req, res) => {
  res.json(stories);
});

// POST a new success story
app.post('/api/success-stories', (req, res) => {
  const { customerName, location, photo, description } = req.body;
  if (!customerName || !location || !photo || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  stories.push({ customerName, location, photo, description });
  res.status(201).json({ message: 'Story added' });
});

app.listen(PORT, () => {
  console.log(`Success Stories API running on port ${PORT}`);
});
