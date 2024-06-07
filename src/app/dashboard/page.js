"use client"
import { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import { IoIosLogOut } from "react-icons/io";
import Link from 'next/link';
import { MdFileUpload } from "react-icons/md";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { CiLink } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

export default function Dashboard() {

  const [userdata, setUserdata] = useState(null)
  const [media, setMedia] = useState([]);
  const router = useRouter()

  useEffect(() => {
    const encryptedObject = sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION);
    if (sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION)) {
      const decryptedObject = JSON.parse(CryptoJS.AES.decrypt(encryptedObject, process.env.NEXT_PUBLIC_SECRET_KEY).toString(CryptoJS.enc.Utf8));
      setUserdata(decryptedObject)
      fetchMedia(decryptedObject.userId);
    }
  }, []);

  const fetchMedia = async (userId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DB_DOMAIN}/users/${userId}/media.json`);
      const data = await response.json();
      setMedia(data);
    } catch (error) {
      console.error(error);
    }
  };

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        sessionStorage.removeItem(process.env.NEXT_PUBLIC_SESSION)
        setUserdata(null)
        router.push('/') // navigate to the home page
      })
      .catch((error) => {
        // console.error("Error logging out:", error);
      });
  }

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert(`Copied ${url} to clipboard`);
  };

  const handleDeleteImage = (imageUrl) => {
    const updatedMedia = media.filter((image) => image.url !== imageUrl);

    fetch(`${process.env.NEXT_PUBLIC_DB_DOMAIN}/users/${userdata.userId}/media.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedMedia),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('Image deleted successfully:', data);
        // Update the state with the new media array
        setMedia(updatedMedia);
      })
      .catch((error) => {
        console.error('Error deleting image:', error);
      });
  };

  return (
    <>
      <div className='herobg' style={{ display: 'flex', flexDirection: 'column', overflowY: 'scroll', flex: '1' }}>
        <div className='navbar'>
          <div style={{ display: 'flex', justifyContent: 'end', padding: '.8rem 1rem', alignItems: 'center' }}>
            {userdata ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem' }}>
                <Link href="/upload" style={{ color: 'white', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MdFileUpload style={{ fontSize: '1.4rem' }} /></Link>
                <button onClick={handleSignOut} style={{ color: 'white', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IoIosLogOut style={{ fontSize: '1.4rem' }} /></button>
                <img src={userdata.userImage} alt='' style={{ borderRadius: '50%', maxHeight: '2.5rem', width: 'auto' }}></img>
              </div>
            ) : (
              <Link href="/signup" style={{ color: 'white', fontSize: '1.2rem', textDecoration: 'none' }}>Signup</Link>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, padding: '0rem 2rem', justifyContent: 'center' }}>
          <div className='image_container' style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '.5rem .5rem', justifyContent: 'center', alignItems: 'start', width: 'max-content' }}>
            <div style={{ width: 'auto', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'start' }}>
              {media && Object.values(media).length > 0 ? (
                Object.values(media).map((image, index) => (
                  <div key={index}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <img src={image.thumbUrl} alt={`Uploaded image ${index}`} style={{ height: '7rem' }} />
                      <div style={{ display: 'flex' }}>
                        <CiLink onClick={() => handleCopyUrl(image.url)} style={{ color: 'white', fontSize: '1.2rem' }} />
                        <MdDelete onClick={() => handleDeleteImage(image.url)} style={{ color: 'white', fontSize: '1.2rem' }} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'white' }}>No media available.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}