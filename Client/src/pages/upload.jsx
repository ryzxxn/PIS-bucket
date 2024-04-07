import React, { useState } from 'react';
import axios from 'axios';
import Dashnavbar from '../components/dashNavbar';
import imageCompression from 'browser-image-compression';

export default function Upload() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const IMG_CLIENT_API_KEY = import.meta.env.VITE_IMGBB;
  const endpoint = import.meta.env.VITE_DOMAIN_ENDPOINT;

  const handleImageChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const handleImagesUpload = async () => {
    setLoading(true);
    try {
      const uploadPromises = selectedImages.map(async (image) => {
        let formData = new FormData();
        
        // Check if the file is a GIF
        const isGif = image.type === 'image/gif';

        // If it's not a GIF, compress the image
        const compressedImage = isGif ? image : await compressImage(image);

        formData.append('image', compressedImage);
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${IMG_CLIENT_API_KEY}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        const imageUrl = response.data.data.url;
        await sendImageURLToDatabase(imageUrl, image.type); // Pass file type to determine if it's a GIF
        return imageUrl;
      });

      const uploadedImagesUrls = await Promise.all(uploadPromises);
      console.log('Uploaded Images URLs:', uploadedImagesUrls);
    } catch (error) {
      console.error('Error uploading images:', error.message);
      alert('An error occurred while uploading images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const compressImage = async (image) => {
    try {
      const compressedImage = await imageCompression(image, { maxFileSizeMB: .5 });
      return compressedImage;
    } catch (error) {
      console.error('Error compressing image:', error.message);
      throw error;
    }
  };

  const sendImageURLToDatabase = async (imageUrl, fileType) => {
    try {
      const saveImageDB = {
        date: new Date().toString(),
        url: imageUrl,
        email: sessionStorage.getItem('email'),
        type: fileType === 'image/gif' ? 'gif' : 'image', // Determine the file type here
        uploaded_by: sessionStorage.getItem('Display_name'),
      };
      const response = await axios.post(`${endpoint}/upload`, saveImageDB);
      console.log('Image URL saved to database:', response.data);
    } catch (error) {
      console.error('Error sending image URL to database:', error.message);
      throw error;
    }
  };

  return (
    <>
      <Dashnavbar />
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
  );
}
