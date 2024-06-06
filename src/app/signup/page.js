"use client";
import { useEffect, useState, } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { auth, provider } from "../firebase";
import { onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth";
import Link from "next/link";
import CryptoJS from "crypto-js";

export default function Signup() {
  const router = useRouter();
  const [userData, setUserData] = useState({});

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
          sessionStorage.setItem(process.env.NEXT_PUBLIC_SESSION, encryptedUserData)
          router.push('/')
          // Perform additional actions if the user exists in the database
        } else {
          let response = await axios.post(
            `https://pis-image-default-rtdb.asia-southeast1.firebasedatabase.app/users/${user.uid}.json`,
            userData
          );
          if (response.data) {
            router.push('/')
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

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        sessionStorage.removeItem(process.env.NEXT_PUBLIC_SESSION)
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  }

  return (
    <>
      <button onClick={handleSignOut}>Sign out</button>
      <p onClick={handleSignIn} className="google_button" style={{ cursor: "pointer" }}>
        Sign up with Google
      </p>

      <ul>
        <li>
          <Link href="/">HOME</Link>
        </li>
        <li>
          <Link href="/signup">SIGNUP</Link>
        </li>
      </ul>
    </>
  );
}
