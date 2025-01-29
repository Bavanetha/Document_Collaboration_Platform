import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../App.css"
import axios from 'axios';
import loginImg from "../assets/login-screen-landing-page.png"
import { AuthContext } from "./AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const req = await axios.post("https://document-collaboration-platform.onrender.com/login", {
        email: email,
        password: password
      })
      dispatch({
        type: "LOGIN",
        payload: req.data.token,
      });
      localStorage.setItem("token", req.data.token);
      localStorage.setItem("email", req.data.email);
      var isLoginSuccessful = req.data.loginStatus;
      if (isLoginSuccessful) {
        alert(req.data.response);
        navigate("/");
      } else {
        alert(req.data.response);
      }
    }catch(err){
      console.log("Error occured");
    }
  };

  return (
      <div className="login-sec">
        <div className="logcontainer">
          <div className="login-form">
            <h1>LOGIN</h1>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Enter your Email" value={email} onChange={(e) => { setEmail(e.target.value) }} required />

              <div className="password">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value) }}
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <input type="submit" value="Submit" />
            </form>
            <Link to="/signup" >Don't have an account, SignUp</Link>
          </div>
          <img src={loginImg} alt="img" />
        </div>

      </div>
    );
  };

  export default Login;
