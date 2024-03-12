import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileLink, setFileLink] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [loading, setLoading] = useState(false);

  const BOT_TOKEN = '7167183620:AAHzEmlzEHw3fTlOgJBEr8CWs1DY54D3fuw'; // Replace with your actual bot token
  const CHAT_ID = '6744916119'; // Replace with your actual chat ID

  useEffect(() => {
    if (fileId) {
      getFileLink(fileId);
    }
  }, [fileId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleImageUpload = async () => {
    try {
      setLoading(true);

      if (!selectedImage) {
        throw new Error('Please select an image to upload.');
      }

      const formData = new FormData();
      formData.append('photo', selectedImage);
      formData.append('chat_id', CHAT_ID);

      const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const photoFileId = response.data.result.photo[3].file_id;
      setFileId(photoFileId);
    } catch (error) {
      console.error('Error uploading image:', error.message);
      // Provide user-friendly error message or handle differently based on your application's requirements
    } finally {
      setLoading(false);
    }
  };

  const getFileLink = async (fileId) => {
    try {
      const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
      const filePath = response.data.result.file_path;
      const directDownloadLink = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
      setFileLink(directDownloadLink);

      const saveImageDB = {
        image_date: new Date().toString(),
        image_url: directDownloadLink,
        image_uploaded_by: 'elton', // Replace with your user information or get dynamically
      };

      await axios.post('https://upload-io.onrender.com/uploadImage', saveImageDB);

      window.location.reload();
      console.log('Direct download link retrieved successfully:', directDownloadLink);
    } catch (error) {
      console.error('Error retrieving direct download link:', error.message);
    }
  };

  return (
    <>
    <div className='navbar'>
    <Link className='link' to="/">Home</Link>
    <Link className='link' to="gallery">Photos</Link>
    </div>
    <div>
      <div className='text_cont'>
        <h2>Image-IO</h2>
        <p>Personal Image Storage</p>
      </div>
      <div className='input_cont'>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      {selectedImage && (
        <div className='upload_cont'>
          <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ maxWidth: '20rem', marginTop: '10px' }} />
          <button className='upload_button' onClick={handleImageUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      )}
    </div>
</>
  );
};

export default ImageUploader;