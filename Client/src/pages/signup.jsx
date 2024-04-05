import React, { useState, useEffect } from 'react';
import { FaGoogle } from "react-icons/fa";
import { auth, provider } from '../../firebase/firebase_config';
import { onAuthStateChanged, signInWithRedirect } from 'firebase/auth';
import { FaBucket } from "react-icons/fa6";

export default function Signup() {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                setUserData(user);
                sessionStorage.setItem('email', userData.email)
                sessionStorage.setItem('Display_name', userData.displayName)
                sessionStorage.setItem('photo', userData.photoURL)

                window.location.href = '/dashboard';
            } else {
                // User is signed out
                setUserData(null);
            }
        });

        // Clean up the subscription to avoid memory leaks
        return () => unsubscribe();
    }, [userData]);

    function handleSignIn() {
        signInWithRedirect(auth, provider)
            .catch((error) => {
                // Handle errors
                console.error(error);
            });
    }

    return (
        <>
            <div className='signup_page'>
                <div className='signup_container'>
                    <div className='bucket_container'>
                        <FaBucket className='bucket_logo' />
                        <p>PIS Bucket</p>
                    </div>
                    <p onClick={handleSignIn} className='google_button'>Sign up with Google <FaGoogle /></p>
                </div>
            </div>
        </>
    );
}
