import './chatbotArchetype.css';
import formattedPersonalities from '../../constants/formattedPersonalities';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Control = () => {
    const totalChatbotScore = sessionStorage.getItem('aiScore') || '?';
    const totalUserScore = sessionStorage.getItem('userScore') || '?';
    const personality = sessionStorage.getItem('personality');
    const aiChoices = JSON.parse(sessionStorage.getItem('aiChoices'));
    const userChoices = JSON.parse(sessionStorage.getItem('userChoices'));

    const MAX_POSSIBLE_ROUNDS = 5;
    const MAX_ROUNDS = parseInt(sessionStorage.getItem('maxRounds'));

    const navigate = useNavigate();

    // Fill in missing rounds with X's
    for (let i = MAX_ROUNDS; i < MAX_POSSIBLE_ROUNDS; i++) {
        aiChoices.push('X');
        userChoices.push('X');
    }

    const handleClick = () => {
        if(sessionStorage.getItem("isResearchMode") === "true"){
            navigate('/debrief'); 
        } else {
            navigate('/complete');
        }
    }

    return (
        <div className="container end-screen-container1">
            <div className="results-container">
                <div className="win-banner1">
                    <div className="win-text">Chatbot Archetype</div>
                </div>

                <div className="bottom-half">
                    <div className="scores">
                        <div className="top-half">
                            <div className="chatbot-results1">
                                <h2>Control</h2>
                            </div>
                        </div>
                        <div className="bottom-half">
                            <div className="choices">
                                <div className="choice-header">
                                    <p>Cooperate</p>
                                    <div className="vertical-divider1" style={{ left: "18.5%" }}></div>
                                    <p>Defect</p>
                                </div>
                                <div className="rounds">
                                    {aiChoices.map((choice, index) => (
                                        <div className="round" key={index}>
                                            <span>
                                                {aiChoices[index] === 'Cooperate' ? '✔' : ''}
                                            </span>
                                            <span>Round {index + 1}</span>
                                            <span>
                                                {aiChoices[index] === 'Defect' ? '✔' : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="actions1">
                            <h3>Description</h3>
                            <p>
                                You played against the Control chatbot! This chatbot is Chat-GPT4 with no personality priming. Chat-GPT4 remains neutral, analytical, and adaptable, making decisions based on context rather than a predefined behavioral pattern. Its responses are the least predictable among the archetypes since they are not influenced by any set personality framework.
                            </p>
                    </div>
                </div>

                <button className="next-button" onClick={handleClick}>Next</button>
            </div>
        </div>
    );
}

export default Control;