import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Document() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorFileIndex, setErrorFileIndex] = useState(null);

  const BOT_TOKEN = '7167183620:AAHzEmlzEHw3fTlOgJBEr8CWs1DY54D3fuw';
  const CHAT_ID = '6744916119';

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(Array.from(files));
  };

  const handleFilesUpload = async () => {
    try {
      setLoading(true);

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('document', file);

        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            chat_id: CHAT_ID,
          }
        });

        const fileId = response.data.result.document.file_id;
        const fileLink = await getFileLink(fileId);
        await sendDocumentURL(fileLink);
      }
    } catch (error) {
      console.error('Error uploading files:', error.message);
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
      return `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    } catch (error) {
      console.error('Error retrieving direct download link:', error.message);
      throw error;
    }
  };

  const sendDocumentURL = async (documentUrl) => {
    try {
      const saveDocumentDB = {
        date: new Date().toString(),
        url: documentUrl,
        type: 'document', // Assuming all uploaded files are documents
        uploaded_by: 'elton',
      };

      await axios.post('https://upload-io.onrender.com/upload', saveDocumentDB);
    } catch (error) {
      console.error('Error sending document URL to database:', error.message);
    }
  };

  return (
    <>
      <div className='input_cont'>
        <h3>Upload documents (MAX SIZE 50mb)</h3>
        <input className='upload_void' type="file" accept=".docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} multiple />
        <div className='upload_cont'>
          <button className='upload_button' onClick={handleFilesUpload} disabled={loading}>
            Upload Documents
          </button>
        </div>
      </div>
    </>
  );
}