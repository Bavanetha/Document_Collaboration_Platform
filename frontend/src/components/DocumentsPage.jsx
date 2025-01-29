import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";

const DocumentsPage = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/");
    };

    const handleCreateDocument = () => {
        navigate("/create-document");
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
                <div className="savedDocuments">
                    
                </div>
            </div>
        </div>
    );
};

export default DocumentsPage;
