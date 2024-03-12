import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
import cors from 'cors';

const app = express();
app.use(cors());
const port = process.env.PORT || 3000; // Use process.env.PORT if available, or default to 3000

// Access the DATABASE_URL variable
const databaseUrl = process.env.DATABASE_URL;

// MongoDB connection
mongoose.connect(databaseUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });

// Define the image schema
const imageSchema = new mongoose.Schema({
  image_date: Date,
  image_url: String,
  image_uploaded_by: String,
});

// Create the Image model if not exists
const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

// Middleware to parse JSON in the request body
app.use(express.json());

// Route to get all images
app.get('/images', async (req, res) => {
  try {
    const imageData = await Image.find({});
    res.json(imageData);
  } catch (error) {
    console.error('Error retrieving images:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to upload an image
app.post('/uploadImage', async (req, res) => {
  try {
    // Assuming you're sending image_date, image_url, and image_uploaded_by in the request body
    const { image_date, image_url, image_uploaded_by } = req.body;
    
    console.log(image_date, image_uploaded_by, image_url);
    const newImage = new Image({
      image_date : image_date,
      image_url : image_url,
      image_uploaded_by: image_uploaded_by,
    });

    const savedImage = await newImage.save();
    res.json(savedImage);
  } catch (error) {
    console.error('Error uploading image:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
