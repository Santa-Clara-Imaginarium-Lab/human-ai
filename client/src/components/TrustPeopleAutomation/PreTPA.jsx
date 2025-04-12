import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { options, optionValueMap } from '../../constants/surveyOptions';

const statements = [
  "AI systems are deceptive",
  "AI-systems behave in underhanded manners",
  "I am suspicious of AI-system's intents, actions, or outputs",
  "I am wary of AI systems",
  "The actions of AI systems will have harmful or injurious outcomes"
];

function PreTPA() {
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
    const userId = sessionStorage.getItem('userId'); // Assuming userId is stored in sessionStorage
    const data = {
      userId,
      responses: Object.entries(responses).map(([questionNumber, selectedOption]) => ({
        questionNumber: parseInt(questionNumber) + 1, // Convert to 1-based index
        selectedOption: optionValueMap[selectedOption],
      })),
    };

    try {
      const response = await fetch(`https://human-ai.up.railway.app/api/trustpeopleautomation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save responses');
      }

      console.log("Trust between People and Automation responses saved successfully");
      navigate('/pre-tpa2'); // Navigate after successful submission
    } catch (error) {
      console.error('Error saving Trust between People and Automation responses:', error);
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

export default PreTPA;
