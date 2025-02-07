import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const statements = [
  "AI is efficient in that it works very quickly.",
  "AI can perform a task better than a novice human user.",
  "I like using AI for decision making."
];

const options = [
  "I agree strongly",
  "I agree somewhat",
  "I'm neutral about it",
  "I disagree somewhat",
  "I disagree strongly",
  "I do not use AI",
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
    if (Object.keys(responses).length < statements.length) {
      setError("Please select an option for each statement.");
      return;
    }
    setError('');

    // Prepare data to send
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
    const data = {
        userId,
        responses: Object.entries(responses).map(([statementIndex, selectedOption]) => ({
            questionNumber: parseInt(statementIndex) + 5, // Convert to 1-based index
            selectedOption, // This should be a string
        })),
    };

    console.log("Data being sent:", data); // Log the data being sent

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trustscaleexplainableai`, {
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
      <h1 className="title">Trust Scale for Explainable AI Survey</h1>
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
                <span className="circle"></span>
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
