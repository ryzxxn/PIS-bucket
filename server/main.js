import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL)
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
  email: String,
  type: String,
  uploaded_by: String,
});

// Create the Image model if not exists
const Image = mongoose.model('Image', imageSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// Error handling middleware
app.use((err, req, res, next) => {
  winston.error(err.message, err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Route to get all images
app.get('/images', async (req, res, next) => {
  const { apikey, user, type } = req.query;
  if (apikey === API_KEY) {
    try {
      // Fetch images from the database, sorted by date in reverse order
      const imageData = await Image.find({ email: user, type: type }).sort({ date: -1 });
      res.json(imageData);
    } catch (error) {
      console.error('Error fetching images:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});


app.get('/delete', async (req, res, next) => {
  try {
    const { apikey, user, url } = req.query;

    // Validate API key and parameters
    if (apikey !== API_KEY || !user || !url) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // Delete the image entry
    const imageData = await Image.findOneAndDelete({ email: user, url: url });
    
    if (!imageData) {
      return res.status(404).json({ error: 'Image not found' });
    }

    return res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to upload an image
app.post('/upload', async (req, res, next) => {
  try {
    const { date, url, email, type, uploaded_by } = req.body;
    // Validate request body
    if (!date || !url || !type || !uploaded_by || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newImage = new Image({ date, url, type, uploaded_by, email });
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
