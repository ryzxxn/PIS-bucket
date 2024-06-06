"use client"
import { useEffect } from 'react';
import dynamic from "next/dynamic";
import memoryState from 'memory-state';
import CryptoJS from "crypto-js";

const Home_page = dynamic(() => import("./home/page"), {
  ssr: false,
});

export default function Home() {

  useEffect(() => {
    const encryptedObject = sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION);
    if (sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION)) {
      const decryptedObject = JSON.parse(CryptoJS.AES.decrypt(encryptedObject, process.env.NEXT_PUBLIC_SECRET_KEY).toString(CryptoJS.enc.Utf8));
      memoryState.setState('userdetails',decryptedObject)
    }
  }, []);
  
  return (
    <>
    <Home_page/>
    </>
  );
}
