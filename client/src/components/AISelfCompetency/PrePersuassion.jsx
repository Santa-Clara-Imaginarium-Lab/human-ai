import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const statements = [
  "I don't let AI influence me in my everyday decisions.",
  "I can prevent an AI from influencing me in my everyday decisions.",
  "I realize if an AI is influencing me in my everyday decisions.",
];

const options = [
  "I agree strongly",
  "I agree somewhat",
  "I'm neutral about it",
  "I disagree somewhat",
  "I disagree strongly",
  "I do not use AI",
];

function PrePersuassion() {
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
      responses: Object.entries(responses).map(([questionNumber, selectedOption]) => ({
        questionNumber: parseInt(questionNumber) + 1, // Convert to 1-based index
        selectedOption,
      })),
    };  

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/aiselfcompetency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save responses');
      }

      console.log("AI Self Competency responses saved successfully");
      navigate('/pre-txai'); // Navigate after successful submission
    } catch (error) {
      console.error('Error saving AI Self Competency responses:', error);
      setError("Failed to save responses. Please try again.");
    }
  };

  return (
    <div className="container tutorial-container">
    <div className="qualtrix-container">
      <h1 className="title">AI Self Competency Survey</h1>
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

export default PrePersuassion;
