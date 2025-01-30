import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import axios from 'axios'

const DocumentsPage = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const email = localStorage.getItem("email");
    console.log(email)

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get(`https://document-collaboration-platform.onrender.com/getdocsbyemail?email=${email}`);
                console.log(response.data)
                setDocuments(response.data);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };

        if (email) {
            fetchDocuments();
        }
    }, [email]);

    console.log(documents)

    const handleOpenDocument = (id) => {
        navigate(`/docs/${id}`);
    };


    const handleBack = () => {
        navigate("/");
    };

    const handleCreateDocument = () => {
        navigate("/create-document");
    };

    const handleDelete = async (id) => {
        if (!id) return;

        try {
            const delResponse = await fetch(`https://document-collaboration-platform.onrender.com/documents/${id}`, {
                method: 'DELETE',
            });
            if (delResponse.ok) {
                const response = await axios.get(`https://document-collaboration-platform.onrender.com/getdocsbyemail?email=${email}`);
                console.log(response.data)
                setDocuments(response.data);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };


    return (
        <div className="createPage">
            <div className="sideBar">
                <button onClick={handleBack}>Back</button>
            </div>
            <div className="DocumenSection">
                <div className="createButton">
                    <button onClick={handleCreateDocument}>+</button>
                </div>
                <h1>Saved Documents</h1>
                <div className="savedDocuments">
                    
                    {documents.length > 0 ? (
                        documents.map(doc => (
                            <div className='docs'>
                                <div key={doc._id} className="documentItem" onClick={() => handleOpenDocument(doc._id)}>
                                    {doc.filename} </div>
                                <button onClick={() => handleDelete(doc._id)}>DELETE</button>
                            </div>
                        ))
                    ) : (
                        <p>No saved documents found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentsPage;
