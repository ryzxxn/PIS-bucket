import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Image() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorImageIndex, setErrorImageIndex] = useState(null);

  const BOT_TOKEN = '7167183620:AAHzEmlzEHw3fTlOgJBEr8CWs1DY54D3fuw';
  const CHAT_ID = '6744916119';

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
        formData.append('photo', image);
        formData.append('chat_id', CHAT_ID);

        const isGif = image.type === 'image/gif';

        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/send${isGif ? 'Animation' : 'Photo'}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const fileId = response.data.result[isGif ? 'animation' : 'photo'][3].file_id;
        const fileLink = await getFileLink(fileId);
        await sendImageURL(fileLink);
      }
    } catch (error) {
      console.error('Error uploading images:', error.message);
      if (error.response && error.response.status === 413) {
        // Payload too large error
        setErrorImageIndex(selectedImages.indexOf(error.config.data.get('photo')));
      }
    } finally {
      setLoading(false);
    }
  };

  const getFileLink = async (fileId) => {
    try {
      const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
      const filePath = response.data.result.file_path;
      return `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    } catch (error) {
      console.error('Error retrieving direct download link:', error.message);
      throw error;
    }
  };

  const sendImageURL = async (imageUrl) => {
    try {
      // Assuming you have an endpoint to save the image URL to the database
      const saveImageDB = {
        date: new Date().toString(),
        url: imageUrl,
        // You can determine the type based on the file extension or content type
        type: imageUrl.endsWith('.gif') ? 'image/gif' : 'image/jpeg',
        uploaded_by: 'elton',
      };

      await axios.post('https://upload-io.onrender.com/upload', saveImageDB);
    } catch (error) {
      console.error('Error sending image URL to database:', error.message);
    }
  };

  return (
    <>
      <div className='input_cont'>
        <h3>Upload images</h3>
        <input className='upload_void' type="file" accept="image/*,.gif" onChange={handleImageChange} multiple />
      </div>
      <div className='upload_cont'>
        <button className='upload_button' onClick={handleImagesUpload} disabled={loading}>
          Upload Images
        </button>
        {errorImageIndex !== null && (
          <p>Error uploading image {errorImageIndex + 1}: File too large</p>
        )}
      </div>
    </>
  )
}