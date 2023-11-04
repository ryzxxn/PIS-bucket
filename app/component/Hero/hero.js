'use client'
import React, { useState } from 'react';
import './hero.css';
import axios from 'axios';

export default function Hero() {
  const [Image, setImage] = useState(null)
  const [postData, setPostdata] = useState(
    {
        image_date: new Date(),
        image_url: '',
        image_uploaded_by: 'Elton'
    }
  )

  const webhookURL = "https://discord.com/api/webhooks/1170259862958125066/94u4Ziza65RI0eK_6p2-ypzR-ZMXhU0DpUVUHVrUIWeN6JI3TXf2TomKl95tc20bfnw8";

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
  
      const reader = new FileReader();
      reader.onload = (event) => {
        // Display the selected image using readAsDataURL
        document.getElementById("previewImage").src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async function uploadImageToDiscord() {
    if (!Image) {
      alert("Please select an image to upload.");
        }
        else {
            const formData = new FormData();
            formData.append("file", Image);
      
            try {
                const response = await axios.post(webhookURL, formData);
        
                if (response.data && response.data.attachments && response.data.attachments.length > 0) {
                  const uploadedImageURL = response.data.attachments[0].url

                setPostdata({...postData.image_url = uploadedImageURL})
                console.log(postData);

                axios.post('https://uploadio.vercel.app/api/postImage', postData)

                } else {
                console.log("Image uploaded, but the URL couldn't be retrieved.")
                }
              } catch (error) {
                console.log("Error uploading the image: " + error.message);
              }
            }
          }

  return (
    <div className='hero_container'>
      <div className='hero_element'>
        <label>Upload your Image</label>

        <div className='drag_upload'>
          <input
            accept='image/*'
            type='file'
            onChange={handleImageChange}/>
        </div>

        <img src="" height={160} id="previewImage" alt="Preview" />
        <button onClick={uploadImageToDiscord} >UPLOAD</button>
      </div>
    </div>
  )
}
