import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PreSurveys() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/pre-humanai-1'); 
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
            <h1 id="btt" className="brief-transitioner-text"> Pre-Game Questions </h1>
            <div id="btu" className="brief-transitioner-underline"/>
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