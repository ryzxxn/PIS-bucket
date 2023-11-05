'use client'
import { useState } from 'react'
import './navbar.css'

export default function Navbar() {
  return (
    <div className='navbar'>
        <div className='left_nav'>
            <a href='/' className='link_hero'>Image up</a>
        </div>
        <div className='right_nav'>
            <a href='/gallery' className='link'>Gallery</a>
        </div>
    </div>
  )
}
