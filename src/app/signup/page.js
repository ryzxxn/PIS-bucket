"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import memoryState from 'memory-state';
import { auth, provider, api } from '../firebase.js';
import { onAuthStateChanged, getAuth, signInWithRedirect } from 'firebase/auth';

export default function Signup() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in

        console.log('hello');

        memoryState.setState('userData', {
          userEmail: user.email,
          userName: user.displayName,
          userPhoto: user.photoURL,
        });

        // router.push('/');
      }
    });

    // Clean up the subscription to avoid memory leaks
    return () => unsubscribe();
  }, [router]);

  function handleSignIn() {
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  }

  console.log(api);

  return (
    <>
      <p onClick={handleSignIn} className='google_button'>
        Sign up with Google
      </p>
    </>
  );
}
