import { useEffect, useState } from 'react';
import "../App.css"

import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import jsPDF from 'jspdf';

import { Box } from '@mui/material';
import styled from '@emotion/styled';

import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const Component = styled.div`
    background: #F5F5F5;
`

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],

    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],

    ["link", "image", "video"],

    ["clean"]
];

const CreateDocument = () => {
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const [filename, setFilename] = useState("");
    const { id } = useParams();
    const email = localStorage.getItem("email");

    useEffect(() => {
        console.log("Initializing Quill...");

        const container = document.getElementById('container');

        if (container?.children.length > 0) {
            return;
        }

        console.log("Creating new Quill instance.");
        const quillServer = new Quill(container, {
            theme: 'snow',
            modules: { toolbar: toolbarOptions }
        });

        quillServer.disable();
        quillServer.setText('Loading the document...');
        setQuill(quillServer);
    }, []);


    useEffect(() => {
        const socketServer = io('https://document-collaboration-platform.onrender.com');
        setSocket(socketServer);

        return () => {
            socketServer.disconnect();
        }
    }, [])

    useEffect(() => {
        if (socket === null || quill === null) return;

        const handleChange = (delta, oldData, source) => {
            if (source !== 'user') return;

            socket.emit('send-changes', delta);
        }

        quill && quill.on('text-change', handleChange);

        return () => {
            quill && quill.off('text-change', handleChange);
        }
    }, [quill, socket])


    useEffect(() => {
        if (socket === null || quill === null) return;

        const handleChange = (delta) => {
            quill.updateContents(delta);
        }

        socket && socket.on('receive-changes', handleChange);

        return () => {
            socket && socket.off('receive-changes', handleChange);
        }
    }, [quill, socket]);

    useEffect(() => {

        console.log(email)
        if (quill === null || socket === null || !email) return;

        socket && socket.once('load-document', (document) => {
            quill.setContents(document);
            quill.enable();
        })

        socket && socket.emit('get-document', id, email, filename);
    }, [quill, socket, id, email, filename]);

    const handleSave = () => {
        if (!quill || !socket || !filename.trim()) {
            return;
        }
        const documentData = quill.getContents();
        socket.emit('save-document', documentData, filename.trim());
    };

    return (
        <>
            <div className='docs-header'>
                <div>
                    Title : <input type="text" value={filename} onChange={(e) => { setFilename(e.target.value) }} />
                </div>
                <button onClick={handleSave}>SAVE</button>
            </div>
            <Component>
                <Box className='container' id='container'></Box>
            </Component>
        </>
    )
}

export default CreateDocument;