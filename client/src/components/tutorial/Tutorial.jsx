import { React, useEffect } from 'react';
import './Tutorial.css'; // Assuming you have a CSS file for this component
import { useNavigate } from 'react-router-dom';
import personalities from '../../constants/personalities';

function Tutorial() {
  const navigate = useNavigate();

  const handleNoClick = () => {
    /* <!> Game variable resets occur here <!> */
    sessionStorage.setItem('remainingPersonalities', JSON.stringify(personalities)); // Store the unmodified personalities array in sessionStorage
    sessionStorage.setItem('personalitiesArr', JSON.stringify([])); // Store the first personality in sessionStorage
    sessionStorage.removeItem('gameLog1'); // Reset game log to prevent half-game completion errors
    sessionStorage.setItem('aiScore', 0);
    sessionStorage.setItem('userScore', 0);
    sessionStorage.setItem('currentRound', 1);
    sessionStorage.setItem('chatbotApproachScore', 0);
    sessionStorage.setItem('chatbotSkipScore', 0);
    sessionStorage.setItem('numChangeDescisions', 0);
    sessionStorage.setItem('aiChoices', JSON.stringify([]));
    sessionStorage.setItem('userChoices', JSON.stringify([]));
    navigate('/game-tutorial'); // Navigate to the GameTutorial page
  };

      useEffect(() => {
        setTimeout(() => {
          document.getElementById("btu").classList.add("brief-underline-go");
        }, 500)
        setTimeout(() => {
          document.getElementById("bt").classList.add("brief-go");
          document.getElementById("btt").classList.add("brief-txt");
          document.getElementById("btu").classList.add("brief-underline-hide");
        }, 2000)
      }, );
  

  return (
    <div className="container tutorial-container">
          <div id="bt" className="brief-transitioner">
            <h1 id="btt" className="brief-transitioner-text"> Game Tutorial </h1>
            <div id="btu" className="brief-transitioner-underline"/>
          </div>
      <div className='survey-shadow-container'>
      <h2 className="tutorial-subtitle">Learn about your job at Caboodle, a job based on sharing and withholding data.</h2>
      <div className="tutorial-options">
        <button className="no-button" onClick={handleNoClick}>Proceed</button>
      </div>
      </div>
    </div>
  );
}

export default Tutorial;
