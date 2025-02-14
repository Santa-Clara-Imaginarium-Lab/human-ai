import React, { useState } from 'react';
import './PreHumanAI.css'; 
import { useNavigate } from 'react-router-dom';

function PreHumanAI1() {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('');
    const [showError, setShowError] = useState(false);

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
      setShowError(false); // Hide error message if an option is selected
    };

    const handleClick = async () => {
      if (!selectedOption) {
        setShowError(true);
        return;
      }
      // Save the selected option to the database
      const userId = sessionStorage.getItem('userId'); // Get userId from sessionStorage
      await fetch(`https://human-ai-9bp5.onrender.com/api/prior-experience-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, selectedOption }),
      });
      
      if (selectedOption === "Yes") {
        navigate('/pre-humanai-2'); // Corrected navigation path
      } else {
        navigate('/pre-apply'); // Navigate to personality questions for "No"
      }
    };

    return (
        <div className="container tutorial-container">
          <div className='survey-shadow-container'>
          <h2 className="brief-subtitle">Have you ever used a generative-AI (artificial intelligence) tool before (e.g.: ChatGPT, GitHub Copilot, DALL·E, etc.)?</h2>
          <div className="brief-options">
            <label className="option">
              <input
                type="radio"
                value="Yes"
                checked={selectedOption === "Yes"}
                onChange={handleOptionChange}
              />
              <span className="circle"></span>
              <p>Yes</p>
            </label>
            <label className="option">
              <input
                type="radio"
                value="No"
                checked={selectedOption === "No"}
                onChange={handleOptionChange}
              />
              <span className="circle"></span>
              <p>No</p>
            </label>
          </div>
          {showError && <p className="error-message">Please select an option before proceeding.</p>}
          <button className="submit-button" onClick={handleClick}>Submit</button>
          </div>
        </div>
      );
}

export default PreHumanAI1;