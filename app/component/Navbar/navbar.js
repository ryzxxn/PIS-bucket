'use client'
import { useState } from 'react'
import './navbar.css'

export default function Navbar() {
  return (
    <div className='navbar'>
        <div className='left_nav'>
            <p className='link_hero'>Image up</p>
        </div>
        <div className='right_nav'>
            <p className='link'>Login</p>
            <a href='/gallery' className='link'>Gallery</a>
        </div>
    </div>
  )
}
