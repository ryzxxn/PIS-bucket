import DownloadImage from '../Component/ImageDownload'
import { useState } from 'react';
import { Link } from "react-router-dom";

export default function Download() {
  const [IMAGE, showImage] = useState(false)

  function showimages() {
    showImage(true)
  }
  return (
<>
    <div className='navbar'>
    <Link className='link' to="/">Upload</Link>
    </div>
    <div style={{color:'white'}} onClick={showimages}>image</div>
    {IMAGE && (
      <DownloadImage/>
    )}
</>
  )
}
