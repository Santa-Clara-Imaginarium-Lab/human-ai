import React from 'react';
import './GameTutorial.css'; // Ensure this file contains the necessary CSS
import { useNavigate } from 'react-router-dom';

function GameTutorial() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/chatbot-tutorial'); // Navigate to the ChatbotTutorial page
  };

  return (
    <div className="container game-tutorial">
      <button className="decision-tutorial-button">Decision Making Tutorial</button>

      <div className="game-tutorial-content">
        {/* Flex container to arrange AI score, triangle grid, and user score horizontally */}
        <div className="tutorial-horizontal-layout">
          <div className="tutorial-ai-score">
          <p className="tutorial-score-change tutorial-ai-change">+5</p>
            <h2>AI's Score: <span className="tutorial-score-value">0</span></h2>
          </div>
          <div className="tutorial-column-1">
          <div className="tutorial-triangle-left"></div>
          </div>
          <div className="tutorial-column-2">
          <div className="tutorial-triangle-left"></div>
          <div className="tutorial-triangle-right"></div>
          <div className="tutorial-triangle-left"></div>
          </div>
          <div className="tutorial-column-3">
          <div className="tutorial-triangle-right"></div>
          <div className="tutorial-triangle-left"></div>
          <div className="tutorial-triangle-right"></div>
          </div>
          <div className="tutorial-column-4">
          <div className="tutorial-triangle-right"></div>
          </div>
          <div className="tutorial-user-score">
          <p className="tutorial-score-change tutorial-user-change">+0</p>
            <h2>Your Score: <span className="tutorial-score-value">0</span></h2>
          </div>
        </div>
          <button className="tutorial-proceed-button" onClick={handleClick}>Proceed</button>
      </div>
    </div>
  );
}

export default GameTutorial;
