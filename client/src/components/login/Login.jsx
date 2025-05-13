import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Login.css';
import { verifyPassword } from '../../crypto/crypto.jsx';

function Login({changeTheme, changePersonality}) {
  const [userId, setuserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const pwShowRef = useRef(null);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      alert('Please enter a valid ID');
      return;
    }
    // Check if correct password is entered
    let result = await verifyPassword(password, "login");
      if (!(result)) {
        alert('Incorrect password. Please try again or notify a researcher.');
        return;
      }

      // Check if userId exists in the chats collection
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats?userId=${userId}`);
      if (!response.ok) {
        alert('Critical error: Unable to check user ID. Please try again later.');
        return;
      }
      
      const chatData = await response.json();
      if (chatData.length > 0) {
        alert('Critical error: This user ID has already been used.');
        return;
      }

      setIsLoggingIn(true);
      
      login(userId); // Store userId in context
      sessionStorage.setItem('isResearchMode', true); // Enable data logging in future files
      navigate('/brief');
  };

  const togglePWVisibility = () => {
    const passwordInput = pwShowRef.current.parentElement.querySelector('.password-input');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    pwShowRef.current.textContent = type === 'password' ? 'Show' : 'Hide';
  }

  return (
    <div className="login-page-container">
      <div className="login-container">
        <div className="shadow-container"></div>
        <div className="login-content">
          <h2 className="login">Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              className="userid-input"
              type="text"
              placeholder="Enter your participant ID"
              value={userId}
              onChange={(e) => setuserId(e.target.value)}
            />
            <input
              className="password-input"
              type="password"
              placeholder="Enter study password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          <button className="show-password" type="button" ref={pwShowRef} onClick={togglePWVisibility} >Show</button>
          <button className="login-button" type="submit">Login</button>
          </form>
          <div className="login-tip">
            <p>
              <br/>
              <strong>Note: </strong>
              Your participant ID has been provided via the researcher. If you are taking this study remotely, it is available in the study invitation email. <br/><br/> For any questions or further assistance, please notify the researcher.
            </p>
          </div>
        </div>
      </div>
      {/* Using dupe css */}
      <h1 className={isLoggingIn ? 'welcome-info-can' : 'welcome-info-hide'}>{isLoggingIn ? 'Server is booting up... Please Wait!' : ' '}</h1>

    </div>
  );
}

export default Login;
