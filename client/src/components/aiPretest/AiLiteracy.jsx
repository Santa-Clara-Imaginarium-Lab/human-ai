import React, { useState } from 'react';
import './AiLiteracy.css';

const statements = [
  "I can operate AI applications in everyday life.",
  "I can use AI applications to make my everyday life easier.",
  "I can use artificial intelligence meaningfully to achieve my everyday goals.",
  "In everyday life, I can interact with AI in a way that makes my tasks easier.",
];

const options = [
  "I agree strongly",
  "I agree somewhat",
  "I'm neutral about it",
  "I disagree somewhat",
  "I disagree strongly",
  "I do not use AI",
];

function AiLiteracy_Qualtrix() {
  const [responses, setResponses] = useState({});

  const handleOptionChange = (statementIndex, selectedOption) => {
    setResponses({
      ...responses,
      [statementIndex]: selectedOption,
    });
  };

  const handleSubmit = () => {
    console.log("Survey Responses:", responses);
    // Add any additional handling, like API submission
  };

  return (
    <div className="qualtrix-container">
      <h1 className="title">AI Usage Survey</h1>
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
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default AiLiteracy_Qualtrix;
