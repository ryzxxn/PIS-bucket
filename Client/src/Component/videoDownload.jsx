import { useState, useEffect } from 'react';
import axios from 'axios';

export default function VideoDownload() {
    const [videoUrls, setVideoUrls] = useState(null);

    useEffect(() => {
        // Fetch video URLs from the server
        axios.get('https://upload-io.onrender.com/videos')
            .then(response => {
                setVideoUrls(response.data);
            })
            .catch(error => {
                console.error('Error fetching video URLs:', error.message);
            });
    }, []);

    const copyUrlToClipboard = (url) => {
        navigator.clipboard.writeText(url)
            .then(() => {
                console.log('URL copied to clipboard:', url);
            })
            .catch(error => {
                console.error('Error copying URL to clipboard:', error.message);
            });
    };

    return (
        <>
            <div>
                <h3>Videos</h3>
                {videoUrls && (
                    <>
                        <h2>{videoUrls.length}</h2>
                        <div className='list_container'>
                            {videoUrls.map((url, index) => (
                                <div className='element_container' key={index}>
                                    <p className='download_link'>
                                        Video {index + 1}
                                    </p>
                                    <a className='download_link' href={url.url} download>
                                        Download
                                    </a>
                                    <button className='copy_link_button' onClick={() => copyUrlToClipboard(url.url)}>
                                        Copy URL
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
