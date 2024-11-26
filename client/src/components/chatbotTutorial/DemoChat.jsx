import React, { useState, useEffect } from 'react';
import './DemoChat.css'; // Create a corresponding CSS file
import {useNavigate } from 'react-router-dom';

function DemoChat() {
  const [input, setInput] = useState('');
  const [tooltipIndex, setTooltipIndex] = useState(0); // Index of tooltip array

  const navigate = useNavigate();

  const tooltips = [
    "This is the AI's response", 
    "This is your input message", 
    "Send your input", 
    "Exit Tutorial"
  ];

  useEffect(() => {
    const handleKeyDown = () => {
      setTooltipIndex((prevIndex) => {
        if (prevIndex + 1 < tooltips.length) {  // Update if not the last tooltip
          return prevIndex + 1;
        }

        else {   // Go to next page if last tooltip
          navigate('/dashboard'); 
          return prevIndex;
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
            <div className="bubble" data-tooltip={tooltipIndex === 0 ? tooltips[0] : ''}>Chatbot responses here</div>
          </div>

          {/* User Response */}
          <div className="chat-bubble user-response">
            <div className="bubble" data-tooltip={tooltipIndex === 1 ? tooltips[1] : ''}>Participant responses here</div>
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
          <button onClick={handleSend} className="send-button" data-tooltip={tooltipIndex === 2 ? tooltips[2] : ''}>Send</button>
          <button onClick={handleExit} className="send-button" data-tooltip={tooltipIndex === 3 ? tooltips[3] : ''}>Exit</button>
        </div>
      </div>
    </div>
  );
}

export default DemoChat;
