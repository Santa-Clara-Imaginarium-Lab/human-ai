import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Login.css';

function Login({changeTheme, changePersonality}) {
  const [userId, setuserId] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId.trim()) {
      login(userId); // Store userId in context
      localStorage.setItem('isResearchMode', true); // Enable data logging in future files
      navigate('/brief');
    } else {
      alert('Please enter a valid ID');
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };  

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
            <button className="login-button" type="submit">Login</button>
          </form>
          <div className="login-tip">
            <p>
              <br/>
              <strong>Note: </strong>
              Your participant ID has been provided via the researcher. <br/> If you are taking this study remotely, it is available in the study invitation email. <br/><br/> For any questions or further assistance, please notify the researcher.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
