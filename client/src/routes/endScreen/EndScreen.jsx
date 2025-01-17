import { useEffect, useState } from 'react';
import './endScreen.css';

const EndScreen = () => {
    const [gameLogs, setGameLogs] = useState([]);

    useEffect(() => {
        const gameLog1Info = JSON.parse(sessionStorage.getItem('gameLog1'));
        const gameLog2Info = JSON.parse(sessionStorage.getItem('gameLog2'));
        const gameLog3Info = JSON.parse(sessionStorage.getItem('gameLog3'));
        const gameLog4Info = JSON.parse(sessionStorage.getItem('gameLog4'));
        const gameLog5Info = JSON.parse(sessionStorage.getItem('gameLog5'));

        setGameLogs([gameLog1Info, gameLog2Info, gameLog3Info, gameLog4Info, gameLog5Info]);
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
                    {gameLogs.map((gameLog, index) => {
                        let totalChatbotScore = 0;
                        let totalUserScore = 0;
                        return (
                            <div className="chatbot-results-rectangle">
                                <p className="chatbot-results-text">Chatbot {index + 1}</p>
                                <div className="scores-labels-container">
                                    <p className="chatbot-score-label">Chatbot's Score:</p>
                                    <p className="user-score-label">Your Score:</p>
                                </div>
                                <div className="scores-container">
                                    {gameLog.data.map((gameLogData, index) => {
                                        totalChatbotScore += gameLogData[`Round${index + 1}`].AI;
                                        totalUserScore += gameLogData[`Round${index + 1}`].You;
                                        return (
                                            <div className={`scores-${index + 1}`}>
                                                <p className="chatbot-score">{totalChatbotScore}</p>
                                                <p className="user-score">{totalUserScore}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                {totalChatbotScore < totalUserScore && 
                                    <p className="chatbot-victory-text">VICTORY !!</p>
                                }
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default EndScreen;