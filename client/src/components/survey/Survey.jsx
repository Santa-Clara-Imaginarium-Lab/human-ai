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
      <div className="survey-shadow-container">
      <h2 className="survey-subtitle">Please reflect on the chatbot you just finished interacting with.</h2>
      </div>
      <button className="survey-button" onClick={handleSurveyClick}>Proceed</button>
    </div>
  );
}

export default Survey;
