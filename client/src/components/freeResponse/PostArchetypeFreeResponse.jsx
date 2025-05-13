import React, { useState } from 'react';
import './PostGameFreeResponse.css';
import { useNavigate } from 'react-router-dom';

function PostArchetypeFreeResponse() {

    const [response, setResponse] = useState("");
    const [showError, setShowError] = useState(false);
    const userId = sessionStorage.getItem('userId');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setResponse(e.target.value);
        setShowError(false);
    };    

    const handleSubmit = async () => {
        if (!response) {
          setShowError(true);
          return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/postarchetypefreeresponse`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId,
                response
              }),
            });
    
            if (!res.ok) {
              throw new Error('Failed to save responses');
            }
    
            console.log('Post Archetype responses saved successfully');
            navigate('/debrief');
    
          } catch (error) {
            console.error('Error saving responses:', error);
          }
          setShowError(false);
    }

    return (
        <div className="container survey-question">
          <div className={`free-play-disclaimer ${sessionStorage.getItem('isResearchMode') === "true" ? 'hide' : 'show'}`}> 
            <p>FREE PLAY Active. Your data is not being recorded.</p>
          </div>
    
          <div className="question-container">
            <h2 className="fr-question-subtitle">
                Now that you have learned about the chatbot that you played against, did you see the described qualities while playing and making decisions with the chatbot? Please explain.
            </h2>
            <textarea
              className="text-input"
              value={response}
              onChange={handleChange}
              rows={5}
              placeholder="Type your response here..."
            />
            {showError && <p className="error-message">Please enter a response before proceeding.</p>}
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      );
}

export default PostArchetypeFreeResponse;