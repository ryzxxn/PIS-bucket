import React, { useState } from 'react';
import axios from 'axios';

export default function Image() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const CLIENT_API_KEY = 'eeae8ed20280fd7fe151cf0e86dff11e'; // Replace with your imgBB API key

  const handleImageChange = (e) => {
    const files = e.target.files;
    setSelectedImages(Array.from(files));
  };

  const handleImagesUpload = async () => {
    try {
      setLoading(true);

      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        const formData = new FormData();
        formData.append('image', image);

        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${CLIENT_API_KEY}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const imageUrl = response.data.data.url;
        await sendImageURLToDatabase(imageUrl);
        alert('Image uploaded successfully! URL: ' + imageUrl);
      }
    } catch (error) {
      console.error('Error uploading images:', error.message);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const sendImageURLToDatabase = async (imageUrl) => {
    try {
      const saveImageDB = {
        date: new Date().toString(),
        url: imageUrl,
        type: imageUrl.endsWith('.gif') ? 'image/gif' : 'image/jpeg', // Update type based on file extension
        uploaded_by: 'elton',
      };

      const response = await axios.post('https://upload-io.onrender.com/upload', saveImageDB);
      console.log('Image URL saved to database:', response.data); // Log response for debugging
    } catch (error) {
      console.error('Error sending image URL to database:', error.message);
      throw error; // Rethrow the error for further debugging
    }
  };

  return (
    <>
      <div className='input_cont'>
        <h3>Upload images</h3>
        <input className='upload_void' type="file" accept="image/*" onChange={handleImageChange} multiple />
        <div className='upload_cont'>
          <button className='upload_button' onClick={handleImagesUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Images'}
          </button>
        </div>
      </div>
    </>
  );
}
