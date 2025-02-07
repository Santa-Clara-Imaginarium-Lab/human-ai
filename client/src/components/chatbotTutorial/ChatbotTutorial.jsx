import { React, useEffect } from 'react';
import './ChatbotTutorial.css'; // Make sure to create this CSS file for styling
import { useNavigate } from 'react-router-dom';

function ChatbotTutorial() {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/demo-chat'); // Navigate to the GameTutorial page
    };

    useEffect(() => {
      setTimeout(() => {
        document.getElementById("btu").classList.add("brief-underline-go");
      }, 500)
      setTimeout(() => {
        document.getElementById("bt").classList.add("brief-go");
        document.getElementById("btt").classList.add("brief-txt");
        document.getElementById("btu").classList.add("brief-underline-hide");
      }, 2000)
    }, );

    return (
    <div className="container chatbot-tutorial">
      <div id="bt" className="brief-transitioner">
        <h1 id="btt" className="brief-transitioner-text"> Chatbot Tutorial </h1>
        <div id="btu" className="brief-transitioner-underline"/>
      </div>
      <div className='tutorial-shadow-container '>
      <h2 className="chatbot-subtitle">Familiarize yourself with the chatbot interface.</h2>
      <button className="start-chat-button" onClick={handleClick}>Proceed</button>
      </div>
    </div>
    );
}

export default ChatbotTutorial;
