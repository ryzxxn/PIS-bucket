import memoryState from 'memory-state'
import { auth, provider } from '../firebase';
import { onAuthStateChanged, signInWithRedirect } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

export default function Signup() {
  const [userData, setUserData] = useState(memoryState.getState('userDATA') || null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const DATA = {
          userName: user.displayName,
          email: user.email
        };
        memoryState.setState('userDATA', DATA);
        setUserData(DATA);
      }
    });

    return () => unsubscribe();
  }, []);

  function handleSignIn() {
    signInWithRedirect(auth, provider);
  }

  return (
    <>
      <p onClick={handleSignIn} className='google_button' style={{cursor: 'pointer'}}>
        Sign up with Google
      </p>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
      </ul>
    </>
  );
}
