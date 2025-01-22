import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./welcome.css";

const Welcome = ({changeTheme, changePersonality}) => {
    const navigate = useNavigate();
    const arrowRef = useRef(null); // Reference for the ">" arrow
    const [isArrowVisible, setArrowVisible] = useState(false); // State for arrow visibility
    const [settingsHidden, setSettingsHidden] = useState(true);
    const [isAdmin, setAdmin] = useState(false); 

    // Handlers for navigation
    const handlePlayClick = () => navigate('/tutorial'); // NOTE: now skips login! TODO: turn data collecting off.
    const handleResearchModeClick = () => navigate('/login');
    const handleSettingsClick = () => {
        setSettingsHidden(false);
    }
    const handleSettingsClose = () => {
        setSettingsHidden(true);
    }
    const handleAdminEnter = (e) => {
        if (e.key === 'Enter') {
            setAdmin(true);
        }
    }

    console.log(isAdmin)

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

    const [personalityState, setPersonality] = useState(localStorage.getItem('forcedPersonality') || 'random'); // State for arrow visibility

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
                case 'role_model':
                    changePersonality('role_model');
                    setPersonality('role_model');
                    break;
                case 'self centered':
                case 'self_centered':
                    changePersonality('self_centered');
                    setPersonality('self_centered');
                    break;
                case 'reserved':
                    changePersonality('reserved');
                    setPersonality('reserved');
                    break;
                default:
                    alert("Code not understood! Please enter one of: 'control', 'average', 'role model', 'self centered', 'reserved'. Defaulting to randomizer");
                    console.log(currentText + " personality not found, defaulting to control");
                    changePersonality('random');
                    setPersonality('random');
                    break;
            }
            alert("Changing personality, press OK");
        }
      }

    function handleEnter (e) {
        // helper function - default case
        function defaultTheme(currentText) {
            alert("Code not understood! Please try again. Setting to default theme");
            console.log(currentText + " theme not found, defaulting to yellow-blue-theme-1-1");
            changeTheme('black-white-theme-4-2');
        }
    
        if (e.key === 'Enter') {
            const currentText = e.target.value;

            const split = currentText.split(' ');
            if (split.length !== 2) {
                console.warn("color change: fail length")
                return defaultTheme(currentText);
            }

            const firstNum = parseInt(currentText.split(' ')[0]);
            if (isNaN(firstNum) || firstNum < 0 || firstNum > 4) {
                console.warn("color change: fail 1st num");
                return defaultTheme(currentText);
            }

            const secondNum = parseInt(currentText.split(' ')[1]);
            if (isNaN(secondNum) || secondNum < 0 || ( ( (firstNum == 4) && (secondNum > 4) ) || secondNum > 9) ) {
                console.warn("color change: fail 2nd num");
                return defaultTheme(currentText);
            }

            // if second num is not 0 through 9 
            console.log(firstNum + " " + secondNum);
            switch (firstNum) {
                case 1:
                    changeTheme(`yellow-blue-theme-1-${secondNum}`);
                    break;
                case 2:
                    changeTheme(`red-green-theme-2-${secondNum}`);
                    break;
                case 3:
                    changeTheme(`purple-turquoise-theme-3-${secondNum}`);
                    break;
                case 4:
                    changeTheme(`black-white-theme-4-${secondNum}`);
                    break;
                default:
                    console.warn("color change: fail matching");
                    return defaultTheme(currentText);
            }
            alert("Changing theme, press OK");
        }
      }

    return (
        <div className="container welcome">
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
            <div className="settings-hider-wrapper" hidden={settingsHidden}>
                <div className='settings-container'>
                    <h2 className="settings-title">Settings</h2>
                    <button className="x-button" onClick={handleSettingsClose}>X</button>
                    <div className="admin-controls-wrapper" hidden={!isAdmin}>
                        <div className="admin-controls">
                        <input type="text" className="theme-input" onKeyDown={handleEnter} placeholder="color combo" />
                        <input type="text" className="personality-input" onKeyDown={handleEnterPersonality} placeholder="personality"/>
                        <p>{`Current Personality: ${personalityState}`}</p>
                        </div>
                    </div>

                    <input
                        type="password" 
                        className="admin-password-input" 
                        onKeyDown={handleAdminEnter} 
                        placeholder="Enter Admin Password" 
                    />
                </div>
            </div>
        </div>
    );
};

export default Welcome;
