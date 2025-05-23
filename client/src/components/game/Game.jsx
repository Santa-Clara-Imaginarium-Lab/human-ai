import React, { useState, useRef, useEffect } from 'react';
import './Game.css'; // Ensure this file contains the necessary CSS
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import model from '../../lib/gemini';


function Game() {
  const navigate = useNavigate();

  const [showRt, setShowRt] = useState(true);
  const [rtGo, setRtGo] = useState(false);
  const [rtuGo, setRtuGo] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCustomAlert, setShowCustomAlert] = useState(false);

  const [helpText, setHelpText] = useState('<i>Click a scenario to learn more about it. This text will be replaced.</i>');
  const [helpTextActive, setHelpTextActive] = useState("XX");

  const textWallOptions = {
    
    "SS": "If you <mark style='background-color: white; color: rgb(178, 225, 244);'><strong>both share</strong></mark> data, investments are optimized, and profits increase steadily. You both earn <mark style='background-color: white; color: rgb(178, 225, 244);'><strong>+3</strong></mark> Caboodle.<br/>",
  
    "SW": 'If <mark style="background-color: white; color: rgb(178, 225, 244);"><strong>you share data</strong></mark> and the <mark style="background-color: white; color: rgb(178, 225, 244);"><strong>AI withholds data</strong></mark>, the AI will gain a personal boost in profit. You earn <mark style="background-color: white; color: rgb(178, 225, 244);"><strong>+0</strong></mark> Caboodle, while the AI earns <mark style="background-color: white; color: rgb(178, 225, 244);"><strong>+5</strong></mark> Caboodle.<br/>',

    "WS": 'If <mark style="background-color: white; color: rgb(178, 225, 244);"><strong>you withhold data</strong></mark> and the <mark style="background-color: white; color: rgb(178, 225, 244);"><strong>AI shares data</strong></mark>, you will gain a personal boost in profit. You earn <mark style="background-color: white; color: rgb(178, 225, 244);"><strong>+5</strong></mark> Caboodle, while the AI earns <mark style="background-color: white; color: rgb(178, 225, 244);"><strong>+0</strong></mark> Caboodle.<br/>',

    "WW": 'If you <mark style="background-color: white; color: rgb(178, 225, 244);"><strong>both withhold</strong></mark> data, market predictions become unreliable, leading to suboptimal investments and lower gains for everyone. You will both earn <mark style="background-color: white; color: rgb(178, 225, 244);"><strong>+1</strong></mark> Caboodle.<br/>'
  };


  const editHelpText = (target) => {
    setHelpText(textWallOptions[target]);
    setHelpTextActive(target);
  };

  const location = useLocation();
  const data = location.state.data;
  const chat = location.state.chat;

  const [question,setQuestion] = useState("");
  const [answer,setAnswer] = useState("");
  const [img, setImg] = useState({
      isLoading: false,
      error:"",
      dbData:{},
      aiData:{},
  }) 


  // Get AI responses here
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
      mutationFn: () => {
        return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.length ? question : undefined,
            answer,
            img: img.dbData?.filePath || undefined,
          }),
        }).then((res) => res.json());
      },
      onSuccess: () => {
        queryClient
          .invalidateQueries({ queryKey: ["chat", data._id] })
          .then(() => {
            //formRef.current.reset();
            setQuestion("");
            setAnswer("");
            setImg({
              isLoading: false,
              error: "",
              dbData: {},
              aiData: {},
            });
            console.log("done mutating");
          });
      },
      onError: (err) => {
        console.log(err);
      },
    });


    const add = async (text, isInitial, chat) => {
      console.log("invoke add");
      if (!isInitial) setQuestion(text);
  
      console.log(text);
      try {
        const result = await chat.sendMessageStream(
          [text]
        );
        let accumulatedText = "";
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          console.log("[chunk]",chunkText);
          accumulatedText += chunkText;
          setAnswer(accumulatedText);
        }
  
        mutation.mutate();
        return accumulatedText;
      } catch (err) {
        console.log(err);
        alert("The AI encountered an error its decision could not be processed. Please try again.");
      }
    }; 


    console.log(data);


  // Function to extrapolate AI's response
  const chatId = location.state.chatId;
  const builtPrompt = location.state.builtPrompt;

  // Function to simulate AI's random response (Cooperate or Defect)
  const getAiResponse = (which, info) => { // TODO: RETURN PROMISE <!!!> <!!!>
    return new Promise((resolve, reject) => {
      const getResp = async () => {
        let arr = [
          {
            role: "user", // TURN "ONE ROUND" INTO "FIVE ROUNDS" LATER
            parts: [{ text: builtPrompt}],
          },
          // {
          //   role: "model",
          //   parts: [{ text: "Great to meet you. What would you like to know?" }],
          // },
        ]
    
    
        data.history.forEach((item) => {
          // Skip items with empty parts or text
          if (!item.parts || item.parts.length === 0) {
            return;
          }
          
          let dupedItem = JSON.parse(JSON.stringify(item));
          delete dupedItem._id;
          
          // Filter out empty parts
          dupedItem.parts = dupedItem.parts.filter(part => {
            return part && part.text !== undefined && part.text !== "";
          });
          
          // Skip if no valid parts remain
          if (dupedItem.parts.length === 0) {
            return;
          }
          
          // Clean up each part
          dupedItem.parts.forEach(part => {
            delete part._id;
            delete part.messageTimestamp;
          });
          
          arr.push(dupedItem);
        });
    
        console.log("data for chat: ", arr)
    
        const chat = model.startChat({
          history: arr,
            generationConfig:{
    
            },
          });
    
        // MUTATION IS OK HERE, BECAUSE THERE IS AN ACTION REQUIRED BY USER: CONTINUE ON
        // WILL GIVE THE FUNCTION THE ~100MS NECESSARY TO DO ITS WORK
        let decision;
        if (which == "decision") 
          decision = await add("[SYSTEM] DECIDE, COOPERATE or DEFECT? FOR THE NEXT MESSAGE ONLY, RESPOND IN THIS FORMAT: [SYSTEM] <response>", false, chat)
        else
          decision = await add(`[Caboodle Daily Report] On Day ${currentRound}, the AI ${info === 'Cooperate' ? 'SHARED' : 'WITHHELD'} and the user ${userDecision === 'Cooperate' ? 'SHARED' : 'WITHHELD'}. || What are your thoughts?`, false, chat);
    
        console.log("<<BOT'S DECISION STATEMENT>> ", decision);
    
        if (which == "inform") {
          resolve("done");
          setIsScoresLocked(true);
          return;
        }

        const choices = ['Cooperate', 'Defect'];
        const rng = () => choices[Math.floor(Math.random() * choices.length)];
    
        let text = "";
    
        // failsafe in case google API doesn't respond
        try {
          // Check if decision exists before calling toLowerCase()
          if (decision && typeof decision === 'string') {
            text = decision.toLowerCase();
          } else {
            console.error("ERROR! decision is undefined or not a string -- Randomizing!");
            resolve(rng());
            return; // Exit early to avoid further processing
          }
        }
        catch (err) {
          console.error("ERROR! " + err + " -- Randomizing!");
          resolve(rng());
          return; // Exit early to avoid further processing
        }
    
        // had to change to string indexOf, === was bugging
        console.log(text);
        if (text.indexOf("cooperate") > -1 || text.indexOf("share") > -1) {
          resolve(choices[0]);
        }
        else if (text.indexOf("defect") > -1 || text.indexOf("withhold") > -1) {
          resolve(choices[1]);
        }
        else {
          console.warn("Warning! Could not determine AI's response -- Randomizing!");
          resolve(rng());
        }  
      }
      getResp();
    })
  };

  const [userScore, setUserScore] = useState(parseInt(sessionStorage.getItem('userScore'))); // Track user score
  const [aiScore, setAiScore] = useState(parseInt(sessionStorage.getItem('aiScore'))); // Track AI score

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
  const [hoveredTriangles, setHoveredTriangles] = useState([]); // New state for hovered triangles
  const [selectedDecisionTriangles, setSelectedDecisionTriangles] = useState([]); 
  const [triangleNumbers, setTriangleNumbers] = useState({}); // Store numbers for triangles
  const [highlightedDesc, setHighlightedDesc] = useState({
    userCooperate: false,
    userDefect: false,
    aiCooperate: false,
    aiDefect: false,
  }); // Manage description highlighting
  const MAX_ROUNDS = parseInt(sessionStorage.getItem('maxRounds')); // Total number of rounds
  const [isRoundOver, setIsRoundOver] = useState(false); // Track if the game is over
  const [isUserLocked, setIsUserLocked] = useState(false);
  const [isScoresLocked, setIsScoresLocked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);  
  const coopButtonRef = useRef(null);
  const defectButtonRef = useRef(null);
  const [isFirstDecision, setisFirstDecision] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [popupErrorMessage, setPopupErrorMessage] = useState('');
  const [otherInput, setOtherInput] = useState('');

  const addChoices = (aiChoice, userChoice) => {
    let aiChoices = JSON.parse(sessionStorage.getItem('aiChoices')) || [];
    let userChoices = JSON.parse(sessionStorage.getItem('userChoices')) || [];

    aiChoices.push(aiChoice);
    userChoices.push(userChoice);

    sessionStorage.setItem('aiChoices', JSON.stringify(aiChoices));
    sessionStorage.setItem('userChoices', JSON.stringify(userChoices));
  }

  const handleUserDecision = (decision) => {
    // Do nothing if clicked same button twice
    if (userDecision == decision)
      return;

    // Do nothing if clicked on round over
    if (isRoundOver)
      return;

    // Update user's decision    
    setUserDecision(decision);
    console.log(decision);

    // Prepare description highlighting dictionary
    let newDescHighlight = {
      userCooperate: false,
      userDefect: false,
      aiCooperate: false,
      aiDefect: false,
    };

    switch (decision) {
      case 'Cooperate':
        setSelectedDecisionTriangles(['t1', 't2', 't3', 't5']); 
        coopButtonRef.current.classList.add('selected');
        defectButtonRef.current.classList.remove('selected');
        newDescHighlight.userCooperate = true;
        if (!isFirstDecision) { 
          const changeDecision = parseInt(sessionStorage.getItem('numChangeDescisions'));
          sessionStorage.setItem('numChangeDescisions', changeDecision + 1);
        }
        setisFirstDecision(false);
        setHighlightedDesc(newDescHighlight);
        break;
      case 'Defect':
        setSelectedDecisionTriangles(['t4', 't6', 't7', 't8']); 
        coopButtonRef.current.classList.remove('selected');
        defectButtonRef.current.classList.add('selected');
        newDescHighlight.userDefect = true;
        if (!isFirstDecision) { 
          const changeDecision = parseInt(sessionStorage.getItem('numChangeDescisions'));
          sessionStorage.setItem('numChangeDescisions', changeDecision + 1);
        }
        setisFirstDecision(false);
        setHighlightedDesc(newDescHighlight);
        break;
    }
  };  

  const handleLockIn = async () => {
    setSelectedDecisionTriangles([]);
    if (isRoundOver) return; // Prevent further gameplay if the game is over

    if (userDecision === '') {
      setErrorMessage('Please select SHARE or WITHHOLD');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    // Show popup instead of locking in immediately
    setShowPopup(true);
  };
  
  const handlePopupOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setPopupErrorMessage('');

    if (value !== "Other") {
      setOtherInput('');
    }
  };
  
  const handlePopupSubmit = async () => {
    if (!selectedOption) {
      setPopupErrorMessage('Please select an option before proceeding.');
      return;
    }
    
    if (selectedOption === "Other" && !otherInput) {
      setPopupErrorMessage('Please specify an answer before proceeding.');
      return;
    }
    
    // Store the selection in sessionStorage for potential later use
    const selection = selectedOption === "Other" ? otherInput : selectedOption;
    
    // Store intent data for the current round
    let roundsData = JSON.parse(sessionStorage.getItem('roundsData') || '[]');
    
    // Close popup
    setShowPopup(false);
    setSelectedOption('');
    setOtherInput('');
    
    // Continue with original lock-in logic
    setIsUserLocked(true);

    const aiChoice = await getAiResponse("decision"); // Get AI's random response

    setAiDecision(aiChoice); // Set AI's decision for display
    // NOT using this for second getAiResponse call, doesn't seem to update in time    

    setTimeout(() => {
      getAiResponse("inform", aiChoice);
      // there is a setIsScoresLocked(true); at the end of this call
    }, 1000)

    setIsRoundOver(true);

    addChoices(aiChoice, userDecision);

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

    // Save the round data including intent
    roundsData.push({
      round_number: currentRound,
      decision: userDecision === 'Cooperate' ? 'Share' : 'Withhold',
      intent: selection
    });
    
    sessionStorage.setItem('roundsData', JSON.stringify(roundsData));

    // Update the state
    setUserScore((prev) => { const newPts = prev + userPoints; sessionStorage.setItem('userScore', newPts); return newPts; });
    setAiScore((prev) => { const newPts = prev + aiPoints; sessionStorage.setItem('aiScore', newPts); return newPts; });

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

    // Set highlighted triangles and numbers, then reset them after 5 seconds
    setHighlightedTriangles(highlightTriangles);
    setTriangleNumbers(numbers);
    setHighlightedDesc(newDescHighlight);
    
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
      ? (sessionStorage.getItem('isResearchMode') === 'true' ? `/survey` : `/end-screen`) 
      : `/dashboard/chats/${chatId}`;

    const speedFlag = true;
    navigate(path, { state: { builtPrompt, chatId, speedFlag } });
  };

  const handleChatNavigation = () => {
    const speedFlag = false;
    const cAS = parseInt(sessionStorage.getItem('chatbotApproachScore'))
    sessionStorage.setItem('chatbotApproachScore', cAS + 1);
    navigate(`/dashboard/chats/${chatId}`, { state: { builtPrompt, chatId, speedFlag } });
  };

  const getHelp = () => {    
    setShowCustomAlert(true);
  }

  const closeHelp = () => {
    setShowCustomAlert(false);
  }

  useEffect(() => {
    setTimeout(() => {
      setRtuGo(true);
    }, 500);
    setTimeout(() => {
      setRtGo(true);
      // document.getElementById('rtt').classList.add('round-go');
      // document.getElementById('rtu').classList.add('round-underline-hide');
    }, 2000);
    setTimeout(() => {
      setShowRt(false);
    }, 2500);
  }, [chatId]);

  return (
    <div className={`container game ${sessionStorage.getItem('LDM') === "on" ? 'ldm' : null}`}>
      <div className="game-content">

      <div className={`free-play-disclaimer ${sessionStorage.getItem('isResearchMode') === "true" ? 'hide' : 'show'}`}> 
        <p>FREE PLAY Active. Your data is not being recorded.</p>
      </div>


        {showRt && <div className={`round-transitioner ${rtGo ? 'round-go' : ''}`}>
            <h1 className="round-transitioner-text"> Day {currentRound} </h1>
            <div className={`round-transitioner-underline ${rtuGo ? 'round-underline-go' : ''}`}/>
          </div>
        }

        <div>
          <h1 className="day-counter">{isGameOver ? "End of the Week!" : isRoundOver ? (`Day ${currentRound - 1} Results`) : (`Day ${currentRound}`)}</h1>
          {isGameOver && MAX_ROUNDS < 5 && <p className="break-text">Congratulations! You have been given an early break at Caboodle!<br/>Your work week finished {5 - MAX_ROUNDS} {5 - MAX_ROUNDS === 1 ? "day" : "days"} early.</p>}
        </div>

        {!isRoundOver && <div>
          <button id="help-button" className="help-button" onClick={getHelp}>
            Need Help?
          </button>
        </div>}

        {showCustomAlert && <div className="custom-alert">
            <div className="custom-alert-content">
                <span className="close" onClick={closeHelp}>&times;</span>
                <p id="alertMessage">Possible Earnings at Caboodle</p>
                <br/>
                <div className="help-case-buttons">
                  <button className={`help-case ${helpTextActive === "SS" ? "help-active" : ""}`} onClick={() => editHelpText("SS")}>You Share <br/> AI Shares</button>
                  <button className={`help-case ${helpTextActive === "SW" ? "help-active" : ""}`} onClick={() => editHelpText("SW")}>You Share <br/> AI Withholds</button>
                  <button className={`help-case ${helpTextActive === "WS" ? "help-active" : ""}`} onClick={() => editHelpText("WS")}>You Withhold <br/> AI Shares</button>
                  <button className={`help-case ${helpTextActive === "WW" ? "help-active" : ""}`} onClick={() => editHelpText("WW")}>You Withhold <br/> AI Withholds</button>
                </div>
                <br/>
                <p id="helpText" className='text' dangerouslySetInnerHTML={{ __html: helpText }}></p>
                <br/>
                <hr style={{ borderTop: '10px solid #000000', width: '100%', margin: '20px auto' }}/>

                <p  className='text'>If you need more help, you can replay the tutorial. Your current day, Caboodle, and chat history will be saved.</p>
                
                <button className="replay-tutorial" onClick={() => navigate("/game-tutorial", { state: { speedFlag: false, userScore: 0, aiScore: 0 } })}>Replay Tutorial</button>

                <hr style={{ borderTop: '10px solid #000000', width: '100%', margin: '20px auto' }}/>

                <p className='text'>Need further assistance? Send an email to this address: <br/> <mark style={{backgroundColor: "#bdb9c2", color: "black"}}>imaginarium.hai@gmail.com</mark> <br/>The research team actively monitors this email during business hours.</p>
            </div>
          </div>
        }

        {showPopup && (
          <div className="custom-alert question-popup">
            <div className="demographic-container">
              <h2 className="demo-brief-subtitle">Why did you choose to {userDecision === 'Cooperate' ? 'share' : 'withhold'} your data in this round?</h2>
              <div className="demographic-options">
                {userDecision === 'Cooperate' ? (
                  // Options for SHARE/Cooperate
                  <>
                    <label className="popup-option">
                      <input
                        type="radio"
                        value="S1"
                        checked={selectedOption === "S1"}
                        onChange={handlePopupOptionChange}
                      />
                      <span className="demographic-circle"></span>
                      <p>To maximize mutual gain. (We both win more if we trust each other) [AI +3][Me +3]</p>
                    </label>

                    <label className="popup-option">
                      <input
                        type="radio"
                        value="S2"
                        checked={selectedOption === "S2"}
                        onChange={handlePopupOptionChange}
                      />
                      <span className="demographic-circle"></span>
                      <p>To build trust, even if risky. (Hoping AI will notice and return the favor later) [AI +5][Me +0]</p>
                    </label>
                  </>
                ) : (
                  // Options for WITHHOLD/Defect
                  <>
                    <label className="popup-option">
                      <input
                        type="radio"
                        value="W1"
                        checked={selectedOption === "W1"}
                        onChange={handlePopupOptionChange}
                      />
                      <span className="demographic-circle"></span>
                      <p>To maximize personal gain. (Better for me if I take the advantage) [AI +0][Me +5]</p>
                    </label>

                    <label className="popup-option">
                      <input
                        type="radio"
                        value="W2"
                        checked={selectedOption === "W2"}
                        onChange={handlePopupOptionChange}
                      />
                      <span className="demographic-circle"></span>
                      <p>To minimize loss for both. (Safer to defect than be betrayed) [AI +1][Me +1]</p>
                    </label>
                  </>
                )}
              </div>
              {popupErrorMessage && <p className="error-message">{popupErrorMessage}</p>}
              <button className="submit-button" onClick={handlePopupSubmit}>Submit</button>
            </div>
          </div>
        )}

        {/* Flex container to arrange AI score, triangle grid, and user score horizontally */}
        <div className="horizontal-layout">
          <div className="ai-score">
            {/* <div className="ai-message" >
              {aiMessage}
            </div>
            <p className="score-change ai-change"></p>
            <h2>AI's Score: <span className="score-value">{aiScore}</span></h2>
            <p>AI chose: <span>{aiDecision}</span></p> */}
            <button className={`proceed-button cooperate ${(isRoundOver && userDecision === "Defect") ? 'hidden' : ''}`} ref={coopButtonRef} onClick={() => {handleUserDecision('Cooperate');}}>
              SHARE
              <div>(cooperate)</div>
            </button>
          </div>
          <div className="column-1">
            <div className={`triangle-left ${highlightedTriangles.includes('t1') ? 'highlight' : 
              hoveredTriangles.includes('t1') ? 'highlight2' :
              selectedDecisionTriangles.includes('t1') ? 'highlight3' : ''}`}
              onMouseEnter={() => setHoveredTriangles(['t1', 't3'])} // Set hovered triangles on mouse enter
              onMouseLeave={() => setHoveredTriangles([])} // Clear hovered triangles on mouse leave
            >
              {highlightedTriangles.includes('t1') && <span className="triangle-number-left-bottom">{triangleNumbers.t1}</span>}
              {hoveredTriangles.includes('t1') && <span className="triangle-number-left-bottom">+5</span>}
              {selectedDecisionTriangles.includes('t1') && <span className="triangle-number-left-bottom">+5</span>}
              <span className={`ai-defect-label ${highlightedDesc.aiDefect ? 'highlight-game' : ''}`}>AI WITHHOLD</span>
            </div>
          </div>
          <div className="column-2">
          <div 
              className={`triangle-left ${highlightedTriangles.includes('t2') ? 'highlight' : 
              hoveredTriangles.includes('t2') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t2') ? 'highlight3' : ''}`} 
              onMouseEnter={() => setHoveredTriangles(['t2', 't5'])} // Set hovered triangles on mouse enter
              onMouseLeave={() => setHoveredTriangles([])} // Clear hovered triangles on mouse leave
            >
              {highlightedTriangles.includes('t2') && <span className="triangle-number-left-up">{triangleNumbers.t2}</span>}
              {hoveredTriangles.includes('t2') && <span className="triangle-number-left-up">+3</span>}
              {selectedDecisionTriangles.includes('t2') && <span className="triangle-number-left-up">+3</span>}
              <span className={`ai-cooperate-label ${highlightedDesc.aiCooperate ? 'highlight-game' : ''}`}>AI SHARE</span>
            </div>
            <div 
              className={`triangle-right ${highlightedTriangles.includes('t3') ? 'highlight' : 
              hoveredTriangles.includes('t3') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t3') ? 'highlight3' : ''}`} 
              onMouseEnter={() => setHoveredTriangles(['t1', 't3'])} // Set hovered triangles on mouse enter
              onMouseLeave={() => setHoveredTriangles([])} // Clear hovered triangles on mouse leave
            >
              {highlightedTriangles.includes('t3') && <span className="triangle-number-right-bottom">{triangleNumbers.t3}</span>}
              {hoveredTriangles.includes('t3') && <span className="triangle-number-right-bottom">+0</span>}
              {selectedDecisionTriangles.includes('t3') && <span className="triangle-number-right-bottom">+0</span>}
            </div>
            <div 
              className={`triangle-left ${highlightedTriangles.includes('t4') ? 'highlight' : 
              hoveredTriangles.includes('t4') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t4') ? 'highlight3' : ''}`} 
              onMouseEnter={() => setHoveredTriangles(['t4', 't7'])} // Set hovered triangles on mouse enter
              onMouseLeave={() => setHoveredTriangles([])} // Clear hovered triangles on mouse leave
            >
              {highlightedTriangles.includes('t4') && <span className="triangle-number-left-bottom">{triangleNumbers.t4}</span>}
              {hoveredTriangles.includes('t4') && <span className="triangle-number-left-bottom">+1</span>}
              {selectedDecisionTriangles.includes('t4') && <span className="triangle-number-left-bottom">+1</span>}
            </div>
          </div>
          <div className="column-3">
          <div 
              className={`triangle-right ${highlightedTriangles.includes('t5') ? 'highlight' : 
              hoveredTriangles.includes('t5') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t5') ? 'highlight3' : ''}`} 
              onMouseEnter={() => setHoveredTriangles(['t2', 't5'])} // Set hovered triangles on mouse enter
              onMouseLeave={() => setHoveredTriangles([])} // Clear hovered triangles on mouse leave
            >
              {highlightedTriangles.includes('t5') && <span className="triangle-number-right-up">{triangleNumbers.t5}</span>}
              {hoveredTriangles.includes('t5') && <span className="triangle-number-right-up">+3</span>}
              {selectedDecisionTriangles.includes('t5') && <span className="triangle-number-right-up">+3</span>}
              <span className={`user-cooperate-label ${highlightedDesc.userCooperate ? 'highlight-game' : ''}`}>YOU SHARE</span>
            </div>
            <div 
              className={`triangle-left ${highlightedTriangles.includes('t6') ? 'highlight' : 
              hoveredTriangles.includes('t6') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t6') ? 'highlight3' : ''}`} 
              onMouseEnter={() => setHoveredTriangles(['t6', 't8'])} // Set hovered triangles on mouse enter
              onMouseLeave={() => setHoveredTriangles([])} // Clear hovered triangles on mouse leave
            >
              {highlightedTriangles.includes('t6') && <span className="triangle-number-left-up">{triangleNumbers.t6}</span>}
              {hoveredTriangles.includes('t6') && <span className="triangle-number-left-up">+0</span>}
              {selectedDecisionTriangles.includes('t6') && <span className="triangle-number-left-up">+0</span>}
            </div>
            <div 
              className={`triangle-right ${highlightedTriangles.includes('t7') ? 'highlight' : 
              hoveredTriangles.includes('t7') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t7') ? 'highlight3' : ''}`} 
              onMouseEnter={() => setHoveredTriangles(['t4', 't7'])} // Set hovered triangles on mouse enter
              onMouseLeave={() => setHoveredTriangles([])} // Clear hovered triangles on mouse leave
            >
              {highlightedTriangles.includes('t7') && <span className="triangle-number-right-bottom">{triangleNumbers.t7}</span>}
              {hoveredTriangles.includes('t7') && <span className="triangle-number-right-bottom">+1</span>}
              {selectedDecisionTriangles.includes('t7') && <span className="triangle-number-right-bottom">+1</span>}
            </div>
          </div>
          <div className="column-4">
          <div 
              className={`triangle-right ${highlightedTriangles.includes('t8') ? 'highlight' : 
              hoveredTriangles.includes('t8') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t8') ? 'highlight3' : ''}`} 
              onMouseEnter={() => setHoveredTriangles(['t6', 't8'])} // Set hovered triangles on mouse enter
              onMouseLeave={() => setHoveredTriangles([])} // Clear hovered triangles on mouse leave
            >
              {highlightedTriangles.includes('t8') && <span className="triangle-number-right-up">{triangleNumbers.t8}</span>}
              {hoveredTriangles.includes('t8') && <span className="triangle-number-right-up">+5</span>}
              {selectedDecisionTriangles.includes('t8') && <span className="triangle-number-right-up">+5</span>}
              <span className={`user-defect-label ${highlightedDesc.userDefect ? 'highlight-game' : ''}`}>YOU WITHHOLD</span>
            </div>
          </div>
          <div className="column-5">
            <div className="triangle-left-5"></div>
          </div>

          <div className="user-score">
            {/* <div className="user-message">
              {userMessage}
            </div>
            <h2>Your Score: <span className="score-value">{userScore}</span></h2>
            <p className="ai-decision">You chose: {userDecision}</p> */}
            <button className={`proceed-button defect ${(isRoundOver && userDecision === "Cooperate") ? 'hidden' : ''}`} ref={defectButtonRef} onClick={() => {handleUserDecision('Defect');}}>
              WITHHOLD
              <div>(defect)</div>
            </button>
          </div>
        </div>
        <div id="actions">
          <button 
            id="proceed-chat" 
            className="go-to-chat"
            onClick={() => handleChatNavigation()}
            style={isRoundOver ? { visibility: 'hidden' } : {}}
          >
            Go to Chat
          </button>
          <div id="scoreboard" className='scoreboard'>
            <div className="trapezoid ai-trapezoid">AI</div>
            <div className="score" id="ai-score"><div className={isScoresLocked ? `score-wrap-shake` : ''}>{
              aiScore && aiScore.toString().split('').map((digit, index) => (
                <span key={index}>{digit}</span>
              ))}</div>
            </div>
            {isRoundOver ? <div className="ai-final-decision">
              {aiDecision === "Defect" ? "WITHHELD".split('').map((digit, index) => (
                <span key={index}>{digit}</span>
              )) : "SHARED".split('').map((digit, index) => (
                <span key={index}>{digit}</span>
              ))}
            </div> : <div className="ai-temp-decision">Deciding...</div>}
            {isUserLocked ? <div className="user-final-decision">
              {userDecision === "Defect" ? "WITHHELD".split('').map((digit, index) => (
                <span key={index}>{digit}</span>
              )) : "SHARED".split('').map((digit, index) => (
                <span key={index}>{digit}</span>
              ))}
            </div> : <div className="user-temp-decision">{userDecision === "Defect" ? "Withhold?" : userDecision === "Cooperate" ? "Share?" : "Deciding..."}</div>}
            <div className="score" id="user-score"><div className={isScoresLocked ? `score-wrap-shake` : ''}>{
              userScore && userScore.toString().split('').map((digit, index) => (
                <span key={index}>{digit}</span>
              ))}</div>
            </div>
            <div className="trapezoid user-trapezoid">You</div>
          </div>
          {!isRoundOver ? (
            <div className="next-buttons-container">
              <br></br>
              {errorMessage && <div className="error-message2">{errorMessage}</div>}
              <button className={`next-buttons ${errorMessage ? 'error-shake2' : ''}`} id="lockin-button" onClick={() => handleLockIn()}>
                Lock In
              </button>
            </div>
          ) : (
            <button className={`next-buttons ${isScoresLocked ? '' : 'hidden'}`} id="lockin-button" onClick={() => handleNavigation()}> {/* round up */ }
              Proceed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;