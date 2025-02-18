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

    const handleClick = async () => {
      if (!freeResponse) { 
        setShowError(true);
        return;
      }
      const userId = sessionStorage.getItem('userId'); // Get userId from sessionStorage

      // Update the existing entry in the database
      await fetch(`https://human-ai-9bp5.onrender.com/api/prior-experience-ai`, {
        method: 'PUT', // Changed from POST to PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, freeResponse }), // Removed selectedOption if not needed
      });

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