import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { options, optionValueMap } from '../../constants/surveyOptions';

const statements = [
  "AI is efficient in that it works very quickly.",
  "AI can perform a task better than a novice human user.",
  "I like using AI for decision making.",
  "",
  ""
];

function PreTXAI2() {
  const [responses, setResponses] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleOptionChange = (statementIndex, selectedOption) => {
    setResponses({
      ...responses,
      [statementIndex]: selectedOption,
    });
  };

  const handleSubmit = async () => {
    // Count non-empty statements
    const requiredResponses = statements.filter(statement => statement !== "").length;
    if (Object.keys(responses).length < requiredResponses) {
      setError("Please select an option for each statement.");
      return;
    }
    setError('');

    // Prepare data to send
    const userId = sessionStorage.getItem('userId'); // Assuming userId is stored in sessionStorage
    const data = {
        userId,
        responses: Object.entries(responses).map(([statementIndex, selectedOption]) => ({
            questionNumber: parseInt(statementIndex) + 5, // Convert to 1-based index
            selectedOption, // This should be a string
        })),
    };

    console.log("Data being sent:", data); // Log the data being sent

    try {
        const response = await fetch(`https://human-ai.up.railway.app/api/trustscaleexplainableai`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorResponse = await response.json(); // Get error response
            throw new Error(`Failed to save responses: ${errorResponse.error}`);
        }

        console.log("Trust Scale for Explainable AI Responses saved successfully");
        navigate('/pre-tpa'); // Navigate after successful submission
    } catch (error) {
        console.error('Error saving Trust Scale for Explainable AI responses:', error);
        setError("Failed to save responses. Please try again.");
    }    
  };

  return (
    <div className="container tutorial-container">
    <div className="qualtrix-container">
      
      <p className="description">
        Please indicate the extent to which you agree or disagree with the following statements.
      </p>
      <div className="qualtrix-grid">
        <div className="qualtrix-grid-header">
          <div className="header-empty"></div>
          {options.map((option, index) => (
            <div key={index} className="option-header">
              {option}
            </div>
          ))}
        </div>
        {statements.map((statement, statementIndex) => (
          <div key={statementIndex} className="qualtrix-row">
            <div className="statement">{statement}</div>
            {options.map((option, optionIndex) => (
              <label key={optionIndex} className="circle-container">
                <input
                  type="radio"
                  name={`statement-${statementIndex}`}
                  value={option}
                  checked={responses[statementIndex] === option}
                  onChange={() => handleOptionChange(statementIndex, option)}
                />
                <span className={`circle ${statement === "" ? 'hidden' : ''}`}></span>
              </label>
            ))}
          </div>
        ))}
      </div>
      {error && <div className="error-message">{error}</div>}
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
    </div>
  );
}

export default PreTXAI2;
