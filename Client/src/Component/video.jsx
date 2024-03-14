import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function VidGifDownload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const BOT_TOKEN = '7167183620:AAHzEmlzEHw3fTlOgJBEr8CWs1DY54D3fuw';
  const CHAT_ID = '6744916119';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile) {
        console.error('No file selected.');
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('chat_id', CHAT_ID);

      const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: 2147483648, // 2GB in bytes
      });

      const fileId = response.data.result.video.file_id;

      await getFileLink(fileId);
    } catch (error) {
      console.error('Error uploading file:', error.message);
      if (error.response && error.response.status === 413) {
        window.alert('File is too large. Please select a smaller file.');
      } else if (error.response && error.response.status === 400) {
        window.alert('Upload failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFileLink = async (fileId) => {
    try {
      const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
      const filePath = response.data.result.file_path;
      const directDownloadLink = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

      setDownloadUrl(directDownloadLink);
      sendVideoURL(directDownloadLink);

      // console.log('Direct download link retrieved successfully:', directDownloadLink);
    } catch (error) {
      console.error('Error retrieving direct download link:', error.message);
    }
  };

  const sendVideoURL = async (videoUrl) => {
    try {
      const saveVideoDB = {
        date: new Date().toString(),
        url: videoUrl,
        type: 'video',
        uploaded_by: 'elton', // Replace with your user information or get dynamically
      };

      await axios.post('https://upload-io.onrender.com/upload', saveVideoDB);
      // console.log('Video URL sent successfully:', videoUrl);
      window.location.reload()
    } catch (error) {
      console.error('Error sending video URL:', error.message);
    }
  };

  return (
    <>
      <div className='input_cont'>
        <h3>Upload video</h3>
        <input className='upload_void' type="file" accept="video/*, image/gif" onChange={handleFileChange} />
        {selectedFile && (
          <div className='upload_cont'>
            <video src={URL.createObjectURL(selectedFile)} alt="Selected" style={{ maxWidth: '20rem', marginTop: '10px' }} controls />
            <button className='upload_button' onClick={handleFileUpload} disabled={loading}>
              Upload
            </button>
          </div>
        )}
      </div>
    </>
  )
}