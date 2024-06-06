"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { auth, provider } from "../firebase";
import { onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth";
import Link from "next/link";
import CryptoJS from "crypto-js";
import { FaGoogle } from "react-icons/fa";

export default function Signup() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User logged in:", user);
        const userData = {
          userName: user.displayName,
          userEmail: user.email,
          userImage: user.photoURL,
          userId: user.uid,
          media: []
        };
        setUserData(userData);

        // Check if the user exists in the database
        const userExists = await checkUserExistsInDb(user.uid);
        if (userExists) {
          console.log("User exists in the database");
          const encryptedUserData = CryptoJS.AES.encrypt(JSON.stringify(userData), process.env.NEXT_PUBLIC_SECRET_KEY).toString();
          sessionStorage.setItem(process.env.NEXT_PUBLIC_SESSION, encryptedUserData);
          router.push('/');
          // Perform additional actions if the user exists in the database
        } else {
          const newUserData = {
            [user.uid]: userData
          };
          let response = await axios.post(
            `https://pis-image-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userData.userId}.json`,
            newUserData
          );
          if (response.data) {
            router.push('/');
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  async function checkUserExistsInDb(uid) {
    try {
      const response = await axios.get(
        `https://pis-image-default-rtdb.asia-southeast1.firebasedatabase.app/users/${uid}.json`
      );
      const userData = response.data;

      // Check if the user data exists in the database
      if (userData) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error checking if user exists in DB:", error);
      return false;
    }
  }

  function handleSignIn() {
    signInWithRedirect(auth, provider);
  }


  return (
      <>
    <div className='herobg' style={{display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <p onClick={handleSignIn} className="google_button" style={{ cursor: "pointer", color: 'black' , backgroundColor: 'white' ,height: 'max-content',width: 'max-content', padding: '1rem', borderRadius: '.7rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
      <FaGoogle />Sign up with Google
      </p>
    </div>
    </>
  );
}
