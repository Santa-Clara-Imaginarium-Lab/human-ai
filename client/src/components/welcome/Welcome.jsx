import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./welcome.css";

const Welcome = ({changeTheme}) => {
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

    return (
        <div className="container welcome">
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
