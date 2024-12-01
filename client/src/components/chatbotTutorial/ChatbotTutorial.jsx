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
      <h2 className="chatbot-subtitle">Now, try having a conversation with the chatbot you will be playing the Prisoner's Dilemma against!</h2>
      <button className="start-chat-button" onClick={handleClick}>Proceed</button>
    </div>
    );
}

export default ChatbotTutorial;
