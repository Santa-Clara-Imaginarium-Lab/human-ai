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
            <button className="results-title-button">
                Results
            </button>
            <div className="results-container">
                <div className="round-results-rectangle">
                    <p className="round-results-text">R1</p>
                </div>
                <div className="round-results-rectangle">
                    <p className="round-results-text">R2</p>
                </div>
                <div className="round-results-rectangle">
                    <p className="round-results-text">R3</p>
                </div>
                <div className="round-results-rectangle">
                    <p className="round-results-text">R4</p>
                </div>
                <div className="round-results-rectangle">
                    <p className="round-results-text">R5</p>
                </div>
                <div className="chatbot-results-wrapper">
                    <div className="chatbot-results-rectangle">
                        <p className="chatbot-results-text">Chatbot 1</p>
                        <div className="scores-labels-container">
                            <p className="chatbot-score-label">Chatbot's Score:</p>
                            <p className="player-score-label">Your Score:</p>
                        </div>
                        <div className="scores-container">
                            {gameLog && gameLog.data.map((gameLogData, index) => {
                                totalChatbotScore += gameLogData[`Round${index + 1}`].AI;
                                totalUserScore += gameLogData[`Round${index + 1}`].You;
                                return (
                                    <div className={`scores-${index + 1}`} key={index}>
                                        <p className="chatbot-score">{totalChatbotScore}</p>
                                        <p className="player-score">{totalUserScore}</p>
                                    </div>
                                );
                            })}
                        </div>
                        {totalChatbotScore < totalUserScore && 
                            <p className="chatbot-victory-text">VICTORY !!</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EndScreen;