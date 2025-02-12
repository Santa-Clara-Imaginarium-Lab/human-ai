import React, { useState } from 'react';
import './Question.css';
import questions from './constants'; // Import the questions from the constants file
import { useNavigate } from 'react-router-dom';

function Question() {
  const [responses, setResponses] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showError, setShowError] = useState(false);
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setShowError(false); // Hide error message if an option is selected
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      setShowError(true);
      return;
    }

    // Add current response to responses array
    const newResponse = {
      questionNumber: currentQuestionIndex + 1,
      selectedOption
    };
    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    if (currentQuestionIndex === questions.length - 1) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/surveyresponses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            responses: updatedResponses
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save responses');
        }

        console.log('Survey responses saved successfully');
        navigate('/end-screen'); // Simply navigate to end screen after all questions
        
      } catch (error) {
        console.error('Error saving responses:', error);
      }
    } else {
      // Move to next question if not the last one
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
      setShowError(false);
    }
  };

  return (
    <div className="container survey-question">
      <div className="question-container">

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
    </div>
  );
}

export default Question;
