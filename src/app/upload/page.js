"use client"
import {useState, useEffect} from 'react'
import CryptoJS from 'crypto-js';
import Link from 'next/link';
import { IoMdHome } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Upload() {

    const [userdata, setUserdata] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const encryptedObject = sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION);
        if (sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION)) {
          const decryptedObject = JSON.parse(CryptoJS.AES.decrypt(encryptedObject, process.env.NEXT_PUBLIC_SECRET_KEY).toString(CryptoJS.enc.Utf8));
          setUserdata(decryptedObject)
        }
      }, []);

    //   console.log(userdata)

      function handleSignOut() {
        signOut(auth)
          .then(() => {
            console.log("User logged out");
            sessionStorage.removeItem(process.env.NEXT_PUBLIC_SESSION)
            setUserdata(null)
            router.push('/') // navigate to the home page
          })
          .catch((error) => {
            console.error("Error logging out:", error);
          });
      }

      const handleFileChange = (event) => {
        const file = event.target.files[0];

        // Check if the file is an image
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file');
          return;
        }

        // Check if the file is larger than 32MB
        if (file.size > 32 * 1024 * 1024) {
          alert('File size is too large. Please select a file smaller than 32MB');
          return;
        }

        setSelectedFile(file);
      };

      const handleUpload = async () => {
        if (!selectedFile) {
          alert('Please select a file to upload');
          return;
        }
      
        const formData = new FormData();
        formData.append('key', process.env.NEXT_PUBLIC_IBB_API_KEY);
        formData.append('image', selectedFile);
      
        try {
          const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
          });
      
          const data = await response.json();
      
          console.log(data);
      
          const imageDetails = {
            url: data.data.url,
            thumbUrl: data.data.thumb.url
          };
      
          const mediaResponse = await fetch(`${process.env.NEXT_PUBLIC_DB_DOMAIN}/users/${userdata.userId}/media.json`);
          const existingMedia = await mediaResponse.json();
      
          const updatedMedia = existingMedia ? [...existingMedia, imageDetails] : [imageDetails];
      
          const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_DB_DOMAIN}/users/${userdata.userId}/media.json`, {
            method: 'PUT',
            body: JSON.stringify(updatedMedia)
          });
      
          const updateData = await updateResponse.json();
      
        //   setMedia(updatedMedia);
        } catch (error) {
          console.error(error);
        }
      };

  return (
    <>
    <div className='herobg' style={{display: 'flex',flexDirection: 'column'}}>
      <div className='navbar'>
        <div style={{display: 'flex', justifyContent: 'end', padding: '.8rem 1rem', alignItems: 'center'}}>
          {userdata ? (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem'}}>
              <Link href="/dashboard" style={{color: 'white', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><IoMdHome style={{fontSize: '1.4rem'}}/></Link>
              <button onClick={handleSignOut} style={{color: 'white', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><IoIosLogOut style={{fontSize: '1.4rem'}}/></button>
              <img src={userdata.userImage} alt='' style={{borderRadius: '50%', maxHeight: '2.5rem', width: 'auto'}}></img>
            </div>
          ) : (
            <Link href="/signup" style={{color: 'white', fontSize: '1.2rem', textDecoration: 'none'}}>Signup</Link>
          )}
        </div>
      </div>
      <div style={{display: 'flex', flex: 1, padding: '0rem 0rem', }}>
        <div className='input_module'>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button onClick={handleUpload}>Upload</button>
          <div style={{overflowY: 'scroll'}}>
          {userdata && userdata.media && userdata.media.map((image, index) => (
            <div key={index}>
            <img src={image.thumbUrl} alt={`Uploaded image ${index}`} />
            <p>{image.url}</p>
            </div>
        ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}