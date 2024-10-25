import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Survey from './components/survey/Survey';
import Question from './components/questions/Question';
import Tutorial from './components/tutorial/Tutorial';
import GameTutorial from './components/gametutorial/GameTutorial';
import ChatbotTutorial from './components/chatbotTutorial/ChatbotTutorial';
import DemoChat from './components/chatbotTutorial/DemoChat';
import Chatbot from './components/chatbot/Chatbot';
import Game from './components/game/Game';

function App() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/survey'); 
  };

  return (
    <div className="container">
      <h1 className="welcome">Welcome</h1>
      <h2 className="subtitle">to the Prisoner's Dilemma Game</h2>
      <button className="play-button" onClick={handlePlayClick}>Play</button>
    </div>
  );
}

function RootApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/survey" element={<Survey />} /> {/* Route for the game page */}
        <Route path="/question" element={<Question />} /> {/* Route for Question page */}
        <Route path="/tutorial" element={<Tutorial />} /> {/* Route for Tutorial page */}
        <Route path="/game-tutorial" element={<GameTutorial />} /> {/* Route for GameTutorial page */}
        <Route path="/chatbot-tutorial" element={<ChatbotTutorial />} /> {/* Route for ChatbotTutorial page */}
        <Route path="/demo-chat" element={<DemoChat />} /> {/* Route for ChatbotDemo page */}
        <Route path="/chatbot" element={<Chatbot />} /> {/* Route for Chatbot page */}
        <Route path="/game" element={<Game />} /> {/* Route for Game page */}
      </Routes>
    </Router>
  );
}

export default RootApp;
