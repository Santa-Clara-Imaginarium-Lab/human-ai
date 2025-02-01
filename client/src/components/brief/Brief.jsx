import React from 'react';
import './Brief.css'; 
import { useNavigate } from 'react-router-dom';

function Brief() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/consent-form'); 
    };

    return (
        <div className="container tutorial-container">
          <div className='survey-shadow-container'>
          <h2 className="brief-subtitle">You will be involved in a Human-AI interactions study. You will be asked questions about your personality, engage in a Prisoner’s Dilemma style trust game with an AI chatbot, and be asked how much you trust the AI chatbots you are playing against. You will be given a brief tutorial on how to engage with the chatbots and play the Prisoner’s Dilemma game.</h2>
          <div className="brief-options">
            <button className="no-button" onClick={handleClick}>Proceed</button>
          </div>
          </div>
        </div>
      );
}

export default Brief;