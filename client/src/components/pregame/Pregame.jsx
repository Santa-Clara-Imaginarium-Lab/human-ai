import React from 'react';
import './Pregame.css'; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typewriter from '../Typewriter/typewriter';

function Pregame() {
    const navigate = useNavigate();

    const [termsIndex, setTermsIndex] = useState(0);

    const [briefGo, setBriefGo] = useState(false);
    const [btuGo, setBtuGo] = useState(false);

    const terms =[
        "You are now prepared for your job at Caboodle.",
        "Now, you will experience up to 5 days at Caboodle with the AI.",
        "Each day, you have the option to chat with the AI Agent to understand their strategy, but it is not required.",
        "Please go through your job with intent. We are excited to see your results!"
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
            <h1 className="brief-transitioner-text"> Prepare to Play! </h1>
            <div className={`brief-transitioner-underline ${btuGo ? 'brief-underline-go' : ''}`}/>
          </div>
          <div className='survey-shadow-container'>
          <h2 className="brief-subtitle">
            { terms[termsIndex] /* <Typewriter key={termsIndex} className="brief-subtitle" text={terms[termsIndex]} speed={30} delay={termsIndex === 0 ? 2000 : 0}/> */}
          </h2>
          <div className="brief-options">
            <button className="no-button" onClick={handleClick}>Proceed</button>
          </div>
          </div>
        </div>
      );
}

export default Pregame;