import Dashnavbar from '../components/dashNavbar'
import React, { useState } from 'react';
import axios from 'axios';

export default function Upload() {

  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const IMG_CLIENT_API_KEY = import.meta.env.VITE_IMGBB; // Replace with your imgBB API key
  const endpoint = import.meta.env.VITE_DOMAIN_ENDPOINT; // Replace with your imgBB API key
  // console.log(IMG_CLIENT_API_KEY);

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

        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMG_CLIENT_API_KEY}`, formData, {
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
        email: sessionStorage.getItem('email'),
        type: imageUrl.endsWith('.gif') ? 'gif' : 'image', // Update type based on file extension
        uploaded_by: sessionStorage.getItem('Display_name')
      };

      const response = await axios.post(endpoint+'/upload', saveImageDB);
      console.log('Image URL saved to database:', response.data); // Log response for debugging
    } catch (error) {
      console.error('Error sending image URL to database:', error.message);
      throw error; // Rethrow the error for further debugging
    }
  };

  return (
    <>
    <Dashnavbar/>
    <div>
    <div className='input_cont'>
        <h3>Upload images</h3>
        <input className='upload_void' type="file" accept="image/*" onChange={handleImageChange} multiple />
        <div className='upload_cont'>
          <button className='upload_button' onClick={handleImagesUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Images'}
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
