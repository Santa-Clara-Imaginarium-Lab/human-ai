import React from 'react';
import './ChatbotTutorial.css'; // Make sure to create this CSS file for styling
import { useNavigate } from 'react-router-dom';

function ChatbotTutorial() {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/demo-chat'); // Navigate to the GameTutorial page
    };

    return (
    <div className="container chatbot-tutorial">
      <div className='tutorial-shadow-container '>
      <h2 className="chatbot-subtitle">Familiarize yourself with the chatbot interface.</h2>
      <button className="start-chat-button" onClick={handleClick}>Proceed</button>
      </div>
    </div>
    );
}

export default ChatbotTutorial;
