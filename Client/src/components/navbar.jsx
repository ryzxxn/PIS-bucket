import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const[showSignup, setShowSignup] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem('uid')) {
      setShowSignup(false)
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
        </div>
        <div className='navbar_right'>
          {showSignup && (
            <Link className='signup_button' to="/signup">Sign up</Link>
          )}
        </div>
    </div>
    </>
  )
}
