import React, { useState, useEffect } from 'react';
import './Chatbot.css'; // Create a corresponding CSS file
import ChatPage from './ChatPage';

function Chatbot() {
  const [input, setInput] = useState(''); // User input
  const [aiMessage, setAiMessage] = useState(''); // AI message
  const [isTyping, setIsTyping] = useState(true); // AI typing indicator
  const [userMessage, setUserMessage] = useState(null); // User message after send

  // Simulate AI typing animation
  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setAiMessage('How can I assist you today?'); // AI's first message
      setIsTyping(false); // Stop typing animation
    }, 2000); // 2-second delay to simulate typing

    return () => clearTimeout(typingTimer); // Cleanup timer on component unmount
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    setUserMessage(input); // Set the user message
    setInput(''); // Clear input field after sending
  };

  return (
    <div className="chatbot-container">
        <ChatPage/>
    </div>
  );
}

export default Chatbot;
