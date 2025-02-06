import React, { useState } from 'react';
import './PreHumanAI.css'; 
import { useNavigate } from 'react-router-dom';

function PreHumanAI2() {
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);
    const [freeResponse, setFreeResponse] = useState(''); // State for free response input

    const handleFreeResponseChange = (event) => {
      setFreeResponse(event.target.value); // Update free response state
    };

    const handleClick = () => {
      if (!freeResponse) { 
        setShowError(true);
        return;
      }
      //navigate('/personality-questions');
      navigate('/pre-apply');
      
    };

    return (
        <div className="container tutorial-container">
          <div className='survey-shadow-container'>
          <h2 className="brief-subtitle">About how many times per day do you use generative AI?</h2>
          <div className="ans-textbox">
              <input 
                type="text" 
                placeholder="Type your answer here..." 
                className="userid-input"
                value={freeResponse} // Bind the input value to state
                onChange={handleFreeResponseChange} // Handle input changes
              />
          </div>
          {showError && <p className="error-message">Please provide an answer before proceeding.</p>}
          <button className="submit-button" onClick={handleClick}>Submit</button>
          </div>
        </div>
      );
}

export default PreHumanAI2;