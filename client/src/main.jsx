import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProvider } from './context/UserContext';

// First project imports
import DashboardPage from './routes/dashboardPage/DashboardPage.jsx'
import ChatPage from './routes/chatPage/ChatPage.jsx'
import RootLayout from './layouts/rootLayout/RootLayout.jsx'
import DashboardLayout from './layouts/dashboardLayout/dashoardLayout.jsx'

// Second project imports
import Welcome from './components/welcome/Welcome.jsx'
import Survey from './components/survey/Survey.jsx'
import Question from './components/questions/Question.jsx'
import Tutorial from './components/tutorial/Tutorial.jsx'
import GameTutorial from './components/gametutorial/GameTutorial.jsx'
import ChatbotTutorial from './components/chatbotTutorial/ChatbotTutorial.jsx'
import DemoChat from './components/chatbotTutorial/DemoChat.jsx'
import Game from './components/game/Game.jsx'
import Login from './components/login/Login.jsx'
import Brief from './components/brief/Brief.jsx'
import ConsentForm from './components/consentForm/ConsentForm.jsx'
import AiPretest from './components/aiPretest/AiPretest.jsx'
import AiLiteracy_Qualtrix from './components/aiPretest/AiLiteracy.jsx'
import AiPretestFollowUp from './components/aiPretest/AiPretestFollowUp.jsx';
import PersonalityQuestions from './components/personalityQuestions/PersonalityQuestions.jsx'
import DemographicQuestions from './components/demographicQuestions/DemographicQuestions.jsx'
import Pregame from './components/pregame/Pregame.jsx'
import Qualtrix from './components/questions/Qualtrix.jsx'
import EndScreen from './routes/endScreen/EndScreen.jsx';

function MainApp() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'black-white-theme-4-2');
  const [personality, setPersonality] = useState(localStorage.getItem('forcedPersonality') || 'random');

  useEffect(() => {
    // Apply the theme to the document
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme); // Persist theme in localStorage
  }, [theme]);

  useEffect(() => {
    // Apply personality changes
    localStorage.setItem('forcedPersonality', personality); // Persist theme in localStorage
  }, [personality]);

  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Welcome changeTheme={(newTheme) => setTheme(newTheme)} changePersonality={(newPersonality) => setPersonality(newPersonality)}/>,
        },
        {
          element: <DashboardLayout />,
          children: [
            {
              path: "/dashboard",
              element: <DashboardPage />,
            },
            {
              path: "/dashboard/chats/:id",
              element: <ChatPage />,
            },
          ],
        },
        {
          path: "/login",
          element: <Login changeTheme={(newTheme) => setTheme(newTheme)} changePersonality={(newPersonality) => setPersonality(newPersonality)}/>,
        },
        {
          path: "/brief",
          element: <Brief />,
        },
        {
          path: "/consent-form",
          element: <ConsentForm />,
        },
        {
          path: "/ai-pretest",
          element: <AiPretest />,
        },
        {
          path: "/ai-pretest-follow-up",
          element: <AiPretestFollowUp />,
        },
        {
          path: "/ai-literacy",
          element: <AiLiteracy_Qualtrix />,
        },
        {
          path: "/personality-questions",
          element: <PersonalityQuestions />,
        },
        {
          path: "/demographic-questions",
          element: <DemographicQuestions />,
        },
        {
          path: "/pregame",
          element: <Pregame />,
        },
        {
          path: "/survey",
          element: <Survey />,
        },
        {
          path: "/question",
          element: <Question />,
        },
        {
          path: "/qualtrix", // New route for the Qualtrix page
          element: <Qualtrix />,
        },
        
        {
          path: "/tutorial",
          element: <Tutorial />,
        },
        {
          path: "/game-tutorial",
          element: <GameTutorial />,
        },
        {
          path: "/chatbot-tutorial",
          element: <ChatbotTutorial />,
        },
        {
          path: "/demo-chat",
          element: <DemoChat />,
        },
        {
          path: "/game",
          element: <Game />,
        },
        {
          path: "/end-screen",
          element: <EndScreen />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <MainApp/>
    </UserProvider>
  </React.StrictMode>
);