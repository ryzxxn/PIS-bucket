import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DocumentDownload() {
    const [documents, setDocuments] = useState(null);

    useEffect(() => {
        // Fetch document URLs from the server
        axios.get('https://upload-io.onrender.com/documents')
            .then(response => {
                setDocuments(response.data);
            })
            .catch(error => {
                console.error('Error fetching document URLs:', error.message);
            });
    }, []);

    const copyDocumentLink = (documentUrl) => {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = documentUrl;
        document.body.appendChild(textarea);
        textarea.select();

        // Copy the URL to the clipboard
        document.execCommand('copy');

        // Remove the textarea from the DOM
        document.body.removeChild(textarea);
    };

    return (
        <div>
            <h3>Documents</h3>
            {documents && (
                <>
                    <h2>{documents.length}</h2>
                    <div className='list_container'>
                        {documents.map((doc, index) => (
                            <div key={index} className='document_container'>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                    Document {index + 1}
                                </a>
                                <button onClick={() => copyDocumentLink(doc.url)}>Copy Link</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
