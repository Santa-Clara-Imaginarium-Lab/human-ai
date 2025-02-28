import React, { useState } from 'react';
import './PostGameFreeResponse.css';
import questions from './PostGameFreeResponseConstants';
import { useNavigate } from 'react-router-dom';

function PostGameFreeResponse() {
  const [responses, setResponses] = useState(Array(7).fill("")); // Store responses for 7 questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = event.target.value;
    setResponses(newResponses);
    setShowError(false);
  };

  const handleSubmit = async () => {
    // Check if current response is empty
    if (!responses[currentQuestionIndex].trim()) {
      setShowError(true);
      return;
    }

    if (currentQuestionIndex === questions.length - 1) {
      // Validate all responses before final submission
      const hasEmptyResponses = responses.some(response => !response.trim());
      if (hasEmptyResponses) {
        setShowError(true);
        return;
      }

      try {
        const res = await fetch(`https://human-ai-9bp5.onrender.com/api/postgamefreeresponse`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            responses: responses.map((response, index) => ({
              questionNumber: index + 1,
              responseText: response.trim() // Ensure trimmed responses
            }))
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to save responses');
        }

        console.log('Post-game responses saved successfully');
        navigate('/end-screen');

      } catch (error) {
        console.error('Error saving responses:', error);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowError(false);
    }
  };

  return (
    <div className="container survey-question">
      <div className="question-container">
        <h2 className="fr-question-subtitle">{questions[currentQuestionIndex]}</h2>
        <textarea
          className="text-input"
          value={responses[currentQuestionIndex]}
          onChange={handleChange}
          rows={5}
          placeholder="Type your response here..."
        />
        {showError && <p className="error-message">Please enter a response before proceeding.</p>}
        <button className="submit-button" onClick={handleSubmit}>
          {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default PostGameFreeResponse;
