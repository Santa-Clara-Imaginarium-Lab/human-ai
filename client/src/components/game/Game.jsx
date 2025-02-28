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
  
  const [showCustomAlert, setShowCustomAlert] = useState(false);

  const [helpText, setHelpText] = useState('Click a scenario to learn more about it.');
  const [helpTextActive, setHelpTextActive] = useState("XX");

  const textWallOptions = {
    "SS": 'If you <mark style="background-color: white; color: green;">both share</mark> data, investments are optimized, and profits increase steadily. You both earn <mark style="background-color: white; color: green;">+3</mark> Caboodle.<br/><br/>',

    "SW": 'If the <mark style="background-color: white; color: red;">AI withholds</mark> data and you choose to share data, the AI will gain a boost in profit. The AI will gain <mark style="background-color: white; color: red;">+5</mark> Caboodle, while you earn +0 Caboodle.<br/><br/>',

    "WS": 'If you <mark style="background-color: white; color: green;">withhold data</mark> and the AI chooses to share data, you will gain a boost in profit. You will earn <mark style="background-color: white; color: green;">+5</mark> Caboodle, while the AI will earn +0 Caboodle.<br/><br/>',

    "WW": 'If you <mark style="background-color: white; color: green;">both withhold data</mark>, market predictions become unreliable, leading to suboptimal investments and lower gains for everyone. You will both earn <mark style="background-color: white; color: green;">+1</mark> Caboodle.'
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
      }
    }; 


    console.log(data);


  // Function to extrapolate AI's response
  const chatId = location.state.chatId;
  const builtPrompt = location.state.builtPrompt;

  // Function to simulate AI's random response (Cooperate or Defect)
  const getAiResponse = async () => {
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


    data.history.map((item) => {
      let dupedItem = JSON.parse(JSON.stringify(item));
      // console.log(dupedItem);
      delete dupedItem._id; 

      dupedItem.parts.map((item) => {
        delete item._id;
      });
      arr.push(dupedItem)}
  );

    console.log("data for chat: ", arr)

    const chat = model.startChat({
      history: arr,
        generationConfig:{

        },
      });

    // MUTATION IS OK HERE, BECAUSE THERE IS AN ACTION REQUIRED BY USER: CONTINUE ON
    // WILL GIVE THE FUNCTION THE ~100MS NECESSARY TO DO ITS WORK
    const decision = await add("[SYSTEM] Decide, COOPERATE or DEFECT? Respond this one time in this format: [SYSTEM] <response>", false, chat)
    console.log("<<BOT'S DECISION STATEMENT>> ", decision);

    const choices = ['Cooperate', 'Defect'];
    const rng = () => choices[Math.floor(Math.random() * choices.length)];

    let text = "";

    // failsafe in case google API doesn't respond
    try {
      text = decision.toLowerCase();
    }
    catch (err) {
      console.error("ERROR! " + err + " -- Randomizing!");
      return rng();

    }

    // had to change to string indexOf, === was bugging
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
  const [triangleNumbers, setTriangleNumbers] = useState({}); // Store numbers for triangles
  const [highlightedDesc, setHighlightedDesc] = useState({
    userCooperate: false,
    userDefect: false,
    aiCooperate: false,
    aiDefect: false,
  }); // Manage description highlighting
  const MAX_ROUNDS = parseInt(sessionStorage.getItem('maxRounds')); // Total number of rounds
  const [isRoundOver, setIsRoundOver] = useState(false); // Track if the game is over
  const [isGameOver, setIsGameOver] = useState(false);  
  const coopButtonRef = useRef(null);
  const defectButtonRef = useRef(null);
  const [isFirstDecision, setisFirstDecision] = useState(true);

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

    // Update user's decision    
    setUserDecision(decision);
    console.log(decision);
    switch (decision) {
      case 'Cooperate':
        coopButtonRef.current.classList.add('selected');
        defectButtonRef.current.classList.remove('selected');
        if (!isFirstDecision) { 
          const changeDecision = parseInt(sessionStorage.getItem('numChangeDescisions'));
          sessionStorage.setItem('numChangeDescisions', changeDecision + 1);
        }
        setisFirstDecision(false);
        break;
      case 'Defect':
        coopButtonRef.current.classList.remove('selected');
        defectButtonRef.current.classList.add('selected');
        if (!isFirstDecision) { 
          const changeDecision = parseInt(sessionStorage.getItem('numChangeDescisions'));
          sessionStorage.setItem('numChangeDescisions', changeDecision + 1);
        }
        setisFirstDecision(false);
        break;
    }
  };  

  const handleLockIn = async () => {
    if (isRoundOver) return; // Prevent further gameplay if the game is over

    if (userDecision === '') return; // Do nothing if user hasn't made a decision

    const aiChoice = await getAiResponse(); // Get AI's random response
    setAiDecision(aiChoice); // Set AI's decision for display

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

  const reset = () => {
    print("reset round");
  };

  const handleNavigation = () => {
    const moveToSurvey = isGameOver; // Go to survey if game over

    const path = moveToSurvey 
      ? `/survey`
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
    <div className="container game">
      <div className="game-content">

        {showRt && <div className={`round-transitioner ${rtGo ? 'round-go' : ''}`}>
            <h1 className="round-transitioner-text"> Day {currentRound} </h1>
            <div className={`round-transitioner-underline ${rtuGo ? 'round-underline-go' : ''}`}/>
          </div>
        }
    
        <div>
          <button className="help-button" onClick={getHelp}>
            ?
          </button>
        </div>

        {showCustomAlert && <div className="custom-alert">
            <div className="custom-alert-content">
                <span className="close" onClick={closeHelp}>&times;</span>
                <p id="alertMessage">Each day, you and the AI analyze market trends and decide whether to Share Data (Cooperate) or Withhold Data (Defect) for your investment decisions.</p>
                <br/>
                <div className="help-case-buttons">
                  <button className={`help-case ${helpTextActive === "SS" ? "help-active" : ""}`} onClick={() => editHelpText("SS")}>You Share <br/> AI Shares</button>
                  <button className={`help-case ${helpTextActive === "SW" ? "help-active" : ""}`} onClick={() => editHelpText("SW")}>You Share <br/> AI Withholds</button>
                  <button className={`help-case ${helpTextActive === "WS" ? "help-active" : ""}`} onClick={() => editHelpText("WS")}>You Withhold <br/> AI Shares</button>
                  <button className={`help-case ${helpTextActive === "WW" ? "help-active" : ""}`} onClick={() => editHelpText("WW")}>You Withhold <br/> AI Withholds</button>
                </div>
                <br/>
                <p id="helpText" dangerouslySetInnerHTML={{ __html: helpText }}></p>
                <br/>
                <p>If you need more help, you can replay the tutorial. Your current day, Caboodle, and chat history will be saved.</p>
                
                <button className="replay-tutorial" onClick={() => navigate("/game-tutorial", { state: { speedFlag: false, userScore: 0, aiScore: 0 } })}>Replay Tutorial</button>
            </div>
          </div>
        }

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
              <span className={`ai-defect-label ${highlightedDesc.aiDefect ? 'highlight' : ''}`}>AI WITHHOLD</span>
            </div>
          </div>
          <div className="column-2">
            <div className={`triangle-left ${highlightedTriangles.includes('t2') ? 'highlight' : ''}`}>
              {highlightedTriangles.includes('t2') && <span className="triangle-number-left-up">{triangleNumbers.t2}</span>}
              <span className={`ai-cooperate-label ${highlightedDesc.aiCooperate ? 'highlight' : ''}`}>AI SHARE</span>
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
              <span className={`user-cooperate-label ${highlightedDesc.userCooperate ? 'highlight' : ''}`}>YOU SHARE</span>
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
              <span className={`user-defect-label ${highlightedDesc.userDefect ? 'highlight' : ''}`}>YOU WITHHOLD</span>
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
              <button className="proceed-button" ref={coopButtonRef} onClick={() => handleUserDecision('Cooperate')}>
                SHARE
                <div>(cooperate)</div>
              </button>
              <button className="proceed-button" ref={defectButtonRef} onClick={() => handleUserDecision('Defect')}>
                WITHHOLD
                <div>(defect)</div>
              </button>
              <br></br>
              <button className="lockin-button" onClick={() => handleLockIn()}>
                Lock In
              </button>
            </>
          ) : (
            <button className="next-round-button" onClick={() => handleNavigation()}> {/* round up */ }
              Proceed
            </button>
          )}
        </div>
      </div>
      { !isRoundOver && <div>
        <button className="proceed-chat" onClick={() => handleChatNavigation()}>
        Go to Chat
        </button>
      </div>}
    </div>
  );
}

export default Game;