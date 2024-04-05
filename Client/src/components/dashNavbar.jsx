import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashnavbar() {

    const user_img = sessionStorage.getItem('photo')

  return (
    <>
    <div className='dash_nav'>
        <div>
            <Link className='dash_nav_link' to="/dashboard">Dashboard</Link>
            <Link className='dash_nav_link' to="/upload">Upload</Link>
        </div>
        <div className='dashnav_right'>
            <div>
                <div className="dropdown">
                    <img src={user_img} className='user_img'></img>
                    <div className="dropdown-content">
                        <p>Logout</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}
