import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { options, optionValueMap } from '../../constants/surveyOptions';

const statements = [
  "I don't let AI influence me in my everyday decisions.",
  "I can prevent an AI from influencing me in my everyday decisions.",
  "I realize if an AI is influencing me in my everyday decisions.",
  "",
  ""
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
      responses: Object.entries(responses)
      .filter(([index]) => statements[index] !== "") // Only include responses for non-empty statements
      .map(([questionNumber, selectedOption]) => ({
        questionNumber: parseInt(questionNumber) + 1, // Convert to 1-based index
        selectedOption,
      })),
    };  

    try {
      const response = await fetch(`https://human-ai.up.railway.app/api/aiselfcompetency`, {
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

export default PrePersuassion;
