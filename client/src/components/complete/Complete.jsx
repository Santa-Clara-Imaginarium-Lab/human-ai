import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import "./Complete.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { use } from "react";

const Complete = ({changeTheme, changePersonality}) => {
    const navigate = useNavigate();

    const arrowRef = useRef(null); // Reference for the ">" arrow
    const [isArrowVisible, setArrowVisible] = useState(false); // State for arrow visibility
    const [settingsHidden, setSettingsHidden] = useState(true);

    // Handlers for navigation
    const handlePlayClick = () => navigate('/'); // NOTE: now skips login! TODO: turn data collecting off.
    const handleSecretsClick = () => window.location.href="https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    const [dailyCode, setDailyCode] = useState("");
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(dailyCode).then(() => {
            setCopied(true);
        }).catch(err => console.error("Failed to copy:", err));
    };

    // Function to generate a random alphanumeric string
    const generateCode = () => {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    };

    // Function to fetch today's code from Google Sheets
    const fetchDailyCode = async () => {
        try {
            const response = await fetch("https://human-ai.up.railway.app/api/daily-code");
            if (response.ok) {
                const data = await response.json();
                setDailyCode(data.code);
            } else {
                console.log("No code found for today. Generating a new one...");
                generateAndStoreCode();
            }
        } catch (error) {
            console.error("Error fetching daily code:", error);
        }
    };

    // Function to generate and save a new code in Google Sheets
    const generateAndStoreCode = async () => {
        const newCode = generateCode();
        try {
            await fetch("https://human-ai.up.railway.app/api/daily-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ generatedCode: newCode })
            });
            console.log("Successfully saved new daily code:", newCode);
        } catch (error) {
            console.error("Error saving daily code:", error);
        }
        setDailyCode(newCode);
    };

    useEffect(() => {
        fetchDailyCode();
    }, []);
    
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
                    <p className="instruction"><i>You have completed the game. Thank you for playing!</i><br/>Copy the code below and paste it in your Qualtrics survey to proceed.</p>
                    <div className="copy-code">
                        <h2>{dailyCode}</h2>
                        <button className="copy-button" onClick={copyToClipboard}>
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                    </div>
                    <p className="instruction">Do not close this page until you have completed the Qualtrics survey.</p>

                </div>
            }
        </div>
    );
};

export default Complete;
