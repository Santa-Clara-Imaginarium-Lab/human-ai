import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProvider } from './context/UserContext';

// First project imports
import DashboardPage from './routes/dashboardPage/DashboardPage.jsx'
import ChatPage from './routes/chatPage/ChatPage.jsx'
import RootLayout from './layouts/rootLayout/RootLayout.jsx'
import SignInPage from './routes/signInPage/SignInPage.jsx'
import SignUpPage from './routes/signUpPage/SignUpPage.jsx'
import DashboardLayout from './layouts/dashboardLayout/dashoardLayout'

// Second project imports
import Welcome from './components/welcome/Welcome'
import Survey from './components/survey/Survey'
import Question from './components/questions/Question'
import Tutorial from './components/tutorial/Tutorial'
import GameTutorial from './components/gametutorial/GameTutorial'
import ChatbotTutorial from './components/chatbotTutorial/ChatbotTutorial'
import DemoChat from './components/chatbotTutorial/DemoChat'
import Game from './components/game/Game'
import Login from './components/login/Login'
import App from './App' // Your welcome page component

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/sign-in/*",
        element: <SignInPage />,
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage />,
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
      // New routes from second project
      {
        path: "/welcome",
        element: <Welcome />,
      },
      {
        path: "/prisoners-dilemma",
        element: <App />,
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