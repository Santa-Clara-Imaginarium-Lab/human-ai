import React from 'react';
import './Tutorial.css'; // Assuming you have a CSS file for this component
import { useNavigate } from 'react-router-dom';
import personalities from '../../constants/personalities';

function Tutorial() {
  const navigate = useNavigate();

  const handleNoClick = () => {
    /* <!> Game variable resets occur here <!> */
    sessionStorage.setItem('remainingPersonalities', JSON.stringify(personalities)); // Store the unmodified personalities array in sessionStorage
    sessionStorage.setItem('personalitiesArr', JSON.stringify([])); // Store the first personality in sessionStorage
    sessionStorage.removeItem('gameLog1'); // Reset game logs to prevent half-game completion errors
    sessionStorage.removeItem('gameLog2');
    sessionStorage.removeItem('gameLog3');
    sessionStorage.removeItem('gameLog4');
    sessionStorage.removeItem('gameLog5');
    sessionStorage.setItem('aiScore', 0);
    sessionStorage.setItem('userScore', 0);
    sessionStorage.setItem('currentRound', 1);
    sessionStorage.setItem('chatbotApproachScore', 0);
    sessionStorage.setItem('chatbotSkipScore', 0);
    sessionStorage.setItem('numChangeDescisions', 0);
    navigate('/game-tutorial'); // Navigate to the GameTutorial page
  };

  return (
    <div className="container tutorial-container">
      <div className='survey-shadow-container'>
      <h2 className="tutorial-subtitle">Learn about the Prisoner's Dilemma, a game based on cooperation and defection.</h2>
      <div className="tutorial-options">
        <button className="no-button" onClick={handleNoClick}>Proceed</button>
      </div>
      </div>
    </div>
  );
}

export default Tutorial;
