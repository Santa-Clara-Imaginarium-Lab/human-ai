import React, { useState } from 'react';
import './Question.css';
import questions from './constants'; // Import the questions from the constants file
import { useNavigate } from 'react-router-dom';

function Question() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Manage the current question index
  const [selectedOption, setSelectedOption] = useState(''); // Store the selected option
  const [showError, setShowError] = useState(false); // To show error if no option is selected

  const navigate = useNavigate();

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setShowError(false); // Hide error message if an option is selected
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      setShowError(true); // Show error if no option is selected
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to next question
      setSelectedOption(''); // Reset selected option for new question
      setShowError(false); // Reset error for next question
    } else {
        navigate('/tutorial');
    }
  };

  return (
    <div className="container">
      <button className="question-button">
        {currentQuestionIndex + 1}/{questions.length} {/* Display the question number */}
      </button>
      <h2 className="question-subtitle">{questions[currentQuestionIndex]}</h2> {/* Display the current question */}
      <div className="options-container">
        <label className="option">
          <input
            type="radio"
            name="question"
            value="Strongly Disagree"
            checked={selectedOption === 'Strongly Disagree'}
            onChange={handleOptionChange}
          />
          <span className="circle"></span>
          <p>Strongly Disagree</p>
        </label>
        <label className="option">
          <input
            type="radio"
            name="question"
            value="Somewhat Disagree"
            checked={selectedOption === 'Somewhat Disagree'}
            onChange={handleOptionChange}
          />
          <span className="circle"></span>
          <p>Somewhat Disagree</p>
        </label>
        <label className="option">
          <input
            type="radio"
            name="question"
            value="Neutral"
            checked={selectedOption === 'Neutral'}
            onChange={handleOptionChange}
          />
          <span className="circle"></span>
          <p>Neutral</p>
        </label>
        <label className="option">
          <input
            type="radio"
            name="question"
            value="Somewhat Agree"
            checked={selectedOption === 'Somewhat Agree'}
            onChange={handleOptionChange}
          />
          <span className="circle"></span>
          <p>Somewhat Agree</p>
        </label>
        <label className="option">
          <input
            type="radio"
            name="question"
            value="Strongly Agree"
            checked={selectedOption === 'Strongly Agree'}
            onChange={handleOptionChange}
          />
          <span className="circle"></span>
          <p>Strongly Agree</p>
        </label>
      </div>

      {showError && <p className="error-message">Please select an option before proceeding.</p>} {/* Show error if no option selected */}
      
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default Question;
