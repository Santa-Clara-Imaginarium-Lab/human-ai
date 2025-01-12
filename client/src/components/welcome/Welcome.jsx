import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./welcome.css";

const Welcome = ({changeTheme, changePersonality}) => {
    const navigate = useNavigate();
    const arrowRef = useRef(null); // Reference for the ">" arrow
    const [isArrowVisible, setArrowVisible] = useState(false); // State for arrow visibility

    // Handlers for navigation
    const handlePlayClick = () => navigate('/login');
    const handleResearchModeClick = () => navigate('/login');
    const handleSettingsClick = () => window.open('http://make-everything-ok.com/', '_blank');

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };

    // Updates the ">" on hover
    const updateArrowPosition = (event) => {
        const button = event.target;
        const arrow = arrowRef.current;

        if (arrow) {
            const buttonRect = button.getBoundingClientRect(); 
            const menuRect = button.parentNode.getBoundingClientRect(); 

            const topOffset = buttonRect.top - menuRect.top;
            arrow.style.top = `${topOffset}px`;
            arrow.style.lineHeight = `${buttonRect.height}px`; 

            setArrowVisible(true); 
        }
    };

    const hideArrow = () => setArrowVisible(false); // Hide the arrow when mouse leaves

    // Makes background diagonal reach corner to corner
    useEffect(() => {
        const polygon = document.querySelector('.polygon');

        const updateSkew = () => {
            const vw = window.innerWidth; 
            const vh = window.innerHeight; 

            const angle = -Math.atan2(vh, vw) * (180 / Math.PI); 
            polygon.style.transform = `skewY(${angle}deg)`; 
        };

        window.addEventListener('resize', updateSkew);
        updateSkew();

        return () => {
            window.removeEventListener('resize', updateSkew);
        };
    }, []);

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
                    alert("Code not understood! Please enter one of: 'control', 'average', 'role model', 'self centered', 'reserved'. Defaulting to control personality");
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
        <div className="container welcome">
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
            <div className="polygon"></div>
            <h1 className="welcome-title top-text"><span>Chatbot</span></h1>
            <h1 className="welcome-title bottom-text">Co-op</h1>
            <div className="button-menu">
                <div
                    className={`menu-arrow ${isArrowVisible ? "visible" : "hidden"}`}
                    ref={arrowRef}
                >
                    &gt;
                </div>
                <button
                    className="play-button"
                    onClick={handlePlayClick}
                    onMouseEnter={updateArrowPosition}
                    onMouseLeave={hideArrow}
                >
                    Start
                </button>
                <button
                    className="play-button"
                    onClick={handleResearchModeClick}
                    onMouseEnter={updateArrowPosition}
                    onMouseLeave={hideArrow}
                >
                    Research Mode
                </button>
                <button
                    className="play-button"
                    onClick={handleSettingsClick}
                    onMouseEnter={updateArrowPosition}
                    onMouseLeave={hideArrow}
                >
                    Settings
                </button>
            </div>
        </div>
    );
};

export default Welcome;
