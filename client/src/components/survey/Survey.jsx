import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Survey.css';

function Survey() {
  const navigate = useNavigate();
  
  const handleSurveyClick = () => {
    navigate('/question'); 
  };

  return (
    <div className="container survey-container">
      <h2 className="survey-subtitle">Please answer some questions about yourself...</h2>
      <button className="survey-button" onClick={handleSurveyClick}>Proceed</button>
    </div>
  );
}

export default Survey;
