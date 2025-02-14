import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PreSurveys() {
    const navigate = useNavigate();

    const [briefGo, setBriefGo] = useState(false);
    const [btuGo, setBtuGo] = useState(false);

    const handleClick = () => {
        navigate('/pre-humanai-1'); 
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
            <h1 className="brief-transitioner-text"> Pre-Game Questions </h1>
            <div className={`brief-transitioner-underline ${btuGo ? 'brief-underline-go' : ''}`}/>
          </div>
          <div className='survey-shadow-container'>
          <h2 className="brief-subtitle">Please answer the following questions.</h2>
          <div className="brief-options">
            <button className="no-button" onClick={handleClick}>Proceed</button>
          </div>
          </div>
        </div>
      );
}

export default PreSurveys;