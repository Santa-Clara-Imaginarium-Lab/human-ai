import React from 'react';
import './PersonalityQuestions.css'; 
import { useNavigate } from 'react-router-dom';

function PersonalityQuestions() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/demographic-questions'); 
    };

    return (
        <div className="container tutorial-container">
          <div className='survey-shadow-container'>
          <h2 className="brief-subtitle">personality questions</h2>
          <div className="brief-options">
            <button className="no-button" onClick={handleClick}>Proceed</button>
          </div>
          </div>
        </div>
      );
}

export default PersonalityQuestions;