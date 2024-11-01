import React from 'react';
import './ChatbotTutorial.css'; // Make sure to create this CSS file for styling
import { useNavigate } from 'react-router-dom';

function ChatbotTutorial() {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/demo-chat'); // Navigate to the GameTutorial page
    };

    return (
    <div className="container">
      <button className="top-button">Tutorial</button>
      <h2 className="chatbot-subtitle">Now, Try Having a Conversation with the Chatbot</h2>
      <button className="start-chat-button" onClick={handleClick}>Proceed</button>
    </div>
    );
}

export default ChatbotTutorial;
