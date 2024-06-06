"use client"
import {useState, useEffect} from 'react'
import CryptoJS from 'crypto-js';

export default function Upload() {

    const [userdata, setUserdata] = useState({})

    useEffect(() => {
        const encryptedObject = sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION);
        if (sessionStorage.getItem(process.env.NEXT_PUBLIC_SESSION)) {
          const decryptedObject = JSON.parse(CryptoJS.AES.decrypt(encryptedObject, process.env.NEXT_PUBLIC_SECRET_KEY).toString(CryptoJS.enc.Utf8));
          setUserdata(decryptedObject)
        }
      }, []);

      console.log(userdata)

  return (
    <div>Upload</div>
  )
}
