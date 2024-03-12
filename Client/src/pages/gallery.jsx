import {useState, useEffect} from 'react'
import axios from 'axios'
import { Link } from "react-router-dom";


export default function gallery() {

    const [imageUrls, setImageUrls] = useState(null)


    useEffect(() => {
        // Fetch image URLs from the server
        axios.get('https://upload-io.onrender.com/images')
          .then(response => {
            setImageUrls(response.data);
          })
          .catch(error => {
            console.error('Error fetching image URLs:', error.message);
          });
      }, []);
  return (
    <>
    <div>
      <div className='navbar'>
      <Link className='link' to="/">Home</Link>
      </div>
    {imageUrls &&(
    <>
    <h2>{imageUrls.length}</h2>
    <div className='list_container'>
    {imageUrls.map((url, index) => (
        <img className='list_element' key={index} src={url.image_url} alt={`Image ${index}`} style={{ maxWidth: '300px', marginTop: '0px' }} >
        </img>
    ))}
    </div>
    </>)}
    </div>
</>
  )
}
