import React, { useState, useEffect } from 'react'
import Dashnavbar from '../components/dashNavbar'
import axios from 'axios'

export default function Dashboard() {

  const user = sessionStorage.getItem('Display_name')
  const [CurrentTag, setCurrentTag] = useState('All')
  const [URL, setImageUrls] = useState([]) // Initialize URL state as an array

  useEffect(() => {
    setCurrentTag(sessionStorage.getItem('activeTag'));

    axios.get('https://upload-io.onrender.com/images')
        .then(response => {
            setImageUrls(response.data);
        })
        .catch(error => {
            console.error('Error fetching image URLs:', error.message);
        });
  }, [sessionStorage.getItem('activeTag')]); // Remove CurrentTag from dependency array as it's not used inside useEffect

  function activeTag(e) {
    sessionStorage.setItem('activeTag', e.target.value);
  }

  const tags = ["Image","Gif"]

  return (
    <>
    <Dashnavbar/>
    <div className='dashboard_parent'>
      <div className='dashboard_container'>
        <p>Welcome {user}</p>
      </div>

      <hr className='devide'></hr>

      <div className='tag'>
        <div className='tag_container'>
          {tags.map((tag, index) => (
            <button className='tag_button' key={index} value={tag} onClick={activeTag}>{tag}</button>
          ))}
        </div>
      </div>

      <div className='image_container'>
        {URL.map((image, index) => (
          <img className='img_element' key={index} src={image.url} alt={image._id}/> // Add alt attribute to img element
        ))}
      </div>
    </div>
    </>
  )
}