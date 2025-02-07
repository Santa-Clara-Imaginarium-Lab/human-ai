import React from 'react';
import './Pregame.css'; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Pregame() {
    const navigate = useNavigate();

    const [termsIndex, setTermsIndex] = useState(0);

    const terms =[
        "We have finished the tutorial.",
        "The goal of this job is for you to make the best investment decision with the AI Agent.",
        "You have the option to chat with the AI Agent if you would like to understand their strategy, but it is not required.",
        "Please go through your job with intent, we are excited to see your results!"
    ];

    useEffect(() => {
      if (termsIndex >= terms.length) {
        navigate('/dashboard'); //change this
      }
    }, [termsIndex])

    const handleClick = () => {
      setTermsIndex((prevTerm) => prevTerm + 1);
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
            <h1 id="btt" className="brief-transitioner-text"> Prepare to Play! </h1>
            <div id="btu" className="brief-transitioner-underline"/>
          </div>
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