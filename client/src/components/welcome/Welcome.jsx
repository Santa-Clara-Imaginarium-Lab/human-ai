import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import "./Welcome.css";
import { use } from "react";
import { verifyPassword } from '../../crypto/crypto.jsx';

const Welcome = ({changeTheme, changePersonality}) => {
    const navigate = useNavigate();
    
    // Reset settings
    const { login } = useUser();
    
    // Use useEffect to call login instead of calling it during render
    useEffect(() => {
        login("guest");
    }, []);

    const arrowRef = useRef(null); // Reference for the ">" arrow
    const [isArrowVisible, setArrowVisible] = useState(false); // State for arrow visibility
    const [settingsHidden, setSettingsHidden] = useState(true);
    const [password, setPassword] = useState('');
    const [isAdmin, setAdmin] = useState(false); 
    const [isCheckingGuest, setIsCheckingGuest] = useState(false);
    const [ldmState, setLdmState] = useState('off');

    useEffect(() => {
        sessionStorage.setItem('LDM', 'off');        
    }, [])

    const pwShowRef = useRef(null);

    const togglePWVisibility = () => {
        const passwordInput = pwShowRef.current.parentElement.querySelector('.admin-password-input');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        pwShowRef.current.textContent = type === 'password' ? 'Show' : 'Hide';
      }
    
    // Handlers for navigation
    const handlePlayClick = async () => { // NOTE: now skips login! TODO: turn data collecting off.
        sessionStorage.setItem('isResearchMode', false);

        // random number between 0 and 10 million
        const randomNumber = Math.floor(Math.random() * 10000000);
        const guestID = "guest" + String(randomNumber);

        // Check if userId exists in the chats collection
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats?userId=${guestID}`);
        if (!response.ok) {
            alert('Critical error: Unable to check user ID. Please try again later.');
            return;
        }

        const chatData = await response.json();
        if (chatData.length > 0) {
            alert('Critical error: This user ID has already been used. Press Play again.');
            return;
        }

        setIsCheckingGuest(true);
        
        login(guestID);
        navigate('/tutorial');

        
    }
    const handleResearchModeClick = () => {
        sessionStorage.setItem('isResearchMode', true);

        navigate('/login');
    }
    const handleSettingsClick = () => {
        setSettingsHidden(false);
    }
    const handleSettingsClose = () => {
        setSettingsHidden(true);
    }
    const handleAdminEnter = async (e) => {
        if (e.key === 'Enter') {
            let result = await verifyPassword(password, "adminPanel");
            if (result) {
                setAdmin(true);
            }
            else {
                alert('Incorrect admin password.');
            }
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

    const [personalityState, setPersonality] = useState('random');

    // Set default settings
    useEffect(() => {
        changePersonality('random'); 
    }, []);

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

    const [themeState, setTheme] = useState('black-white-theme-4-2');

    useEffect(() => {
        changeTheme('black-white-theme-4-2'); 
    }, []);

    function handleEnter (e) {
        // helper function - default case
        function defaultTheme(currentText) {
            alert("Code not understood! Please try again. Setting to default theme");
            console.log(currentText + " theme not found, defaulting to yellow-blue-theme-1-1");
            setTheme('black-white-theme-4-2');
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
                    setTheme(`yellow-blue-theme-1-${secondNum}`);
                    changeTheme(`yellow-blue-theme-1-${secondNum}`);
                    break;
                case 2:
                    setTheme(`red-green-theme-2-${secondNum}`);
                    changeTheme(`red-green-theme-2-${secondNum}`);
                    break;
                case 3:
                    setTheme(`purple-turquoise-theme-3-${secondNum}`);
                    changeTheme(`purple-turquoise-theme-3-${secondNum}`);
                    break;
                case 4:
                    setTheme(`black-white-theme-4-${secondNum}`);
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
        <div className={`container welcome`}>
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
                    Free Play
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

                <div className="ldm-wrapper">
                    <h2 hidden={isAdmin}>Low Detail Mode</h2>
                    <div className="ldm-background" hidden={isAdmin}>
                        <button
                            className={`${ldmState === "on" ? "ldm-button-on" : "ldm-button-off"}`}
                            onClick={() => {
                                const currentLDM = sessionStorage.getItem("LDM");
                                const newLDM = currentLDM === "off" ? "on" : "off";
                                sessionStorage.setItem("LDM", newLDM);
                                setLdmState(newLDM);
                            }}
                        >
                            {ldmState}
                        </button>
                    </div>
                </div>
                <br/>
                <div className="ldm-description" hidden={isAdmin}>
                    <p hidden={isAdmin}>Low Detail Mode removes all animations and transitions from the game pages.</p>
                </div>
                    



                <p className="admin-header" hidden={isAdmin}>Admin Panel</p>

                    <div className="admin-controls-wrapper" hidden={!isAdmin}>
                        <div className="admin-controls">
                        <input type="text" className="theme-input" onKeyDown={handleEnter} placeholder="color combo" />
                        <p>{`Current Color Theme: ${themeState}`}</p>
                        <input type="text" className="personality-input" onKeyDown={handleEnterPersonality} placeholder="personality"/>
                        <p>{`Current Personality: ${personalityState}`}</p>
                        </div>
                    </div>

                    <p className="admin-header" hidden={!isAdmin}>Chat History</p>
                    <button className="view-button" hidden={!isAdmin} onClick={() => navigate('/chat-history')}>View Chats</button>
                    <div className="admin-password-wrapper" hidden={isAdmin}>
                    <input
                        type="password" 
                        className="admin-password-input" 
                        onKeyDown={handleAdminEnter} 
                        placeholder="Enter Admin Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}          
                    />
                    <button className="admin-show-password" type="button" ref={pwShowRef} onClick={togglePWVisibility} >Show</button>
                    </div>

                </div>
            </div>
            <h1 className={isCheckingGuest ? 'welcome-info-can' : 'welcome-info-hide'}>{isCheckingGuest ? 'Server is booting up... Please Wait!' : ' '}</h1>
            <div className="version-display">
                <p>
                v1.1.0 official
                </p>
            </div>
        </div>
    );
};

export default Welcome;
