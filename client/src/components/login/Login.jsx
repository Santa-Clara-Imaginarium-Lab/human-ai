import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Login.css';

function Login() {
  const [userId, setuserId] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId.trim()) {
      login(userId); // Store userId in context
      navigate('/welcome');
    } else {
      alert('Please enter a valid ID');
    }
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
              <strong>Note: </strong>
              You should have received your participant ID in an email. Ask the researcher if you have any further questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
