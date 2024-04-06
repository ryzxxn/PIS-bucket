import React, { useState, useEffect, useCallback } from 'react';
import Dashnavbar from '../components/dashNavbar';
import axios from 'axios';
import { CiLink } from 'react-icons/ci';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaRegImages } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

export default function Dashboard() {
  const user = sessionStorage.getItem('Display_name');
  const [currentTag, setCurrentTag] = useState('image');
  const [images, setImages] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [observer, setObserver] = useState(null);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const endpoint = import.meta.env.VITE_DOMAIN_ENDPOINT;
  const tags = ['image', 'gif'];
  const imagesPerPage = 21;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endpoint}/images?apikey=${API_KEY}&user=${sessionStorage.getItem('email')}&type=${currentTag}`);
        const responseData = response.data;
        setImages(responseData);
      } catch (error) {
        console.error('Error fetching image URLs:', error.message);
      }
    };

    fetchData();
  }, [currentTag, refresh]);

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Load image when it enters the viewport
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    };

    if (observer) {
      const newObserver = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      });
      setObserver(newObserver);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [observer]);

  const debouncedActiveTag = useCallback(debounce((value) => setCurrentTag(value), 500), []);

  function debounce(func, delay) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  function activeTag(e) {
    debouncedActiveTag(e.target.value);
    setCurrentPage(1); // Reset to first page when tag changes
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

  async function deletePost(img_url) {
    try {
      const response = await axios.get(`${endpoint}/delete?apikey=${API_KEY}&user=${sessionStorage.getItem('email')}&url=${img_url}`);
      console.log("image deleted");
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error', error.message);
    }
  }

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  function previousPage() {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  }

  function nextPage() {
    setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(images.length / imagesPerPage)));
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
          {currentImages.map((image, index) => (
            <div key={index}>
              {image.type === currentTag || currentTag === 'All' ? (
                <>
                  <img
                    className="img_element"
                    src={image.url}
                    data-src={image.url}
                    alt={image._id}
                    ref={(el) => {
                      if (observer) observer.observe(el);
                    }}
                  />
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

        <div className="pagination">
          <button className='arrow_button' onClick={previousPage} disabled={currentPage === 1}><FaArrowLeft /></button>
          <span>Page {currentPage} of {Math.ceil(images.length / imagesPerPage)}</span>
          <button className='arrow_button' onClick={nextPage} disabled={indexOfLastImage >= images.length}><FaArrowRight /></button>
        </div>
      </div>
    </>
  );
}
