// routes/images.js

import express from 'express';
import Image from '../models/image.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET / - render the gallery
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    const htmlPath = path.join(__dirname, '../views/index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    const imageElements = images.map(img => `
      <div class="image-item">
        <img src="${img.url}" alt="Image" />
      </div>
    `).join('\n');

    html = html.replace('<!--IMAGE_GALLERY-->', imageElements);

    res.send(html);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST /add - add a new image URL
router.post('/add', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send('Image URL is required');

  try {
    await Image.create({ url });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Failed to add image');
  }
});

// POST /delete - delete an image by URL
router.post('/delete', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('URL is required');

  try {
    await Image.deleteOne({ url });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Failed to delete image');
  }
});

export default router;
