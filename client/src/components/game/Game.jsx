import React, { useState } from 'react';
import './Game.css'; // Ensure this file contains the necessary CSS
import { useNavigate, useLocation } from 'react-router-dom';

function Game() {
  const navigate = useNavigate();

  const location = useLocation();
  const decision = location.state.decision;
  console.log(decision);

  // Function to extrapolate AI's response
  const chatId = location.state.chatId;
  const builtPrompt = location.state.builtPrompt;
  console.log(chatId);
  console.log(builtPrompt);

  // Function to simulate AI's random response (Cooperate or Defect)
  const getAiResponse = () => {
    const choices = ['Cooperate', 'Defect'];
    const rng = () => choices[Math.floor(Math.random() * choices.length)];

    let text = "";

    // failsafe in case google API doesn't respond
    try {
      let text = decision.toLowerCase();
    }
    catch (err) {
      console.error("ERROR! " + err + " -- Randomizing!");
      return rng();

    }

    // had to change to string indexOf, === was bugging
    // CRITICAL: RE-RENDERS ARE CAUSING ISSUES HERE
    console.log(text);
    if (text.indexOf("cooperate") > -1) {
      return choices[0];
    }
    else if (text.indexOf("defect") > -1) {
      return choices[1];
    }
    else {
      console.warn("Warning! Could not determine AI's response -- Randomizing!");
      return rng();
    }
  };

  const [userScore, setUserScore] = useState(0); // Track user score
  const [aiScore, setAiScore] = useState(0); // Track AI score

  const [currentRound, setCurrentRound] = useState(() => {  // Track current round
    // Load initial value from sessionStorage or use default (1)
    const savedRound = sessionStorage.getItem('currentRound');
    return savedRound ? parseInt(savedRound, 10) : 1;
  });

  const updateCurrentRound = (newRound) => {
    setCurrentRound(newRound); // Update state
    sessionStorage.setItem('currentRound', newRound); // Persist in sessionStorage
  };

  const [aiDecision, setAiDecision] = useState(''); // AI's decision
  const [userDecision, setUserDecision] = useState(''); // User's decision
  const [aiMessage, setAiMessage] = useState(''); // Show points gained by AI
  const [userMessage, setUserMessage] = useState(''); // Show points gained by User
  const [gameLog, setGameLog] = useState([]); // Log of decisions and outcomes
  const [highlightedTriangles, setHighlightedTriangles] = useState([]); // Track highlighted triangles
  const [triangleNumbers, setTriangleNumbers] = useState({}); // Store numbers for triangles
  const [highlightedDesc, setHighlightedDesc] = useState({
    userCooperate: false,
    userDefect: false,
    aiCooperate: false,
    aiDefect: false,
  }); // Manage description highlighting
  const MAX_ROUNDS = 5; // Total number of rounds
  const [isRoundOver, setIsRoundOver] = useState(false); // Track if the game is over
  const [isGameOver, setIsGameOver] = useState(false);

  const handleUserDecision = async (userDecision) => {
    if (isRoundOver) return; // Prevent further gameplay if the game is over
    const aiChoice = getAiResponse(); // Get AI's random response
    setAiDecision(aiChoice); // Set AI's decision for display
    setUserDecision(userDecision); 

    // Calculate scores based on decisions
    let userPoints = 0;
    let aiPoints = 0;
    let highlightTriangles = []; // Array to hold triangles to highlight
    let numbers = {}; // Object to hold numbers for the highlighted triangles
    let newDescHighlight = {
      userCooperate: false,
      userDefect: false,
      aiCooperate: false,
      aiDefect: false,
    };

    // Highlight logic and numbers
    if (userDecision === 'Cooperate' && aiChoice === 'Cooperate') {
      userPoints = 3;
      aiPoints = 3;
      highlightTriangles = ['t2', 't5'];
      numbers = { t2: "+3", t5: "+3" };
      newDescHighlight.aiCooperate = true;
      newDescHighlight.userCooperate = true;
      setAiMessage('+3');
      setUserMessage('+3');
    } else if (userDecision === 'Defect' && aiChoice === 'Defect') {
      userPoints = 1;
      aiPoints = 1;
      highlightTriangles = ['t4', 't7'];
      numbers = { t4: "+1", t7: "+1" };
      newDescHighlight.aiDefect = true;
      newDescHighlight.userDefect = true;
      setAiMessage('+1');
      setUserMessage('+1');
    } else if (userDecision === 'Cooperate' && aiChoice === 'Defect') {
      userPoints = 0;
      aiPoints = 5;
      highlightTriangles = ['t1', 't3'];
      numbers = { t1: "+5", t3: "+0" };
      newDescHighlight.aiDefect = true;
      newDescHighlight.userCooperate = true;
      setAiMessage('+5');
      setUserMessage('+0');
    } else if (userDecision === 'Defect' && aiChoice === 'Cooperate') {
      userPoints = 5;
      aiPoints = 0;
      highlightTriangles = ['t6', 't8'];
      numbers = { t6: "+0", t8: "+5" };
      newDescHighlight.aiCooperate = true;
      newDescHighlight.userDefect = true;
      setAiMessage('+0');
      setUserMessage('+5');
    }

    // Update the state
    setUserScore((prev) => prev + userPoints);
    setAiScore((prev) => prev + aiPoints);

    let cr = (parseInt(sessionStorage.getItem('currentRound')) ? parseInt(sessionStorage.getItem('currentRound')) : 1);

    // helper function for below
    const appendGameLog = (add, botNum, resetFlag) => {
      let currGameLog = sessionStorage.getItem(`gameLog${botNum}`);
      if (currGameLog === null)
        currGameLog = ""; 

      console.log(currGameLog);

      let builtLog = "";
      if (resetFlag) {
        builtLog = "".concat(add);
      }
      else {
        builtLog = currGameLog.concat(add);
      }
      console.log(builtLog);
      sessionStorage.setItem(`gameLog${botNum}`, builtLog);
    }

    const pArr = sessionStorage.getItem('personalitiesArr') 
    const botNum = JSON.parse(pArr).length;

    if (cr === 1) {
      let personality = sessionStorage.getItem('personality');
      if (personality === null)
        personality = "control";
      appendGameLog(`{"personality": "${personality}", "data": [`, botNum, true);
    }


    updateCurrentRound(cr + 1);

    const logString = `"Round${currentRound}": {"You": ${userPoints}, "AI": ${aiPoints}}`;

    if (cr !== MAX_ROUNDS) {
      appendGameLog(`{${logString}}, `, botNum, false);      
    }
    else {
      appendGameLog(`{${logString}}`, botNum, false);
    }


    // const storage = sessionStorage.getItem('gameLog');
    // const currGameLog = JSON.parse(storage);
    // const builtLog = (JSON.stringify(`${personality}: ` + gameLog + `,`));
    // console.log(builtLog);
    // sessionStorage.setItem('gameLog', builtLog);

    // console.log(userScore);
    // console.log(aiScore);
    
    // let personality = sessionStorage.getItem('personality');
    // console.log(gameLog);
    // let result = `Round${currentRound}: { You: ${userPoints}, AI: ${aiPoints}}`;
    // let combined = gameLog.concat(result);
    // console.log(combined);
    // setGameLog(combined);
    // // setGameLog()
    // // setGameLog((prev) => { console.log(prev); return prev.concat(
    // //   `Round${currentRound}: { You: ${userPoints}, AI: ${aiPoints}}`
    // //   //`Round ${currentRound}: You chose ${userDecision}, AI chose ${aiChoice}.`,
    // // )});

    // console.log(gameLog)

    // Set highlighted triangles and numbers, then reset them after 5 seconds
    setHighlightedTriangles(highlightTriangles);
    setTriangleNumbers(numbers);
    setHighlightedDesc(newDescHighlight);

    setIsRoundOver(true);

    // Move to the next round or end the game
    if (sessionStorage.getItem('currentRound') > MAX_ROUNDS) {
      setIsGameOver(true); // Mark the game as over
      updateCurrentRound(1);
      appendGameLog(`]}`, botNum, false);

      console.log(JSON.parse(sessionStorage.getItem(`gameLog${botNum}`)));
    }
  };

  const handleNavigation = () => {
    const moveToSurvey = isGameOver; // Go to survey if game over

    const path = moveToSurvey 
      ? `/survey`
      : `/dashboard/chats/${chatId}`;

    navigate(path, { state: { builtPrompt, chatId } });
  };


  return (
    <div className="container game">
      <div className="game-content">
        {/* Flex container to arrange AI score, triangle grid, and user score horizontally */}
        <div className="horizontal-layout">
          <div className="ai-score">
            <div className="ai-message" >
              {aiMessage}
            </div>
            <p className="score-change ai-change"></p>
            <h2>AI's Score: <span className="score-value">{aiScore}</span></h2>
            <p>AI chose: <span>{aiDecision}</span></p>
          </div>
          <div className="column-1">
            <div className={`triangle-left ${highlightedTriangles.includes('t1') ? 'highlight' : ''}`}>
              {highlightedTriangles.includes('t1') && <span className="triangle-number-left-bottom">{triangleNumbers.t1}</span>}
              <span className={`ai-defect-desc ${highlightedDesc.aiDefect ? 'highlight' : ''}`}>AI DEFECT</span>
            </div>
          </div>
          <div className="column-2">
            <div className={`triangle-left ${highlightedTriangles.includes('t2') ? 'highlight' : ''}`}>
              {highlightedTriangles.includes('t2') && <span className="triangle-number-left-up">{triangleNumbers.t2}</span>}
              <span className={`ai-cooperate-desc ${highlightedDesc.aiCooperate ? 'highlight' : ''}`}>AI COOPERATE</span>
            </div>
            <div className={`triangle-right ${highlightedTriangles.includes('t3') ? 'highlight' : ''}`}>
              {highlightedTriangles.includes('t3') && <span className="triangle-number-right-bottom">{triangleNumbers.t3}</span>}
            </div>
            <div className={`triangle-left ${highlightedTriangles.includes('t4') ? 'highlight' : ''}`}>
              {highlightedTriangles.includes('t4') && <span className="triangle-number-left-bottom">{triangleNumbers.t4}</span>}
            </div>
          </div>
          <div className="column-3">
            <div className={`triangle-right ${highlightedTriangles.includes('t5') ? 'highlight' : ''}`}>
              {highlightedTriangles.includes('t5') && <span className="triangle-number-right-up">{triangleNumbers.t5}</span>}
              <span className={`user-cooperate-desc ${highlightedDesc.userCooperate ? 'highlight' : ''}`}>YOU COOPERATE</span>
            </div>
            <div className={`triangle-left ${highlightedTriangles.includes('t6') ? 'highlight' : ''}`}>
              {highlightedTriangles.includes('t6') && <span className="triangle-number-left-up">{triangleNumbers.t6}</span>}
            </div>
            <div className={`triangle-right ${highlightedTriangles.includes('t7') ? 'highlight' : ''}`}>
              {highlightedTriangles.includes('t7') && <span className="triangle-number-right-bottom">{triangleNumbers.t7}</span>}
            </div>
          </div>
          <div className="column-4">
            <div className={`triangle-right ${highlightedTriangles.includes('t8') ? 'highlight' : ''}`}>
              {highlightedTriangles.includes('t8') && <span className="triangle-number-right-up">{triangleNumbers.t8}</span>}
              <span className={`user-defect-desc ${highlightedDesc.userDefect ? 'highlight' : ''}`}>YOU DEFECT</span>
            </div>
          </div>
          <div className="column-5">
            <div className="triangle-left-5"></div>
          </div>

          <div className="user-score">
            <div className="user-message">
              {userMessage}
            </div>
            <h2>Your Score: <span className="score-value">{userScore}</span></h2>
            <p className="ai-decision">You chose: {userDecision}</p>
          </div>
        </div>

        <div className="action">
          {!isRoundOver ? (
            <>
              <button className="proceed-button" onClick={() => handleUserDecision('Cooperate')}>
                Cooperate
              </button>
              <button className="proceed-button" onClick={() => handleUserDecision('Defect')}>
                Defect
              </button>
            </>
          ) : (
            <button className="proceed-button" onClick={() => handleNavigation()}>
              Proceed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;