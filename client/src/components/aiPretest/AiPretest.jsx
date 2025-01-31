import React from 'react';
import './AiPretest.css'; 
import { useNavigate } from 'react-router-dom';

function AiPretest() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/personality-questions'); 
    };

    return (
        <div className="container tutorial-container">
          <div className='survey-shadow-container'>
          <h2 className="brief-subtitle">ai pretest</h2>
          <div className="brief-options">
            <button className="no-button" onClick={handleClick}>Proceed</button>
          </div>
          </div>
        </div>
      );
}

export default AiPretest;