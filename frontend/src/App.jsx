import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {useState,useEffect} from 'react';

import { v4 as uuid } from "uuid"

import './App.css'
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import DocumentsPage from "./components/DocumentsPage";
import CreateDocument from "./components/CreateDocument";

function App() {

  const [isLogin,setIslogin] = useState(false);

  const handleLoginPage = () => {
    setIslogin(!isLogin);
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home isLoggedin={isLogin} onLogout={handleLoginPage}/>} />
          <Route path="/login" element={<Login onLogin={handleLoginPage}/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/documents" element={<DocumentsPage/>} />
          <Route path='/create-document' element={<Navigate replace to={`/docs/${uuid()}`} /> } />
          <Route path='/docs/:id' element={<CreateDocument/>} />
        </Routes>
      </Router>
      
    </>
  )
}

export default App
