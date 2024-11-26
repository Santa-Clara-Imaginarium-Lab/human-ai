import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./welcome.css";

const Welcome = () => {
    const navigate = useNavigate();

    // Handlers for navigation
    const handlePlayClick = () => navigate('/survey');
    const handleResearchModeClick = () => navigate('/login');
    const handleSettingsClick = () => navigate('/settings');

    // Update skew based on viewport dimensions
    useEffect(() => {
        const polygon = document.querySelector('.polygon');

        function updateSkew() {
            const vw = window.innerWidth; // Get the viewport width in pixels
            const vh = window.innerHeight; // Get the viewport height in pixels

            // Calculate the angle using atan2, which works with numbers (in radians)
            const angle = -Math.atan2(vh, vw) * (180 / Math.PI); // Convert radians to degrees

            // Apply the skew to the element
            polygon.style.transform = `skewY(${angle}deg)`;
        }

        // Update on load and on resize
        window.addEventListener('load', updateSkew);
        window.addEventListener('resize', updateSkew);

        // Call updateSkew on component mount
        updateSkew();

        // Clean up event listeners on component unmount
        return () => {
            window.removeEventListener('load', updateSkew);
            window.removeEventListener('resize', updateSkew);
        };
    }, []); // Empty dependency array ensures this runs once after the component mounts 

    return (
        <div className="container welcome">
            <div className="polygon"></div>
            <h1 className="welcome-title top-text">Chatbot</h1>
            <h1 className="welcome-title bottom-text">Coop</h1>
            <div className="button-menu">
                <button className="play-button" onClick={handlePlayClick}>Play</button>
                <button className="play-button" onClick={handleResearchModeClick}>Research Mode</button>
                <button className="play-button" onClick={handleSettingsClick}>Settings</button>
            </div>
        </div>
    );
};

export default Welcome;
