import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import './GameEndCode.css';

function GameEndCode() {
    const navigate = useNavigate();
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
    };

    useEffect(() => {
        fetchDailyCode();
    }, []);

    const handleClick = () => {
        navigate('/complete');
    };

    return (
        <div className="container tutorial-container">
            <p className="instruction">Copy the code below and paste it in Qualtrix</p>
            <div className="copy-code">
                <h2>{dailyCode}</h2>
                <button className="copy-button" onClick={copyToClipboard}>
                    <FontAwesomeIcon icon={faCopy} />
                </button>
            </div>
            <button className="submit-button" onClick={handleClick}>Next</button>
        </div>
    );
}

export default GameEndCode;
