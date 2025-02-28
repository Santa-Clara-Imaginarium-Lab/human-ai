import { React, useState, useEffect } from 'react';
import './ChatbotTutorial.css'; // Make sure to create this CSS file for styling
import { useNavigate, useLocation } from 'react-router-dom';

function ChatbotTutorial() {
    const navigate = useNavigate();

      const location = useLocation();
      const speedFlag = location.state.speedFlag;
      const userScore = location.state.userScore;
      const aiScore = location.state.aiScore;

    const [briefGo, setBriefGo] = useState(false);
    const [btuGo, setBtuGo] = useState(false);

    const handleClick = () => {
      navigate('/demo-chat', { state: { speedFlag: true, userScore, aiScore } }); // Navigate to the GameTutorial page
    };

    useEffect(() => {
      setTimeout(() => {
        setBtuGo(true); // Show the underline
      }, 500)
      setTimeout(() => {
        setBriefGo(true); // Hide the brief transitioner
        // document.getElementById("btt").classList.add("brief-txt");
        // document.getElementById("btu").classList.add("brief-underline-hide");
      }, 2000)
    }, []);

    return (
    <div className="container chatbot-tutorial">
      <div className={`brief-transitioner ${briefGo ? 'brief-go' : ''}`}>
        <h1 className="brief-transitioner-text"> Chatbot Tutorial </h1>
        <div className={`brief-transitioner-underline ${btuGo ? 'brief-underline-go' : ''}`}/>
      </div>
      <div className='tutorial-shadow-container '>
      <h2 className="chatbot-subtitle">Familiarize yourself with the chatbot interface.</h2>
      <button className="start-chat-button" onClick={handleClick}>Proceed</button>
      </div>
    </div>
    );
}

export default ChatbotTutorial;
