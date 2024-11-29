import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Login.css';

function Login({changeTheme}) {
  const [userId, setuserId] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId.trim()) {
      login(userId); // Store userId in context
      navigate('/survey');
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
            {/* Top-right corner menu button */}
            <div className="menu-container">
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
        {menuOpen && (
          <div className="dropdown-menu">
            <ul>
              <li onClick={() => changeTheme('yellow-blue-theme')}>Yellow-Blue Theme</li>
              <li onClick={() => changeTheme('pink-grey-theme')}>Pink-Grey Theme</li>
            </ul>
          </div>
        )}
      </div>
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
              In a future version of this study, a participant ID will be provided via the researcher. For now, enter any text in the box. <br/> <br/> 
              For any questions or further assistance, please notify the researcher.
              {/* Another option for UX study: Your participant ID should have been provided via the researcher. For any questions or further assistance, please notify the researcher. */}
              {/* Use for official study: Your participant ID has been provided via the researcher, and is also available in the study invitation email. For any questions or further assistance, please notify the researcher. */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
