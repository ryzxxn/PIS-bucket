import React, { useState } from 'react';
import axios from 'axios';

export default function Document() {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const CLIENT_API_KEY = 'eeae8ed20280fd7fe151cf0e86dff11e'; // Replace with your imgBB API key

  const handleDocumentChange = (e) => {
    const files = e.target.files;
    setSelectedDocuments(Array.from(files));
  };

  const handleDocumentsUpload = async () => {
    try {
      setLoading(true);

      for (let i = 0; i < selectedDocuments.length; i++) {
        const document = selectedDocuments[i];
        const formData = new FormData();
        formData.append('image', document);

        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${CLIENT_API_KEY}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const documentUrl = response.data.data.url;
        await sendDocumentURLToDatabase(documentUrl);
        alert('Document uploaded successfully! URL: ' + documentUrl);
      }
    } catch (error) {
      console.error('Error uploading documents:', error.message);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const sendDocumentURLToDatabase = async (documentUrl) => {
    try {
      const saveDocumentDB = {
        date: new Date().toString(),
        url: documentUrl,
        type: 'document', // Assuming it's a document
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
        <h3>Upload documents (MAX SIZE 10mb)</h3>
        <input className='upload_void' type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleDocumentChange} multiple />
        <div className='upload_cont'>
          <button className='upload_button' onClick={handleDocumentsUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Documents'}
          </button>
        </div>
      </div>
    </>
  );
}
