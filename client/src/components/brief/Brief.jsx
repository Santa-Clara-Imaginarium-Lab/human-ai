import React, { useState, useEffect } from 'react';
import './Brief.css'; 
import { useNavigate } from 'react-router-dom';

function Brief() {
    const navigate = useNavigate();

    const [briefGo, setBriefGo] = useState(false);
    const [btuGo, setBtuGo] = useState(false);

    const handleClick = () => {
        navigate('/consent-form'); 
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
            <h1 className="brief-transitioner-text"> Study Briefing </h1>
            <div className={`brief-transitioner-underline ${btuGo ? 'brief-underline-go' : ''}`}/>
          </div>
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