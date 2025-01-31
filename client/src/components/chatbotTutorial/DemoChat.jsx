import React, { useState, useEffect } from 'react';
import './DemoChat.css'; // Create a corresponding CSS file
import {useNavigate } from 'react-router-dom';

function DemoChat() {
  const [tooltipIndex, setTooltipIndex] = useState(-1); // Index of tooltip array

  const navigate = useNavigate();

  const tooltips = [
    "This is one of the AI's responses", 
    "This is one of your messages", 
    "Send message", 
    "Start the decision phase"
  ];

  useEffect(() => { // Navigate to dashboard after last tooltip
    if (tooltipIndex >= tooltips.length) {
      navigate('/pregame');
    }
  }, [tooltipIndex]);

  useEffect(() => {
    const handleKeyDown = () => {
      setTooltipIndex((prevIndex) => prevIndex + 1);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleKeyDown);
    };
  }, []);

  return (
    <div className="chat-tutorial-page-container">
      <div className="demo-chat-container">
        <button className="chatbot-button">
          Chatbot Tutorial
        </button>
        
        <div className="chat-section">
          {/* AI Response */}
          <div className="chat-bubble ai-response">
            <div className="avatar">AI</div>
            <div className={`bubble ${(tooltipIndex === 0 ? ' show' : '')}`} data-tooltip={tooltipIndex === 0 ? tooltips[0] : null}>Chatbot responses here</div>
          </div>

          {/* User Response */}
          <div className="chat-bubble user-response">
            <div className={`bubble ${(tooltipIndex === 1 ? ' show' : '')}`} data-tooltip={tooltipIndex === 1 ? tooltips[1] : null}>Participant responses here</div>
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
          <button className={`send-button ${(tooltipIndex === 2 ? ' show' : '')}`} data-tooltip={tooltipIndex === 2 ? tooltips[2] : null} disabled>Send</button>
          <button className={`send-button ${(tooltipIndex === 3 ? ' show' : '')}`} data-tooltip={tooltipIndex === 3 ? tooltips[3] : null} disabled>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default DemoChat;
