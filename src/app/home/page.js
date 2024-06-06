"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth } from '../firebase';
import { signOut } from "firebase/auth";
import '../page.module.css'
import { IoIosLogOut } from "react-icons/io";
import CryptoJS from 'crypto-js';

export default function Home_page() {
  const [userdata, setUserdata] = useState(null)

  useEffect(() => {
    const encryptedObject = sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION);
    if (sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION)) {
      const decryptedObject = JSON.parse(CryptoJS.AES.decrypt(encryptedObject, process.env.NEXT_PUBLIC_SECRET_KEY).toString(CryptoJS.enc.Utf8));
      setUserdata(decryptedObject)
    }
  }, []);

    const router = useRouter();

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

    console.log(userdata);

  return (
    <>
    <div className='herobg' style={{display: 'flex',flexDirection: 'column'}}>
      <div className='navbar'>
        <div style={{display: 'flex', justifyContent: 'end', padding: '.8rem 1rem', alignItems: 'center'}}>
          {userdata ? (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem'}}>
              <button onClick={handleSignOut} style={{color: 'white', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><IoIosLogOut style={{fontSize: '1.4rem'}}/></button>
              <img src={userdata.userImage} alt='' style={{borderRadius: '50%', maxHeight: '2.5rem', width: 'auto'}}></img>
            </div>
          ) : (
            <Link href="/signup" style={{color: 'white', fontSize: '1.2rem', textDecoration: 'none'}}>Signup</Link>
          )}
        </div>
      </div>
      <div style={{display: 'flex', flex: 1, alignItems: 'center', padding: '0rem 2rem'}}>
        <div style={{display: 'flex', gap: '1rem', flexDirection: 'column'}}>
          <div>
          <h2 style={{color: 'white', margin: '0px', fontSize: '3rem'}}>Personal Image Storage</h2>
          <p style={{color: 'white'}}>Secure, private, and convenient image storage for your personal collection.</p>
          </div>
          {userdata && (
            <>
            <Link href='/dashboard' style={{padding: '1rem 1.4rem', backgroundColor: 'rgba(0, 0, 0, 0.403)', width: 'max-content', color: 'white', borderRadius: '.3rem', textDecoration: "none"}}>Dashboard</Link>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}