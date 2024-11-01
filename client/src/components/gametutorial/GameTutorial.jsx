import React from 'react';
import './GameTutorial.css'; // Ensure this file contains the necessary CSS
import { useNavigate } from 'react-router-dom';

function GameTutorial() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/chatbot-tutorial'); // Navigate to the ChatbotTutorial page
  };

  return (
    <div className="container">
      <button className="tutorial-button">Decision Making Tutorial</button>

      <div className="game-tutorial-content">
        {/* Flex container to arrange AI score, triangle grid, and user score horizontally */}
        <div className="horizontal-layout">
          <div className="ai-score">
          <p className="score-change ai-change">+5</p>
            <h2>AI's Score: <span className="score-value">0</span></h2>
          </div>
          <div className="column-1">
          <div className="triangle-left"></div>
          </div>
          <div className="column-2">
          <div className="triangle-left"></div>
          <div className="triangle-right"></div>
          <div className="triangle-left"></div>
          </div>
          <div className="column-3">
          <div className="triangle-right"></div>
          <div className="triangle-left"></div>
          <div className="triangle-right"></div>
          </div>
          <div className="column-4">
          <div className="triangle-right"></div>
          </div>
          <div className="user-score">
          <p className="score-change user-change">+0</p>
            <h2>Your Score: <span className="score-value">0</span></h2>
          </div>
        </div>
          <button className="proceed-button" onClick={handleClick}>Proceed</button>
      </div>
    </div>
  );
}

export default GameTutorial;
