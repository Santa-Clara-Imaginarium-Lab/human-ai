import { useEffect, useState } from 'react';
import './endScreen.css';

const EndScreen = () => {
    const [gameLog, setGameLog] = useState(null);
    let totalChatbotScore = 0;
    let totalUserScore = 0;

    useEffect(() => {
        const gameLogInfo = JSON.parse(sessionStorage.getItem('gameLog1'));

        setGameLog(gameLogInfo);

        console.log(gameLogInfo);
    }, []);

    return (
        <div className="container end-screen-container">
            <div className="results-container">
                <div className="top-half">
                    <div className="chatbot-results">
                        <h2>Chatbot</h2>
                        <p>{totalChatbotScore}</p>
                    </div>
                    <div className="user-results">
                        <h2>You</h2>
                        <p>{totalUserScore}</p>
                    </div>
                    <div className="win-banner">
                        <div className="win-text">YOU WIN</div>
                        <div className="divider"></div>
                    </div>
                </div>
                <div className="bottom-half">
                    <div className="personality">
                        <h2>Role-Model</h2>
                        <p>Click here to learn more about this personality</p>
                    </div>
                    <div className="actions">
                        <div className="left-side">
                            <h2>Chatbot</h2>
                            <div className="divider2"></div>
                            <h2>You</h2>
                        </div>
                        <div className="right-side">
                            <div className="grid-container">
                                {Array.from({ length: 10 }, (_, index) => (
                                    <div className="cell" key={index}>
                                        {index % 2 === 0 ? "Defect" : "Cooperate"}
                                    </div>
                                ))}
                                {/* Vertical dividers */}
                                <div className="vertical-divider" style={{ left: "18.5%" }}></div>
                                <div className="vertical-divider" style={{ left: "39%" }}></div>
                                <div className="vertical-divider" style={{ left: "59.5%" }}></div>
                                <div className="vertical-divider" style={{ left: "80.25%" }}></div>
                                {/* Horizontal divider */}
                                <div className="horizontal-divider"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EndScreen;