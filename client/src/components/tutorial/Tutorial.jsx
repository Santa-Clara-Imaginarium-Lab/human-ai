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
      <div className='survey-shadow-container'>
      <h2 className="tutorial-subtitle">Are you familiar with the rules of the Prisoner's Dilemma?</h2>
      <div className="tutorial-options">
        <button className="no-button" onClick={handleNoClick}>Take Tutorial</button>
      </div>
      </div>
    </div>
  );
}

export default Tutorial;
