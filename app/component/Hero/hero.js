'use client'
import React, { useState } from 'react'
import './hero.css'
import axios from 'axios'

export default function Hero() {

const currentDate = new Date()
const [imagedata, setImagedata] = useState('')


const data = {
    image_date: currentDate.toString(),
    image_data: imagedata,
    image_uploaded_by: 'Elton'
}

function test(e)
{
    // console.log(e);
    var reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
        setImagedata(reader.result)
    }
}

function upload()
{
    if (!imagedata) {
        console.log('image is not uploaded');
    }
    else{
    axios.post('http://localhost:3000/api/postImage', data)
    }
    window.location.reload()
}

  return (
    <div className='hero_container'>
        <div className='hero_element'>
            <label>Upload your Image</label>

            <div className='drag_upload'>
            <input 
            accept='image/*'
            typeof='file'
            onChange={test} type='file'>
            </input>
            </div>

            <img src={imagedata} height={160}></img>
            <button onClick={upload}>UPLOAD</button>
        </div>
    </div>
  )
}
