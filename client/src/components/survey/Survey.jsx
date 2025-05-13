import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Survey.css';
import Typewriter from '../Typewriter/typewriter';

function Survey() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isIntentSubmitted, setIsIntentSubmitted] = useState(false);
  const userId = sessionStorage.getItem('userId');
  const submitAttempted = useRef(false);
  const intentSubmitAttempted = useRef(false);

  const [briefGo, setBriefGo] = useState(false);
  const [btuGo, setBtuGo] = useState(false);

  useEffect(() => {
    const gameLog1Info = JSON.parse(sessionStorage.getItem('gameLog1'));
    const currentPersonality = sessionStorage.getItem('personality');
    const roundsData = JSON.parse(sessionStorage.getItem('roundsData') || '[]');

    // Log retrieved data
    console.log('Retrieved from sessionStorage:', {
        gameLog1: gameLog1Info,
        personality: currentPersonality,
        userId: userId,
        roundsData: roundsData
    });

    // Send game logs to MongoDB
    const saveGameLogs = async () => {
        if (submitAttempted.current || isSubmitted) return;
        submitAttempted.current = true;
        
        try {
            // Format data according to schema
            const rounds = gameLog1Info.data.map((round, index) => ({
                round_number: index + 1,
                user_score: round[`Round${index + 1}`].You,
                ai_score: round[`Round${index + 1}`].AI
            }));

            const gameScoreData = {
                user_id: userId, // Use actual user ID from sessionStorage
                personality: currentPersonality,
                rounds: rounds
            };

            console.log('Attempting to save to MongoDB:', gameScoreData);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gamescores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameScoreData)
            });

            if (!response.ok) {
                submitAttempted.current = false;
                throw new Error('Failed to save game logs');
            }

            console.log('Successfully saved to MongoDB');
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error saving game logs:', error);
            submitAttempted.current = false;
        }
    };

    // Send intent data to server
    const saveIntentData = async () => {
        if (intentSubmitAttempted.current || isIntentSubmitted || !roundsData.length) return;
        intentSubmitAttempted.current = true;
        
        try {
            const intentData = {
                userId: userId,
                personality: currentPersonality,
                rounds: roundsData
            };

            console.log('Attempting to save intent data:', intentData);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(intentData)
            });

            if (!response.ok) {
                intentSubmitAttempted.current = false;
                throw new Error('Failed to save intent data');
            }

            console.log('Successfully saved intent data');
            setIsIntentSubmitted(true);
        } catch (error) {
            console.error('Error saving intent data:', error);
            intentSubmitAttempted.current = false;
        }
    };

    if (gameLog1Info && userId && !isSubmitted && !submitAttempted.current) {
        console.log('Conditions met, calling saveGameLogs()');
        saveGameLogs();
    } else {
        console.log('Missing required data or already submitted:', {
            hasGameLog1: !!gameLog1Info,
            hasUserId: !!userId,
            isSubmitted: isSubmitted,
            submitAttempted: submitAttempted.current
        });
    }

    if (roundsData.length && userId && !isIntentSubmitted && !intentSubmitAttempted.current) {
        console.log('Conditions met for intent data, calling saveIntentData()');
        saveIntentData();
    } else {
        console.log('Missing required intent data or already submitted:', {
            hasRoundsData: !!roundsData.length,
            hasUserId: !!userId,
            isIntentSubmitted: isIntentSubmitted,
            intentSubmitAttempted: intentSubmitAttempted.current
        });
    }
  }, [userId, isSubmitted, isIntentSubmitted]);

  const handleSurveyClick = () => {
    navigate('/question'); 
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
    <div className="container survey-container">
        <div className={`brief-transitioner ${briefGo ? 'brief-go' : ''}`}>
            <h1 className="brief-transitioner-text"> Post-Game Survey </h1>
            <div className={`brief-transitioner-underline ${btuGo ? 'brief-underline-go' : ''}`}/>
        </div>
      <div className="survey-shadow-container">
      <h2 className="survey-subtitle">
        Please reflect on the chatbot you just finished interacting with.{ /* <Typewriter text={"Please reflect on the chatbot you just finished interacting with."} speed={30} delay={2000}/> */}
      </h2>
      </div>
      <button className="survey-button" onClick={handleSurveyClick}>Proceed</button>
    </div>
  );
}

export default Survey;
