import React from 'react'
import Image from '../Component/image'
import Navbar from '../Component/navbar'
import Video from '../Component/video'

export default function upload() {
  return (
    <>
    <Navbar/>
    <div className='text_cont'>
        <h2>Image-IO</h2>
        <p>Personal Image Storage</p>
      </div>
    <Image/>
    <br></br>
    <Video/>
    </>
  )
}
