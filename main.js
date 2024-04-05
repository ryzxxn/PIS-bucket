import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import winston from 'winston';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });

// Define the image schema
const imageSchema = new mongoose.Schema({
  date: Date,
  url: String,
  type: String,
  uploaded_by: String,
});

// Create the Image model if not exists
const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

// Middleware
app.use(cors());
app.use(express.json({ limit: '2gb' }));
app.use(express.urlencoded({ limit: '2gb', extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  winston.error(err.message, err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Route to get all images
app.get('/images', async (req, res, next) => {
  try {
    const imageData = await Image.find({ $or: [{ type: 'image/jpeg' }, { type: 'image/gif' }] });
    res.json(imageData);
  } catch (error) {
    next(error);
  }
});

// Route to get all videos
app.get('/videos', async (req, res, next) => {
  try {
    const videoData = await Image.find({ type: 'video' });
    res.json(videoData);
  } catch (error) {
    next(error);
  }
});

// Route to get all documents
app.get('/documents', async (req, res, next) => {
  try {
    const documentData = await Image.find({ type: 'document' });
    res.json(documentData);
  } catch (error) {
    next(error);
  }
});

// Route to upload an image
app.post('/upload', async (req, res, next) => {
  try {
    const { date, url, type, uploaded_by } = req.body;
    // Validate request body
    if (!date || !url || !type || !uploaded_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newImage = new Image({ date, url, type, uploaded_by });
    const savedImage = await newImage.save();
    res.json(savedImage);
  } catch (error) {
    next(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
