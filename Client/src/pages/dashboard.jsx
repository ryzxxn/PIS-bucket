import React, { useState, useEffect } from 'react';
import Dashnavbar from '../components/dashNavbar';
import axios from 'axios';
import { CiLink } from 'react-icons/ci';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaRegImages } from "react-icons/fa";

export default function Dashboard() {
  const user = sessionStorage.getItem('Display_name');
  const [currentTag, setCurrentTag] = useState('image');
  const [images, setImages] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const endpoint = import.meta.env.VITE_DOMAIN_ENDPOINT;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${endpoint}/images?apikey=${API_KEY}&user=${sessionStorage.getItem('email')}&type=${currentTag}`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching image URLs:', error.message);
      }
    }

    fetchData();
  }, [currentTag, refresh]);

  function activeTag(e) {
    setCurrentTag(e.target.value);
  }

  function copyLinkToClipboard(url) {
    navigator.clipboard.writeText(url)
      .then(() => {
        console.log('Link copied to clipboard:', url);
        alert('Link copied to clipboard!');
      })
      .catch(error => {
        console.error('Error copying link to clipboard:', error);
        alert('Failed to copy link to clipboard.');
      });
  }

  const tags = ['image', 'gif'];

  async function deletePost(img_url) {
    try {
      const response = await axios.get(`${endpoint}/delete?apikey=${API_KEY}&user=${sessionStorage.getItem('email')}&url=${img_url}`);
      console.log("image deleted");
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error', error.message);
    }
  }

  return (
    <>
      <Dashnavbar />
      <div className="dashboard_parent">
        <div className="dashboard_container">
          <p>Welcome {user}</p>
          <p><FaRegImages />{images.length}</p>
        </div>
        

        <div className="tag">
          <div className="tag_container">
            {tags.map((tag, index) => (
              <button className="tag_button" key={index} value={tag} onClick={activeTag}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="image_container">
          {images.map((image, index) => (
            <div key={index}>
              {image.type === currentTag || currentTag === 'All' ? (
                <>
                  <img className="img_element" src={image.url} alt={image._id} />
                  <div className='actions'>
                    <p style={{ cursor: 'pointer' }} onClick={() => copyLinkToClipboard(image.url)}>
                      <CiLink style={{ color: 'white', fontSize: '1.4rem' }} />
                    </p>
                    <p style={{ cursor: 'pointer' }} onClick={() => deletePost(image.url)}>
                      <RiDeleteBin6Fill style={{ color: 'white', fontSize: '1.4rem' }} />
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
