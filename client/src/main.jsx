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
import Qualtrix from './components/questions/Qualtrix.jsx'

function MainApp() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'yellow-blue-theme');

  useEffect(() => {
    // Apply the theme to the document
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme); // Persist theme in localStorage
  }, [theme]);

  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Welcome/>,
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
          element: <Login changeTheme={(newTheme) => setTheme(newTheme)}/>,
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