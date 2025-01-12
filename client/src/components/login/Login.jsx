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
      navigate('/tutorial');
    } else {
      alert('Please enter a valid ID');
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const [personalityState, setPersonality] = useState(localStorage.getItem('personality') || 'unknown'); // State for arrow visibility
  
      useEffect(() => {
  
      }, [personalityState]);
  
      function handleEnterPersonality (e) {
          if (e.key === 'Enter') {
              const currentText = e.target.value;
              switch (currentText) {
                  case 'control':
                      changePersonality('control');
                      setPersonality('control');
                      break;
                  case 'average':
                      changePersonality('average');
                      setPersonality('average');
                      break;
                  case 'role model':
                      changePersonality('role_model');
                      setPersonality('role_model');
                      break;
                  case 'role_model':
                      changePersonality('role_model');
                      setPersonality('role_model');
                      break;  
                  case 'self centered':
                      changePersonality('self_centered');
                      setPersonality('self_centered');
                      break;
                  case 'self_centered':
                    changePersonality('self_centered');
                    setPersonality('self_centered');
                    break;  
                  case 'reserved':
                      changePersonality('reserved');
                      setPersonality('reserved');
                      break;
                  default:
                      alert("Code not understood! Please try again. Setting to control personality");
                      console.log(currentText + " personality not found, defaulting to control");
                      changePersonality('control');
                      setPersonality('control');
                      break;
              }
              alert("Changing personality, press OK");
          }
        }
  function handleEnter (e) {
    if (e.key === 'Enter') {
        const currentText = e.target.value;
        switch (currentText) {
            case '1 1':
                changeTheme('yellow-blue-theme-1-1');
                break;
            case '1 2':
                changeTheme('yellow-blue-theme-1-2');
                break;
            case '1 3':
                changeTheme('yellow-blue-theme-1-3');
                break;
            case '1 4':
                changeTheme('yellow-blue-theme-1-4');
                break;
            case '1 5':
                changeTheme('yellow-blue-theme-1-5');
                break;
            case '1 6':
                changeTheme('yellow-blue-theme-1-6');
                break;
            case '1 7':
                changeTheme('yellow-blue-theme-1-7');
                break;
            case '1 8':
                changeTheme('yellow-blue-theme-1-8');
                break;
            case '1 9':
                changeTheme('yellow-blue-theme-1-9');
                break;
            case '2 1':
                changeTheme('red-green-theme-2-1');
                break;
            case '2 2':
                changeTheme('red-green-theme-2-2');
                break;
            case '2 3':
                changeTheme('red-green-theme-2-3');
                break;
            case '2 4':
                changeTheme('red-green-theme-2-4');
                break;
            case '2 5':
                changeTheme('red-green-theme-2-5');
                break;
            case '2 6':
                changeTheme('red-green-theme-2-6');
                break;
            case '2 7':
                changeTheme('red-green-theme-2-7');
                break;
            case '2 8':
                changeTheme('red-green-theme-2-8');
                break;
            case '2 9':
                changeTheme('red-green-theme-2-9');
                break;
            case '3 1':
                changeTheme('purple-turquoise-theme-3-1');
                break;
            case '3 2':
                changeTheme('purple-turquoise-theme-3-2');
                break;
            case '3 3':
                changeTheme('purple-turquoise-theme-3-3');
                break;
            case '3 4':
                changeTheme('purple-turquoise-theme-3-4');
                break;
            case '3 5':
                changeTheme('purple-turquoise-theme-3-5');
                break;
            case '3 6':
                changeTheme('purple-turquoise-theme-3-6');
                break;
            case '3 7':
                changeTheme('purple-turquoise-theme-3-7');
                break;
            case '3 8':
                changeTheme('purple-turquoise-theme-3-8');
                break;
            case '3 9':
                changeTheme('purple-turquoise-theme-3-9');
                break;
            case '4 1':
                changeTheme('black-white-theme-4-1');
                break;
            case '4 2':
                changeTheme('black-white-theme-4-2');
                break;
            case '4 3':
                changeTheme('black-white-theme-4-3');
                break;    
            default:
                alert("Code not understood! Please try again. Setting to default theme");
                console.log(currentText + " theme not found, defaulting to yellow-blue-theme-1-1");
                changeTheme('yellow-blue-theme-1-1');
                break;
        }
        alert("Changing theme, press OK");
    }
  }     

  return (
    <div className="login-page-container">
        <div className="menu-container">
        <input type="text" className="theme-input" onKeyDown={handleEnter} placeholder="color combo" />
        <input type="text" className="personality-input" onKeyDown={handleEnterPersonality} placeholder="personality"/>
        <p>{`Current Personality: ${personalityState}`}</p>
        {/* <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
        {menuOpen && (
          <div className="dropdown-menu">
            <ul>
              <li onClick={() => changeTheme('yellow-blue-theme')}>Yellow-Blue Theme</li>
              <li onClick={() => changeTheme('pink-grey-theme')}>Pink-Grey Theme</li>
            </ul>
          </div>
        )} */}
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
