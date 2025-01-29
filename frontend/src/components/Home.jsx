import { useEffect,useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../App.css";

import { AuthContext } from "./AuthContext";

const Home = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [userName, setUsername] = useState("");
  axios.defaults.headers.common["Authorization"] = user
  const getUserProfile = async () => {
    await axios.get("https://document-collaboration-platform.onrender.com/json").then((res) => {
      setUsername(res.data.user)
    });
  };
  useEffect(() => {
    getUserProfile();
  }, []);

  

  const navigate = useNavigate(); 

  const handleLoginPage = () => {
    navigate('/login'); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  const handlePermission = () => {
    if(user){
      navigate("/documents");
    }
  }

  return (
    <div className="home">
        <div className="nav">
          {user ? (
                <button className="login" onClick = {handleLogout}>Logout</button>
              ) : (
                <button className="login" onClick = {handleLoginPage}>Login/Signup</button>
              )}
        </div>
        <div className="hero">
            <h1>Collaborate in real-time. Work smarter, together</h1>
            <button className="create-btn" onClick={handlePermission}>Create document</button>
        </div>
    </div>
  )
}

export default Home
