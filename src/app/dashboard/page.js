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
import Image from 'next/image'
import { IoImageSharp } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";

export default function Dashboard() {

  const [userdata, setUserdata] = useState(null)
  const [media, setMedia] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 20; // adjust this value as needed
  const router = useRouter()

  useEffect(() => {
    const encryptedObject = sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION);
    if (sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION)) {
      const decryptedObject = JSON.parse(CryptoJS.AES.decrypt(encryptedObject, process.env.NEXT_PUBLIC_SECRET_KEY).toString(CryptoJS.enc.Utf8));
      setUserdata(decryptedObject)
      fetchMedia(decryptedObject.userId);
    }
    else{
      router.push('/')
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

  // Calculate the index of the first and last image to display
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = media.slice(indexOfFirstImage, indexOfLastImage);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle next and previous buttons
  const handleNextPage = () => {
    if (currentPage < Math.ceil(media.length / imagesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className='herobg' style={{ display: 'flex', flexDirection: 'column', overflowY: 'scroll', flex: '1' }}>
        <div className='navbar' style={{position: 'sticky',top: '0px', backgroundColor: 'rgb(24, 24, 24)'}}>
          <div style={{ display: 'flex', justifyContent: 'end', padding: '.8rem 1rem', alignItems: 'center' }}>
            {userdata ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem' }}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <IoImageSharp style={{ color: 'white', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'}}  />
                  <p style={{color: 'white'}}>{media.length}</p>
                </div>
                <Link href="/upload" style={{ color: 'white', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MdFileUpload style={{ fontSize: '1.4rem' }} /></Link>
                <button onClick={handleSignOut} style={{ color: 'white', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IoIosLogOut style={{ fontSize: '1.4rem' }} /></button>
                <img src={userdata.userImage} alt='' style={{ borderRadius: '50%', maxHeight: '2.5rem', width: 'auto' }}></img>
              </div>
            ) : (
              <Link href="/signup" style={{ color: 'white', fontSize: '1.2rem', textDecoration: 'none' }}>Signup</Link>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '1rem', margin: '1rem' }}>
          <button onClick={handlePrevPage} disabled={currentPage === 1} style={{backgroundColor: 'transparent', border: 'none',  color: 'white', fontSize: '1.6rem'}}>
          <GrFormPrevious />
          </button>
          {/* Add your pagination component here */}
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(media.length / imagesPerPage)} style={{backgroundColor: 'transparent', border: 'none',  color: 'white', fontSize: '1.6rem'}}>
          <GrFormNext />
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, padding: '0rem 2rem', justifyContent: 'center' }}>
          <div className='image_container' style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '.5rem .5rem', justifyContent: 'center', alignItems: 'center', width: 'max-content' }}>
            <div style={{ width: 'auto', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {media && currentImages.length > 0 ? (
                currentImages.slice().reverse().map((image, index) => (
                  <div key={index}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Image
                        src={image.thumbUrl}
                        alt={<AiOutlineLoading3Quarters />}
                        width={100} // replace with your desired width
                        height={100} // replace with your desired height
                        quality={1}
                        priority={false}
                      />
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
        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '1rem', margin: '1rem' }}>
          <button onClick={handlePrevPage} disabled={currentPage === 1} style={{backgroundColor: 'transparent', border: 'none',  color: 'white', fontSize: '1.6rem'}}>
          <GrFormPrevious />
          </button>
          {/* Add your pagination component here */}
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(media.length / imagesPerPage)} style={{backgroundColor: 'transparent', border: 'none',  color: 'white', fontSize: '1.6rem'}}>
          <GrFormNext />
          </button>
        </div>
      </div>
    </>
  )
}
