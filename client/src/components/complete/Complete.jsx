import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import "./Complete.css";
import { use } from "react";

const Complete = ({changeTheme, changePersonality}) => {
    const navigate = useNavigate();

    const arrowRef = useRef(null); // Reference for the ">" arrow
    const [isArrowVisible, setArrowVisible] = useState(false); // State for arrow visibility
    const [settingsHidden, setSettingsHidden] = useState(true);

    // Handlers for navigation
    const handlePlayClick = () => navigate('/'); // NOTE: now skips login! TODO: turn data collecting off.
    const handleSecretsClick = () => window.location.href="https://www.youtube.com/watch?v=dQw4w9WgXcQ";

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
            <div className="polygon"></div>
            <h1 className="welcome-title top-text"><span className="welcome-text">Chatbot</span></h1>
            <h1 className="welcome-title bottom-text">Complete!</h1>
            <div className="button-menu-complete">
                <div
                    className={`menu-arrow ${isArrowVisible ? "visible" : "hidden"}`}
                    ref={arrowRef}
                >
                    &gt;
                </div>
                {sessionStorage.getItem("isResearchMode")  === "false" && 
                <button
                    className="play-button"
                    onClick={handlePlayClick}
                    onMouseEnter={updateArrowPosition}
                    onMouseLeave={hideArrow}
                >
                    Play Again!
                </button>}
                {/* WE GETTING CLOSE TO PRODUCTION 
                SORRY RICKROLL YOU GOTTA GO
                <button
                    className={`play-button ${sessionStorage.getItem("isResearchMode")  === "true" ? "hidden" : "visible"}`}
                    onClick={handleSecretsClick}
                    onMouseEnter={updateArrowPosition}
                    onMouseLeave={hideArrow}
                >
                    Secrets
                </button> */}
                {console.log("Button class:", sessionStorage.getItem("isResearchMode") === "true" ? "hidden" : "visible")}
            </div>
            {sessionStorage.getItem("isResearchMode") === "true" && 
                <div className="announce-text">
                <p>
                    Thank you for playing our game and participating in our study!
                </p>
                <p>
                    You are done. You may now close this window.
                </p>
            </div>}
        </div>
    );
};

export default Complete;
