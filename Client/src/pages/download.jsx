import DownloadImage from '../Component/ImageDownload';
import DownloadVideo from '../Component/videoDownload';
import DownloadDocument from '../Component/documentDownload';
import { useState } from 'react';
import { Link } from "react-router-dom";

export default function Download() {
  const [showImage, setShowImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  function toggleImage() {
    setShowImage(!showImage);
    setShowVideo(false); // Hide video component when showing image component
  }

  function toggleVideo() {
    setShowVideo(!showVideo);
    setShowImage(false); // Hide image component when showing video component
  }

  return (
    <>
      <div className='navbar'>
        <Link className='link' to="/">Upload</Link>
      </div>

      {/* <div className='magic_box'>
        <div style={{color:'white'}} onClick={toggleImage}>image</div>
        <div style={{color:'white'}} onClick={toggleVideo}>video</div>
      </div> */}

      <div className='download_container'>
        <DownloadImage />
        <DownloadVideo />
        <DownloadDocument/>
      </div>
    </>
  );
}
