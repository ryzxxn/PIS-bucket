"use client"
import {useEffect, useState} from 'react'
import CryptoJS from 'crypto-js';
import { IoIosLogOut } from "react-icons/io";
import Link from 'next/link';
import { MdFileUpload } from "react-icons/md";

export default function Dashboard() {

  const [userdata, setUserdata] = useState({})

    useEffect(() => {
      const encryptedObject = sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION);
      if (sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION)) {
        const decryptedObject = JSON.parse(CryptoJS.AES.decrypt(encryptedObject, process.env.NEXT_PUBLIC_SECRET_KEY).toString(CryptoJS.enc.Utf8));
        setUserdata(decryptedObject)
      }
    }, []);

    console.log(userdata);

    function handleSignOut() {
      signOut(auth)
        .then(() => {
          console.log("User logged out");
          sessionStorage.removeItem(process.env.NEXT_PUBLIC_SESSION)
          router.push('/') // navigate to the home page
        })
        .catch((error) => {
          console.error("Error logging out:", error);
        });
    }

  return (
    <>
    <div className='herobg' style={{display: 'flex',flexDirection: 'column'}}>
      <div className='navbar'>
        <div style={{display: 'flex', justifyContent: 'end', padding: '.8rem 1rem', alignItems: 'center'}}>
          {userdata ? (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem'}}>
              <Link href="/upload" style={{color: 'white', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><MdFileUpload style={{fontSize: '1.4rem'}}/></Link>
              <button onClick={handleSignOut} style={{color: 'white', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><IoIosLogOut style={{fontSize: '1.4rem'}}/></button>
              <img src={userdata.userImage} alt='' style={{borderRadius: '50%', maxHeight: '2.5rem', width: 'auto'}}></img>
            </div>
          ) : (
            <Link href="/signup" style={{color: 'white', fontSize: '1.2rem', textDecoration: 'none'}}>Signup</Link>
          )}
        </div>
      </div>
      <div style={{display: 'flex', flex: 1, padding: '0rem 2rem'}}>
        <div style={{overflowY: 'scroll'}}>

        </div>
      </div>
    </div>
    </>
  )
}
