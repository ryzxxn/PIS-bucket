'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../page.css'
import './gallery.css'

export default function page() {
    const [ImageCache, setImagecache] = useState('')

    useEffect(() => {
    async function fetchdata(){
        const response = await axios.get(`https://uploadio.netlify.app/api/Images`, {
          headers: {
            'Cache-Control': 'no-store',
          },
        });
        setImagecache(response.data)
    }
    fetchdata()
}, []);

///print images

const images = []

function print()
{
for (let index = 0; index < ImageCache.length; index++) {
    images.push(
        <div key={index}>
            <img src={ImageCache[index].image_data}></img>
        </div>
    )
    }
}

if (ImageCache) {
    print()
}

  return (
    <>
    <div className='image_container'>
        {images}
    </div>
    </>
  )
}
