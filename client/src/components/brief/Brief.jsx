import React, { useEffect } from 'react';
import './Brief.css'; 
import { useNavigate } from 'react-router-dom';

function Brief() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/consent-form'); 
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
            <h1 id="btt" className="brief-transitioner-text"> Study Briefing </h1>
            <div id="btu" className="brief-transitioner-underline"/>
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