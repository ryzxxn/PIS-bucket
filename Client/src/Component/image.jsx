import React, { useState } from 'react';
import axios from 'axios';

export default function Image() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

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
          maxContentLength: 2147483648, // 2GB in bytes
        });

        const fileId = response.data.result[isGif ? 'animation' : 'photo'][3].file_id;
        const fileLink = await getFileLink(fileId);
        await sendImageURL(fileLink);
      }
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error.message);
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 413) {
          // Payload too large error
          alert('File is too large. Please select a smaller file.');
        } else if (statusCode === 400) {
          // Bad request error
          alert('Upload failed. Please try again later.');
        }
      } else {
        // Network or unexpected errors
        alert('An error occurred. Please try again later.');
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
      const saveImageDB = {
        date: new Date().toString(),
        url: imageUrl,
        type: imageUrl.endsWith('.gif') ? 'image/gif' : 'image/jpeg', // Update type based on file extension
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
        <h3>Upload images (MAX SIZE 10mb)</h3>
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
