import React from 'react';
import './Pregame.css'; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Pregame() {
    const navigate = useNavigate();

    const [termsIndex, setTermsIndex] = useState(0);

    const terms =[
        "We have finished the tutorial.",
        "The goal of this game is for you to play the prisoner's dilemma with a chatbot.",
        "You have the option to chat with your opponent if you would like to understand their strategy, but it is not required.",
        "Please go through this game with intent, we are excited to see your results!"
    ];

    useEffect(() => {
      if (termsIndex >= terms.length) {
        navigate('/dashboard'); //change this
      }
    }, [termsIndex])

    const handleClick = () => {
      setTermsIndex((prevTerm) => prevTerm + 1);
    };

    return (
        <div className="container tutorial-container">
          <div className='survey-shadow-container'>
          <h2 className="brief-subtitle">{terms[termsIndex]}</h2>
          <div className="brief-options">
            <button className="no-button" onClick={handleClick}>Proceed</button>
          </div>
          </div>
        </div>
      );
}

export default Pregame;