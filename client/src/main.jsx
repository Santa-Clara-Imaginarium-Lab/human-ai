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
import BadEnding from './components/badEnding/BadEnding.jsx';

import PersonalityQuestions from './components/personalityQuestions/PersonalityQuestions.jsx'
import DemographicQuestion1 from './components/demographicQuestions/DemographicQuestion1.jsx'
import DemographicQuestion2 from './components/demographicQuestions/DemographicQuestion2.jsx';
import DemographicQuestion3 from './components/demographicQuestions/DemographicQuestion3.jsx';
import DemographicQuestion4 from './components/demographicQuestions/DemographicQuestion4.jsx';
import Pregame from './components/pregame/Pregame.jsx'
import EndScreen from './routes/endScreen/EndScreen.jsx'
import RoleModel from './components/chatbotArchetype/RoleModel.jsx'
import Average from './components/chatbotArchetype/Average.jsx'
import Control from './components/chatbotArchetype/Control.jsx'
import SelfCentered from './components/chatbotArchetype/SelfCentered.jsx'
import Reserved from './components/chatbotArchetype/Reserved.jsx'

import Debrief from './components/debrief/Debrief.jsx';
import Complete from './components/complete/Complete.jsx';

import PreApply from './components/AILiteracy/PreApply.jsx';
import PreUnderstanding from './components/AILiteracy/PreUnderstanding.jsx';
import PreEfficacy from './components/AIProblemSolving/PreEfficacy.jsx';
import PrePersuassion from './components/AISelfCompetency/PrePersuassion.jsx';
import PreTXAI from './components/TrustScaleExplainableAI/PreTXAI.jsx';
import PreTXAI2 from './components/TrustScaleExplainableAI/PreTXAI2.jsx';
import PreTPA from './components/TrustPeopleAutomation/PreTPA.jsx';
import PreTPA2 from './components/TrustPeopleAutomation/PreTPA2.jsx';
import PreSurveys from './components/priorExperienceAI/PreSurveys.jsx';
import PreHumanAI1 from './components/priorExperienceAI/PreHumanAI1.jsx';
import PreHumanAI2 from './components/priorExperienceAI/PreHumanAI2.jsx';

function MainApp() {
  const [theme, setTheme] = useState(sessionStorage.getItem('theme') || 'black-white-theme-4-2');
  const [personality, setPersonality] = useState(sessionStorage.getItem('forcedPersonality') || 'random');

  useEffect(() => {
    // Apply the theme to the document
    document.documentElement.className = theme;
    sessionStorage.setItem('theme', theme); // Persist theme in sessionStorage
  }, [theme]);

  useEffect(() => {
    // Apply personality changes
    sessionStorage.setItem('forcedPersonality', personality); // Persist theme in sessionStorage
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
          path: "/pre-surveys",
          element: <PreSurveys />,
        },
        {
          path: "/pre-humanai-1",
          element: <PreHumanAI1 />,
        },
        {
          path: "/pre-humanai-2",
          element: <PreHumanAI2 />,
        },
        {
          path: "/pre-apply",
          element: <PreApply />,
        },
        {
          path: "/pre-understanding",
          element: <PreUnderstanding />,
        },
        {
          path: "/pre-efficacy",
          element: <PreEfficacy />,
        },
        {
          path: "/pre-persuassion",
          element: <PrePersuassion />,
        },
        {
          path: "/pre-txai",
          element: <PreTXAI />,
        },
        {
          path: "/pre-txai2",
          element: <PreTXAI2 />,
        },
        {
          path: "/pre-tpa",
          element: <PreTPA />,
        },
        {
          path: "/pre-tpa2",
          element: <PreTPA2 />,
        },
        {
          path: "/personality-questions",
          element: <PersonalityQuestions />,
        },
        {
          path: "/demographic-question1",
          element: <DemographicQuestion1 />,
        },
        {
          path: "/demographic-question2",
          element: <DemographicQuestion2 />,
        },
        {
          path: "/demographic-question3",
          element: <DemographicQuestion3 />,
        },
        {
          path: "/demographic-question4",
          element: <DemographicQuestion4 />,
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
        {
          path: "/role-model",
          element: <RoleModel />,
        },
        {
          path: "/average",
          element: <Average />,
        },
        {
          path: "/control",
          element: <Control />,
        },
        {
          path: "/self-centered",
          element: <SelfCentered />,
        },
        {
          path: "/reserved",
          element: <Reserved />,
        },
        {
          path: "/debrief",
          element: <Debrief />,
        },
        {
          path: "/complete",
          element: <Complete />,
        },
        {
          path: "/badEnding",
          element: <BadEnding />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <UserProvider>
      <MainApp/>
    </UserProvider>
);