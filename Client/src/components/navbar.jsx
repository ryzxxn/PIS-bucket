import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBucket } from "react-icons/fa6";

export default function Navbar() {
  const[showSignup, setShowSignup] = useState("Sign up")

  useEffect(() => {
    if (sessionStorage.getItem('email')) {
      setShowSignup('Login')
    }
    
    return () => {
      // Cleanup code
      // This function runs before the component unmounts
    };
  }, []);
  return (
    <>
    <div className='navbar'>
        <div className='navbar_left'>
          <div className='bucket_container'>
            <p>PIS Bucket</p>
          </div>
        </div>
        <div className='navbar_right'>
          <Link className='signup_button' to="/signup">{showSignup}</Link>
        </div>
    </div>
    </>
  )
}
