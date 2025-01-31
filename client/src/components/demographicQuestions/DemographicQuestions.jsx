import React from 'react';
import './DemographicQuestions.css'; 
import { useNavigate } from 'react-router-dom';

function DemographicQuestions() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/game-tutorial'); 
    };

    return (
        <div className="container tutorial-container">
          <div className='survey-shadow-container'>
          <h2 className="brief-subtitle">demographic questions</h2>
          <div className="brief-options">
            <button className="no-button" onClick={handleClick}>Proceed</button>
          </div>
          </div>
        </div>
      );
}

export default DemographicQuestions;