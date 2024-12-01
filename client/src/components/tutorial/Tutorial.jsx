import React from 'react';
import './Tutorial.css'; // Assuming you have a CSS file for this component
import { useNavigate } from 'react-router-dom';

function Tutorial() {
  const navigate = useNavigate();

  const handleNoClick = () => {
    navigate('/game-tutorial'); // Navigate to the GameTutorial page
  };

  return (
    <div className="container tutorial-container">
      <h3 className="tutorial-subtitle">Tutorial</h3>
      <p className="tutorial-description">The Prisoner's Dilemma is a game based in cooperation and defection, <br></br>where you and your opponent's choices affect the scores you receive.</p>
    <div className="tutorial-options">
      <button className="no-button" onClick={handleNoClick}>Proceed</button>
    </div>
    </div>
  );
}

export default Tutorial;
