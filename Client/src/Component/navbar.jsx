import React from 'react'
import { Link } from "react-router-dom";

export default function () {
  return (
    <>
    <div className='navbar'>
    <Link className='link' to="/">Upload</Link>
    <Link className='link' to="download">Storage</Link>
    </div>
    </>
  )
}
