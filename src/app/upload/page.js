"use client";
import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import Link from 'next/link';
import { IoMdHome } from 'react-icons/io';
import { IoIosLogOut } from 'react-icons/io';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';
import { AiOutlineLoading } from 'react-icons/ai';

export default function Upload() {
  const [userdata, setUserdata] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // New state for upload status

  useEffect(() => {
    const encryptedObject = sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION);
    if (sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION)) {
      const decryptedObject = JSON.parse(
        CryptoJS.AES.decrypt(encryptedObject, process.env.NEXT_PUBLIC_SECRET_KEY).toString(
          CryptoJS.enc.Utf8
        )
      );
      setUserdata(decryptedObject);
    }
  }, []);

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        console.log('User logged out');
        sessionStorage.removeItem(process.env.NEXT_PUBLIC_SESSION);
        setUserdata(null);
        router.push('/'); // navigate to the home page
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    // Check if all files are images and smaller than 32MB
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        alert('Please select image files only');
        return false;
      }

      if (file.size > 32 * 1024 * 1024) {
        alert('File size is too large. Please select files smaller than 32MB');
        return false;
      }

      return true;
    });

    setSelectedFiles(validFiles);
    setUploadedFiles([]); // Reset uploaded files when new files are selected
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setIsUploading(true); // Set upload status to true

    const mediaResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DB_DOMAIN}/users/${userdata.userId}/media.json`
    );
    const existingMedia = await mediaResponse.json();

    const updatedMedia = existingMedia ? [...existingMedia] : [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('key', process.env.NEXT_PUBLIC_IBB_API_KEY);
      formData.append('image', file);

      try {
        const response = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        const imageDetails = {
          url: data.data.url,
          thumbUrl: data.data.thumb.url,
        };

        updatedMedia.push(imageDetails);
      } catch (error) {
        console.error(error);
      }
    }

    try {
      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_DB_DOMAIN}/users/${userdata.userId}/media.json`,
        {
          method: 'PUT',
          body: JSON.stringify(updatedMedia),
        }
      );

      const updateData = await updateResponse.json();
      setUploadedFiles(selectedFiles);
      setIsUploading(false); // Set upload status to false
    } catch (error) {
      console.error(error);
      setIsUploading(false); // Set upload status to false in case of error
    }
  };

  return (
    <div className="herobg" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="navbar">
        <div style={{display: 'flex',justifyContent: 'end',padding: '.8rem 1rem',alignItems: 'center',}}>
          {userdata ? (
            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center',gap: '.6rem',}}>
              <Link href="/dashboard"style={{color: 'white',textDecoration: 'none',background: 'none',border: 'none',cursor: 'pointer',display: 'flex',alignItems: 'center',justifyContent: 'center',}}>
                <IoMdHome style={{ fontSize: '1.4rem' }} />
              </Link>
              <button onClick={handleSignOut}style={{color: 'white',textDecoration: 'none',background: 'none',border: 'none',cursor: 'pointer',display: 'flex',alignItems: 'center',justifyContent: 'center',}}>
                <IoIosLogOut style={{ fontSize: '1.4rem' }} />
              </button>
              <img src={userdata.userImage}alt=""style={{ borderRadius: '50%', maxHeight: '2.5rem', width: 'auto' }}></img>
            </div>
          ) : (
            <Link href="/signup" style={{ color: 'white', fontSize: '1.2rem', textDecoration: 'none' }}>
              Signup
            </Link>
          )}
        </div>
      </div>
      <div style={{display: 'flex',flex: '1',padding: '0rem 0rem',alignItems: 'center',justifyContent: 'start',flexDirection: 'column',overflowY: 'hidden',height: '100%'}}>
        <div className="input_module" style={{display: 'flex', padding: '1rem 0rem', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center'}}>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} style={{outline: '2px dotted white',padding: '2rem',display: 'flex',alignItems: 'center',justifyContent: 'center',borderRadius: '1rem',}}/>
          <button onClick={handleUpload} style={{width: 'max-content',color: 'white',backgroundColor: 'transparent',border: 'none',fontSize: '2rem',}} disabled={isUploading}>
            {isUploading ? (
              <AiOutlineLoading className="rotate-animation" /> // Show loader with rotation animation
            ) : (
              <IoCloudUploadOutline />
            )}
          </button>
        </div>

        {/* Display selected file previews */}
        {selectedFiles && (
          <div style={{display: 'flex',gap: '1rem',flexWrap: 'wrap',justifyContent: 'space-evenly',backgroundColor: 'rgb(0, 0, 0, 0.200)',padding: '1rem',borderRadius: '1rem',margin: '0rem 1rem',overflowY: 'scroll',height: 'max-content'}}>
          {selectedFiles.map((file, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} style={{ maxWidth: '100px', maxHeight: '100px' }}/>
              {uploadedFiles.includes(file) && (
                <FaCheckCircle style={{position: 'absolute',top: '5px',right: '5px',color: 'green',}}/>
              )}
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}