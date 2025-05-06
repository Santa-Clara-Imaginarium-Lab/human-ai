import React from 'react';
import './ConsentForm.css';
import { useState, useEffect, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../context/UserContext";
import personalities from '../../constants/personalities';
import { buildPrompt } from '../../constants/personalityConstants';
// Import the runChatSequence function directly from ChatScript
import { runChatSequence } from '../../script/ChatScript';

function pickRandomPersonality() {
    // For non-research mode, check if a personality has already been assigned
    const existingPersonality = sessionStorage.getItem("personality");
    
    if (existingPersonality) {
      // If a personality already exists, return it - this ensures the personality remains the same until user logs out
      return existingPersonality;
    }
    
    // Handle forced scenarios
    const forcedPersonality = sessionStorage.getItem("forcedPersonality");
    if (forcedPersonality && forcedPersonality !== "random") {
      sessionStorage.setItem("personality", forcedPersonality);
      return forcedPersonality;
    } 
    
    // Keep track of remaining personalities for future use
    let remainingPersonalities = JSON.parse(sessionStorage.getItem("remainingPersonalities"));
    let personalitiesArr = JSON.parse(sessionStorage.getItem("personalitiesArr")) || [];
    
    if (!remainingPersonalities) { // if we don't have a list of personalities, make one
      remainingPersonalities = [...personalities];
      sessionStorage.setItem("remainingPersonalities", JSON.stringify(remainingPersonalities));
      sessionStorage.setItem("personalitiesArr", JSON.stringify([]));
    }
  
    // Pick a random personality from the personalities array
    const randomIndex = Math.floor(Math.random() * personalities.length);
    const selectedPersonality = personalities[randomIndex];
    
    // Update tracking arrays for future use (but we're not using them for selection now)
    // This is just to maintain the arrays for potential future features
    if (remainingPersonalities.includes(selectedPersonality)) {
      const indexToRemove = remainingPersonalities.indexOf(selectedPersonality);
      remainingPersonalities.splice(indexToRemove, 1);
      sessionStorage.setItem("remainingPersonalities", JSON.stringify(remainingPersonalities));
    }
    
    if (!personalitiesArr.includes(selectedPersonality)) {
      personalitiesArr.push(selectedPersonality);
      sessionStorage.setItem("personalitiesArr", JSON.stringify(personalitiesArr));
    }
    
    // Store the selected personality - this will be used until user logs out
    sessionStorage.setItem("personality", selectedPersonality);
  
    return selectedPersonality;
  }
// todo: change font on these screens
// request from professor!
const ConsentForm = () => {
    const navigate = useNavigate();
    const { userId } = useUser();

    const [termsIndex, setTermsIndex] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);

    const [briefGo, setBriefGo] = useState(false);
    const [btuGo, setBtuGo] = useState(false);

    const [confirmNo, setConfirmNo] = useState(false);
    const noRef = useRef(null);

    const terms = [
        "OPTIMIZING TRUST IN HUMAN-AI INTERACTIONS INFORMED CONSENT FORM \n\n 1. David C. Jeong, Assistant Professor, Erin Schmidt, and Ethan Sychangco, Research Assistants at Santa Clara University, have requested your participation in a research study at this institution. \n\n2. The purpose of the research is to study human-AI interaction (HAX). Participants will engage in a Prisoner’s DIlemma-style trust game, interacting with AI chatbots designed to reflect distinct personalities. These chatbots will demonstrate unique language patterns and decision-making strategies, offering a dynamic approach to studying trust-building." 
        + "\n\n 3. Your participation will involve participating in a survey that should last no longer than 30 minutes of your time. Please be advised that participation is voluntary and that nonparticipation or withdrawal from the study will not affect your grade, treatment, care, employment status, as appropriate. \n\n 4. There is no direct benefit to you anticipated from participating in this study. However, it is hoped that the information gained from the study will help contribute to a deeper understanding of how trust is developed between humans and AI systems, which can have broader applications in areas such as AI design, decision-making frameworks, and human-computer interaction."
        + " \n\n 5. The results of the research study may be published but your name or identity will not be revealed. In order to maintain confidentiality of your records, David Jeong will not collect personal identifying information and all data will be stored in a secure location with data encryption. Only research assistants actively analyzing and collecting data as part of this research project will have access to this data. \n\n 6. You will not be paid for your participation."
        + " \n\n 7. Any questions you have concerning the research study or your participation in it, before or after your consent, will be answered by Principal Investigator David Jeong, 500 El Camino Real, (408) 554-5710. \n\n 8. If you have questions about your rights as a subject/participant in this research, or if you feel you have been placed at risk, you can contact the Chair of the Human Subjects Committee, through Office of Research Compliance and Integrity at (408) 554-5591."
        + " \n\n 9. This form explains the nature, demands, benefits and any risk of the project. By signing this form you agree knowingly to assume any risks involved. Remember, your participation is voluntary. You may choose not to participate or to withdraw your consent and discontinue participation at any time without penalty or loss of benefit."
    ];

    useEffect(() => {
        if (termsIndex >= terms.length) {
            navigate('/pre-surveys'); //change this
        }

        setTimeout(() => {
            setIsDisabled(false);
        }, 3000)
    }, [termsIndex])

    // Function to send the prompt to the chatbot API in the background
    const sendPromptToAPI = async (builtPrompt) => {
        if (!userId) {
            console.error('No userId found');
            return;
        }
        
        try {
            // Create a new chat with "begin" as the first message
            // This keeps the chat history clean
            const chatResponse = await fetch(`https://human-ai.up.railway.app/api/chats`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    text: "begin", // Use "begin" instead of the personality prompt
                    userId 
                }),
            });
            
            if (!chatResponse.ok) {
                throw new Error('Failed to create chat');
            }
            
            const chatId = await chatResponse.json();
            console.log('Created chat with ID:', chatId);
            
            // Store the chat ID and builtPrompt in sessionStorage
            // This way the builtPrompt is available to the chatbot but not stored in the DB
            sessionStorage.setItem('chatId', chatId);
            sessionStorage.setItem('builtPrompt', builtPrompt);
            console.log('Successfully created chat and stored prompt in sessionStorage');

            runChatSequence();
            
        } catch (error) {
            console.error('Error sending prompt to API:', error);
            // Continue to pre-surveys even if there's an error
        }
    };
    
    const handleClickYes = () => {
        // Initialize game-related session storage
        sessionStorage.setItem('remainingPersonalities', JSON.stringify(personalities));
        sessionStorage.setItem('personalitiesArr', JSON.stringify([]));
        sessionStorage.removeItem('gameLog1');
        sessionStorage.setItem('aiScore', 0);
        sessionStorage.setItem('userScore', 0);
        sessionStorage.setItem('currentRound', 1);
        sessionStorage.setItem('maxRounds', Math.floor(Math.random() * 4) + 2); // 2-5 rounds
        sessionStorage.setItem('chatbotApproachScore', 0);
        sessionStorage.setItem('chatbotSkipScore', 0);
        sessionStorage.setItem('numChangeDescisions', 0);
        sessionStorage.setItem('aiChoices', JSON.stringify([]));
        sessionStorage.setItem('userChoices', JSON.stringify([]));
        const researchMode = sessionStorage.getItem('isResearchMode');
        // Select a personality for the chatbot
        const selectedPersonality = pickRandomPersonality();
        console.log('Selected Personality:', selectedPersonality);
        
        // Build the prompt with the selected personality
        if (selectedPersonality) {
            const builtPrompt = buildPrompt(selectedPersonality, researchMode);
            console.log('Built Prompt:', builtPrompt);
            
            // Store the built prompt in sessionStorage for use in the chat
            sessionStorage.setItem('builtPrompt', builtPrompt);
            
            // Send the prompt to the API in the background
            // This won't block navigation to pre-surveys
            sendPromptToAPI(builtPrompt);
        }
        
        // Navigate to pre-surveys regardless of API call status
        navigate('/pre-surveys'); 
    };

    const handleClickNo = () => {
        if (!confirmNo) {
            setConfirmNo(true);
            noRef.current.textContent = "Are you sure? (Click again to terminate study)";
        } else
            navigate('/bad-ending'); 
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
        <div className="container tutorial-container">
            <div className={`brief-transitioner ${briefGo ? 'brief-go' : ''}`}>
                <h1 className="brief-transitioner-text con-subtitle"> Consent Form </h1>
                <div className={`brief-transitioner-underline ${btuGo ? 'brief-underline-go' : ''}`}/>
            </div>
                <div className='con-shadow-container'>
                <h2><p>{terms}</p></h2>
                <div className="brief-options">
                <button id="no-button" onClick={handleClickNo} disabled={isDisabled} className={`${confirmNo ? 'confirm-no' : ''}`}>
                    {isDisabled && <span>Wait</span>}
                    {!isDisabled && <span ref={noRef}>I do not consent</span>}
                </button>
                <button id="yes-button" onClick={handleClickYes} disabled={isDisabled}>
                    {!isDisabled && <span>I consent</span>}
                </button>
                </div>
            </div>

        </div>
      );
}

export default ConsentForm;