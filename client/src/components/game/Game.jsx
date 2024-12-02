import React, { useState } from 'react';
import './Game.css'; // Ensure this file contains the necessary CSS
import { useNavigate } from 'react-router-dom';

function Game() {
  const navigate = useNavigate();


  // Function to fetch AI's response from the Gemini API
  const fetchAiResponse = async (userInput) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/gemini-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_GEMINI_PUBLIC_KEY}`, // API key from .env
        },
        body: JSON.stringify({
          userInput, // Pass the user's decision
          userScore,
          aiScore,
          currentRound,
        }),
      });

      const data = await response.json();
      return data.answer; // API returns { answer: 'Cooperate' or 'Defect' }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return 'Defect'; // Default fallback decision
    }
  };


  const [userScore, setUserScore] = useState(0); // Track user score
  const [aiScore, setAiScore] = useState(0); // Track AI score
  const [currentRound, setCurrentRound] = useState(1); // Track current round
  const [aiDecision, setAiDecision] = useState(''); // AI's decision
  const [gameLog, setGameLog] = useState([]); // Log of decisions and outcomes
  const MAX_ROUNDS = 5; // Total number of rounds
  const [isGameOver, setIsGameOver] = useState(false); // Track if the game is over


  const handleUserDecision = async (userDecision) => {
    if (isGameOver) return; // Prevent further gameplay if the game is over
    const aiChoice = await fetchAiResponse(userDecision); // Fetch AI's response
    setAiDecision(aiChoice); // Set AI's decision for display
  
    // Calculate scores based on decisions
    let userPoints = 0;
    let aiPoints = 0;
  
    if (userDecision === 'Cooperate' && aiChoice === 'Cooperate') {
      userPoints = 2;
      aiPoints = 2;
    } else if (userDecision === 'Defect' && aiChoice === 'Defect') {
      userPoints = 0;
      aiPoints = 0;
    } else if (userDecision === 'Cooperate' && aiChoice === 'Defect') {
      userPoints = -1;
      aiPoints = 3;
    } else if (userDecision === 'Defect' && aiChoice === 'Cooperate') {
      userPoints = 3;
      aiPoints = -1;
    }
  
    // Update the state
    setUserScore((prev) => prev + userPoints);
    setAiScore((prev) => prev + aiPoints);
    setGameLog((prev) => [
      ...prev,
      `Round ${currentRound}: You chose ${userDecision}, AI chose ${aiChoice}.`,
    ]);
  
    // Move to the next round or end the game
    if (currentRound >= MAX_ROUNDS) {
      setIsGameOver(true); // Mark the game as over
      setCurrentRound((prev) => prev + 1);
    } else {
      setCurrentRound((prev) => prev + 1); // Move to the next round
    }
  };
  

  return (
    <div className="container game">
      <div className="game-content">
        {/* Flex container to arrange AI score, triangle grid, and user score horizontally */}
        <div className="horizontal-layout">
        <div className="user-score">
            <p className="score-change user-change"></p>
            <h2>Your Score: <span className="score-value">{userScore}</span></h2>
          </div>
          <div className="column-1">
            <div className="triangle-left">
              <span className="ai-defect-desc">You Defect</span>
            </div>
          </div>
          <div className="column-2">
            <div className="triangle-left">
            <span className="ai-cooperate-desc">You  Cooperate</span>
            </div>
            <div className="triangle-right"></div>
            <div className="triangle-left"></div>
          </div>
          <div className="column-3">
            <div className="triangle-right">
              <span className='user-cooperate-desc'>AI Coopeate</span>
            </div>
            <div className="triangle-left"></div>
            <div className="triangle-right"></div>
          </div>
          <div className="column-4">
            <div className="triangle-right">
            <span className='user-defect-desc'>AI Defect</span>
            </div>
          </div>
          <div className="column-5">
            <div className="triangle-left-5"></div>
          </div>
          
          <div className="ai-score">
          <h2>AI's Score: <span className="score-value">{aiScore}</span></h2>
          <p className="ai-decision">AI chose: {aiDecision}</p>
          </div>
          {/* <div className="game-log">
            {gameLog.map((log, index) => (
              <p key={index}>{log}</p>
            ))}
          </div> */}
        </div>
        <div className="action">
        <button className="proceed-button" onClick={() => handleUserDecision('Cooperate')}>
    Cooperate
  </button>
  <button className="proceed-button" onClick={() => handleUserDecision('Defect')}>
    Defect
  </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
