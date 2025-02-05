import React, { useState } from 'react';
import './AiPretest.css'; 
import { useNavigate } from 'react-router-dom';

function AiPretest() {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('');
    const [showError, setShowError] = useState(false);

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
      setShowError(false); // Hide error message if an option is selected
    };

    const handleClick = () => {
      if (!selectedOption) {
        setShowError(true);
        return;
      }
      if (selectedOption === "Yes") {
        navigate('/ai-pretest-follow-up'); // Navigate to AiPretestFollowUp if "Yes" is selected
      } else {
        navigate('/personality-questions'); // Navigate to personality questions for "No"
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

export default AiPretest;