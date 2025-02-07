import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Survey.css';

function Survey() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userId = localStorage.getItem('userId');
  const submitAttempted = useRef(false);

  useEffect(() => {
    const gameLog1Info = JSON.parse(sessionStorage.getItem('gameLog1'));
    const currentPersonality = sessionStorage.getItem('personality');

    // Log retrieved data
    console.log('Retrieved from sessionStorage:', {
        gameLog1: gameLog1Info,
        personality: currentPersonality,
        userId: userId
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
                user_id: userId, // Use actual user ID from localStorage
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
  }, [userId, isSubmitted]);

  const handleSurveyClick = () => {
    navigate('/question'); 
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
    <div className="container survey-container">
        <div id="bt" className="brief-transitioner">
            <h1 id="btt" className="brief-transitioner-text"> Post-Game Survey </h1>
            <div id="btu" className="brief-transitioner-underline"/>
        </div>
      <div className="survey-shadow-container">
      <h2 className="survey-subtitle">Please reflect on the chatbot you just finished interacting with.</h2>
      </div>
      <button className="survey-button" onClick={handleSurveyClick}>Proceed</button>
    </div>
  );
}

export default Survey;
