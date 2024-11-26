import React, { useState, useEffect } from 'react';
import './DemoChat.css'; // Create a corresponding CSS file
import {useNavigate } from 'react-router-dom';

function DemoChat() {
  const [tooltipIndex, setTooltipIndex] = useState(-1); // Index of tooltip array

  const navigate = useNavigate();

  const tooltips = [
    "This is the AI's response", 
    "This is your input message", 
    "Send your input", 
    "Exit Tutorial"
  ];

  useEffect(() => { // Navigate to dashboard after last tooltip
    if (tooltipIndex >= tooltips.length) {
      navigate('/dashboard');
    }
  }, [tooltipIndex]);

  useEffect(() => {
    const handleKeyDown = () => {
      setTooltipIndex((prevIndex) => prevIndex + 1);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
            <div className="bubble" data-tooltip={tooltipIndex === 0 ? tooltips[0] : null}>Chatbot responses here</div>
          </div>

          {/* User Response */}
          <div className="chat-bubble user-response">
            <div className="bubble" data-tooltip={tooltipIndex === 1 ? tooltips[1] : null}>Participant responses here</div>
            <div className="avatar">You</div>
          </div>
        </div>

        <div className="chat-tutorial-instruction">
          <p>Press any key to continue</p>
        </div>

        {/* Input Area */}
        <div className="input-area">
          <input
            type="text"
            placeholder="Enter message"
            className="chat-input"
            disabled
          />
          <button className="send-button" data-tooltip={tooltipIndex === 2 ? tooltips[2] : null} disabled>Send</button>
          <button className="send-button" data-tooltip={tooltipIndex === 3 ? tooltips[3] : null} disabled>Exit</button>
        </div>
      </div>
    </div>
  );
}

export default DemoChat;
