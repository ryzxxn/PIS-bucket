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
app.use(express.json({ limit: '2gb' }));
app.use(express.urlencoded({ limit: '2gb', extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  winston.error(err.message, err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Route to get all images
app.get('/images', async (req, res, next) => {
  const {apikey, user, type} = req.query
    if (apikey === API_KEY ) {
      const imageData = await Image.find({email: user, type: type });
      res.json(imageData);
    }
    else{
      res.json("error")
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
