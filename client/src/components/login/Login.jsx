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
    <div className="container">
      <h2 className="login">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="userid-input"
          type="text"
          placeholder="Enter your unique ID"
          value={userId}
          onChange={(e) => setuserId(e.target.value)}
        />
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
