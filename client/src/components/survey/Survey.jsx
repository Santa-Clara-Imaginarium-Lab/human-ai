import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Survey.css';

function Survey() {
  const navigate = useNavigate();
  const [gameLogs, setGameLogs] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userId = localStorage.getItem('userId');
  const submitAttempted = useRef(false);

  useEffect(() => {
    const gameLog1Info = JSON.parse(sessionStorage.getItem('gameLog1'));
    const gameLog2Info = JSON.parse(sessionStorage.getItem('gameLog2'));
    const gameLog3Info = JSON.parse(sessionStorage.getItem('gameLog3'));
    const gameLog4Info = JSON.parse(sessionStorage.getItem('gameLog4'));
    const gameLog5Info = JSON.parse(sessionStorage.getItem('gameLog5'));
    const currentPersonality = sessionStorage.getItem('personality');

    // Log retrieved data
    console.log('Retrieved from sessionStorage:', {
        gameLog1: gameLog1Info,
        gameLog2: gameLog2Info,
        gameLog3: gameLog3Info,
        gameLog4: gameLog4Info,
        gameLog5: gameLog5Info,
        personality: currentPersonality,
        userId: userId
    });

    const gameLogsData = [gameLog1Info, gameLog2Info, gameLog3Info, gameLog4Info, gameLog5Info];
    setGameLogs(gameLogsData);

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

  return (
    <div className="container survey-container">
      <div className="survey-shadow-container">
      <h2 className="survey-subtitle">Please reflect on the chatbot you just finished interacting with.</h2>
      </div>
      <button className="survey-button" onClick={handleSurveyClick}>Proceed</button>
    </div>
  );
}

export default Survey;
