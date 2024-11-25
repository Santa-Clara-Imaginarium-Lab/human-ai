import React, { useState } from 'react';
import './DemoChat.css'; // Create a corresponding CSS file
import {useNavigate } from 'react-router-dom';

function DemoChat() {
  const [input, setInput] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    alert('Message Sent: ' + input); // Dummy action for now
    setInput(''); // Clear input field after sending
  };

  const handleExit = () => {
    navigate('/dashboard'); 
  };

  return (
    <div className="chat-tutorial-page-container">
      <div className="demo-chat-container">
        <div className="chatbot-button">
          <div className="chatbot-shadow-button"></div>
          <h2 className="chatbot-button-text">Chatbot Tutorial</h2>
        </div>
        
        <div className="chat-section">
          {/* AI Response */}
          <div className="chat-bubble ai-response">
            <div className="avatar">AI</div>
            <div className="bubble" data-tooltip="This is the AI's response">Chatbot responses here</div>
          </div>

          {/* User Response */}
          <div className="chat-bubble user-response">
            <div className="bubble" data-tooltip="This is your input message">Participant responses here</div>
            <div className="avatar">You</div>
          </div>
        </div>

        {/* Input Area */}
        <div className="input-area">
          <input
            type="text"
            placeholder="Enter message"
            value={input}
            onChange={handleInputChange}
            className="chat-input"
          />
          <button onClick={handleSend} className="send-button" data-tooltip="Send your input">Send</button>
          <button onClick={handleExit} className="send-button" data-tooltip="Exit Tutorial">Exit</button>
        </div>
      </div>
    </div>
  );
}

export default DemoChat;
