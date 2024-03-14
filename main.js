import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

// Load environment variables from .env file
dotenv.config();
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2gb' }));
app.use(express.urlencoded({ limit: '2gb', extended: true }));
const port = 3000; // Use process.env.PORT if available, or default to 3000

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
  type: String,
  uploaded_by: String,
});

// Create the Image model if not exists
const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

// Middleware to parse JSON in the request body
app.use(express.json());

// Route to get all images
app.get('/images', async (req, res) => {
  try {
    // Filter images where type is 'image/jpeg'
    const imageData = await Image.find({ type: 'image/jpeg' });
    res.json(imageData);
  } catch (error) {
    console.error('Error retrieving images:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/videos', async (req, res) => {
  try {
    // Filter videos where type is 'video'
    const videoData = await Image.find({ type: 'video' });
    res.json(videoData);
  } catch (error) {
    console.error('Error retrieving videos:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to upload an image
app.post('/upload', async (req, res) => {
  try {
    // Assuming you're sending image_date, image_url, and image_uploaded_by in the request body
    const { date, url, type, uploaded_by } = req.body;
    
    console.log(date, uploaded_by, url);
    const newImage = new Image({
      date : date,
      url : url,
      type: type,
      uploaded_by: uploaded_by,
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
