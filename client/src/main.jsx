import React from 'react'
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

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
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
        path: "/welcome",
        element: <Welcome />,
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>,
)