import React, { useState, useEffect } from 'react';
import './DemoChat.css'; // Create a corresponding CSS file
import {useNavigate } from 'react-router-dom';

function DemoChat() {
  const [canClick, setCanClick] = useState(true);
  const [tooltipIndex, setTooltipIndex] = useState(0); // Index of tooltip array

  const navigate = useNavigate();

  const tooltips = [
    "This is one of the AI's responses", 
    "This is one of your messages", 
    "Send message (or press ENTER)", 
    "Start the decision phase"
  ];

  useEffect(() => { // Navigate to dashboard after last tooltip
    if (tooltipIndex >= tooltips.length) {
      navigate('/game-tutorial');
    }
  }, [tooltipIndex]);

  const WAIT_TIME = 1500;

  const handleKeyDown = (event) => {
    if (!(event.key === ' ')) return;
    if (canClick) {
        // doesn't update in time!
        console.log("prior Index:", tooltipIndex);

        // let reEnableClick = true;

        setCanClick(false);
        setTooltipIndex((prevIndex) => prevIndex + 1);
        console.log(canClick);

        setTimeout(() => {
          console.log("pre", canClick);
          console.log("fire");
          setCanClick(true);
          console.log("post", canClick);
        }, WAIT_TIME)
      }
    else {
      console.warn("can't click");
    }
  };


  useEffect(() => {

    document.addEventListener('keydown', handleKeyDown);
    // document.addEventListener('click', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // document.removeEventListener('click', handleKeyDown);
    };
  });
  // [!] DO NOT PUT A DEPENDENCY ARRAY IN THIS USEEFFECT [!]
  // [!] IT WILL BREAK THE FUNCTION! [!]  

  
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

        <h className={canClick ? 'instruction-can' : 'instruction-wait'}>{canClick ? 'Press SPACEBAR to continue' : '. . .'}</h>

        {/* Input Area */}
        <div className="input-area">
          <input
            type="text"
            placeholder="Enter message"
            disabled
            className="chat-input"
          />
          <button className={`send-button ${(tooltipIndex === 2 ? ' show' : '')}`} data-tooltip={tooltipIndex === 2 ? tooltips[2] : null} disabled>Send</button>
          <button className={`send-button ${(tooltipIndex === 3 ? ' show' : '')}`} data-tooltip={tooltipIndex === 3 ? tooltips[3] : null} disabled>Go to Game</button>
        </div>
      </div>
    </div>
  );
}

export default DemoChat;
