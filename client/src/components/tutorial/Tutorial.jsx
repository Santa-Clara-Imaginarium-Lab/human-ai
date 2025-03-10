import { React, useState, useEffect } from 'react';
import './Tutorial.css'; // Assuming you have a CSS file for this component
import { useNavigate } from 'react-router-dom';
import personalities from '../../constants/personalities';
import Typewriter from '../Typewriter/typewriter';

function Tutorial() {
  const navigate = useNavigate();

  const [briefGo, setBriefGo] = useState(false);
  const [btuGo, setBtuGo] = useState(false);

  const handleNoClick = () => {
    /* <!> Game variable resets occur here <!> */
    sessionStorage.setItem('remainingPersonalities', JSON.stringify(personalities)); // Store the unmodified personalities array in sessionStorage
    sessionStorage.setItem('personalitiesArr', JSON.stringify([])); // Store the first personality in sessionStorage
    sessionStorage.removeItem('gameLog1'); // Reset game log to prevent half-game completion errors
    sessionStorage.setItem('aiScore', 0);
    sessionStorage.setItem('userScore', 0);
    sessionStorage.setItem('currentRound', 1);
    sessionStorage.setItem('maxRounds', Math.floor(Math.random() * 4) + 2) // 2-5 rounds
    sessionStorage.setItem('chatbotApproachScore', 0);
    sessionStorage.setItem('chatbotSkipScore', 0);
    sessionStorage.setItem('numChangeDescisions', 0);
    sessionStorage.setItem('aiChoices', JSON.stringify([]));
    sessionStorage.setItem('userChoices', JSON.stringify([]));
    navigate('/game-tutorial', { state: { speedFlag: false, userScore: 0, aiScore: 0 }}); // Navigate to the GameTutorial page
  };

      useEffect(() => {
        setTimeout(() => {
          setBtuGo(true); // Show the underline
        }, 500)
        setTimeout(() => {
          setBriefGo(true); // Hide the brief transitioner
          // document.getElementById("btt").classList.add("brief-txt");
          // document.getElementById("btu").classList.add("brief-underline-hide");
        }, 2000)
      }, []);
  

  return (
    <div className="container tutorial-container">
          <div className={`brief-transitioner ${briefGo ? 'brief-go' : ''}`}>
            <h1 className="brief-transitioner-text"> Game Tutorial </h1>
            <div className={`brief-transitioner-underline ${btuGo ? 'brief-underline-go' : ''}`}/>
          </div>
      <div className='survey-shadow-container'>
      <h2 className="tutorial-subtitle">
        <Typewriter text="Learn about your job at Caboodle, a job based on sharing and withholding investment data." speed={30} delay={2000}/>
      </h2>
      <div className="tutorial-options">
        <button className="no-button" onClick={handleNoClick}>Proceed</button>
      </div>
      </div>
    </div>
  );
}

export default Tutorial;
