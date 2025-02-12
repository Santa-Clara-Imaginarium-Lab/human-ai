import './chatbotArchetype.css';
import formattedPersonalities from '../../constants/formattedPersonalities';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Average = () => {
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
        <div className="container end-screen-container">
            <div className="results-container">
                <div className="header">
                    <button className="back-button">&lt;</button>
                    <h1 className="title">Chatbot Archetype</h1>
                </div>

                <div className="content">
                    <h2 className="role-model-title">Average</h2>

                    <div className="actions">
                        <div className="choices">
                            <div className="choice-header">
                                <span>Cooperate</span>
                                <span>Defect</span>
                            </div>
                            <div className="rounds">
                                {aiChoices.map((choice, index) => (
                                    <div className="round" key={index}>
                                        <span className={choice === '✔' ? 'cooperate' : 'defect'}>
                                            {choice === 'X' ? '✖' : choice}
                                        </span>
                                        <span>Round {index + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="description">
                            <h3>Description</h3>
                            <p>
                                You played against the Role Model chatbot! This chatbot is ethical and considerate, responding in a thoughtful and fair way. It values honesty and cooperation, always aiming to do the right thing. It avoids extreme or selfish choices, making decisions that are predictable and focused on fairness.
                            </p>
                        </div>
                    </div>
                </div>

                <button className="next-button" onClick={handleClick}>Next</button>
            </div>
        </div>
    );
}

export default Average;