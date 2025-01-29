import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';

import "../App.css"
import loginImg from "../assets/login-screen-landing-page.png"

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
 
    const togglePassword = () => {
      setShowPassword(prev => !prev);
    };

    const handleSignUp =async (event) =>{
      event.preventDefault();
        try{
          const req = await axios.post("http://localhost:5000/signup",{
            userName:userName,
            email:email,
            password:password
          })
          //console.log(req)
          alert(req.data.response);
          if(req.data.signupStatus){
            navigate("/login");
          }
          else{
            navigate("/signup")
          }
        }
          catch(err){
            console.log(err);
          }
      
    }

  return (
    <div className="login-sec">
          <div className="logcontainer">
            <div className="login-form">
                <h1>SIGNUP</h1>
                <form onSubmit={handleSignUp}>
                <input type="text" placeholder="Enter your username" value={userName} onChange={(e)=>{setUsername(e.target.value)}} required />
                    <input type="email" placeholder="Enter your Email" value={email} onChange={(e)=>{setEmail(e.target.value)}} required />
                    
                    <div className="password">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your Password" 
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={togglePassword} 
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                    </div>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Confirm Password" 
                        value={confirmPassword}
                        onChange={(e)=>{setConfirmPassword(e.target.value)}}
                        required 
                    />
                    
                    {error && <p className="error-message">{error}</p>}
                    <input type="submit" value="Submit"/>
                </form>
                <Link to="/login" >Already have an account, Login</Link>
            </div>
            <img src={loginImg} alt="img"/>
          </div>
          
        </div>
  )
}

export default SignUp
