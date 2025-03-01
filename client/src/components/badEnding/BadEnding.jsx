import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import "./BadEnding.css";
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
            <h1 className="welcome-title top-text"><span>Chatbot</span></h1>
            <h1 className="welcome-title bottom-text">Canceled!</h1>
            <div className="announce-text">
                <p>
                    Experiment terminated. 
                    Your user ID has been locked.
                </p>
                <p>
                    Please contact the researchers if this was done in error.
                </p>
            </div>
        </div>
    );
};

export default Complete;
