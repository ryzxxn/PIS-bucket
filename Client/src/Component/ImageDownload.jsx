import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ImageDownload() {
    const [imageUrls, setImageUrls] = useState(null);

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

    const copyImageLink = (imageUrl) => {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = imageUrl;
        document.body.appendChild(textarea);
        textarea.select();

        // Copy the URL to the clipboard
        document.execCommand('copy');

        // Remove the textarea from the DOM
        document.body.removeChild(textarea);
    };

    return (
        <div>
            <h3>Images</h3>
            {imageUrls && (
                <>
                    <h2>{imageUrls.length}</h2>
                    <div className='list_container'>
                        {imageUrls.map((url, index) => (
                            <div key={index} className='element_container'>
                                <img
                                    className='list_element'
                                    src={url.url}
                                    alt={`Image ${index}`}
                                    style={{ maxWidth: '300px', marginTop: '10px' }}
                                />
                                <button onClick={() => copyImageLink(url.url)}>Copy Link</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
