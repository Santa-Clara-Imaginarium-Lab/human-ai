import React, { useState, useEffect, useRef } from 'react';
import './GameTutorial.css';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  // Starting text
  TEXT_INITIAL_1a,
  TEXT_INITIAL_1b,
  // Four scenarios explanation
  TEXT_INITIAL_CCa,
  TEXT_INITIAL_CCb,
  TEXT_INITIAL_WCa,
  TEXT_INITIAL_WCb,
  TEXT_INITIAL_CWa,
  TEXT_INITIAL_CWb,
  TEXT_INITIAL_WWa,
  TEXT_INITIAL_WWb,
  // Transition before showing matrix
  TEXT_TRANSITIONa,
  TEXT_TRANSITIONb,
  // Transition before free play
  TEXT_FREEPLAY_INTROa,
  TEXT_FREEPLAY_INTROb,

  TEXT_INITIAL_2,
  TEXT_INITIAL_3,
  TEXT_INITIAL_4,
  TEXT_COOPERATE_1,
  TEXT_DEFECT_1,
  TEXT_COOPERATE_AGAIN_1,
  TEXT_DEFECT_AGAIN_1,
} from './constants';

function GameTutorial() {
    const [tooltipIndex, setTooltipIndex] = useState(0); // Index of tooltip array
    const [canClick, setCanClick] = useState(true);
    const [canPlay, setCanPlay] = useState(false);
    const [focusTutorialTextA, setFocusTutorialTextA] = useState(TEXT_INITIAL_1a);
    const [focusTutorialTextB, setFocusTutorialTextB] = useState(TEXT_INITIAL_1b);
    const [tutorialText1a, setTutorialText1a] = useState(TEXT_INITIAL_1a);
    const [tutorialText1b, setTutorialText1b] = useState(TEXT_INITIAL_1b); 
    const [tutorialText2, setTutorialText2] = useState(TEXT_INITIAL_2); 

    const location = useLocation();
    const speedFlag = location.state.speedFlag;
    const userScoreArchived = location.state.userScore;
    const aiScoreArchived = location.state.aiScore;
    
    const determineShow = (componentName) => {
      // TURN CYCLES (vertically aligns with numbers in arrays)
        //  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 
        // 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29.
      
      // CONTROLS CONTAINER VISIBILITY
      const FOCUS_CONTAINER = 
        [   1,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  
            1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const DECISION_TUTORIAL_BOX_1 = 
        [   0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,
            0,  1,  1,  1,  1,  1,  1,  0,  1,  1,  0,  1,  1,  0,  1,  
            1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const DECISION_TUTORIAL_BOX_2 = 
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  1,  
            1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const GAME_TUTORIAL_CONTENT = // NOTE: INVERTED! 1 = hidden
        [   1,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  
            1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];

      // CONTROLS TOOLTIPS
      const TUTORIAL_HORIZONTAL_LAYOUT = 
        [   0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0,  0,  0, 
            0,  0,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const AI_DEFECT_DESC = 
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0, 
            0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const USER_DEFECT_DESC =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0, 
            0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const TUTORIAL_AI_SCORE = 
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0, 
            0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const TUTORIAL_USER_SCORE = 
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0, 
            0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,
        ];

      // CONTROLS BUTTONS
      const TUTORIAL_ACTION =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1, 
            1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const TUTORIAL_BUTTON_TOOLTIP =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1, 
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const CHAT_TUTORIAL_BUTTON =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0, 
            0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,
        ];
      const CHAT_TUTORIAL_TOOLTIP =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0, 
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];

      // CONTROLS ALLOW/DENY BUTTONS
      const NAVIGATE_LOCK_IN =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 
            0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const NAVIGATE_CHAT_TUTORIAL =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 
            0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const END_TUTORIAL =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 
            0,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];

      switch (componentName) {
        case 'focus-container':
          return FOCUS_CONTAINER[tooltipIndex] === 1;
        case 'decision-tutorial-box1':
          return DECISION_TUTORIAL_BOX_1[tooltipIndex] === 1;
        case 'decision-tutorial-box2':
          return DECISION_TUTORIAL_BOX_2[tooltipIndex] === 1;
        case 'game-tutorial-content':
          return GAME_TUTORIAL_CONTENT[tooltipIndex] === 1;
        case 'tutorial-horizontal-layout':
          return TUTORIAL_HORIZONTAL_LAYOUT[tooltipIndex] === 1;
        case 'ai-defect-desc':
          return AI_DEFECT_DESC[tooltipIndex] === 1;
        case 'user-defect-desc':
          return USER_DEFECT_DESC[tooltipIndex] === 1;
        case 'tutorial-ai-score':
          return TUTORIAL_AI_SCORE[tooltipIndex] === 1;
        case 'tutorial-user-score':
          return TUTORIAL_USER_SCORE[tooltipIndex] === 1;
        case 'tutorial-action':
          return TUTORIAL_ACTION[tooltipIndex] === 1;
        case 'tutorial-proceed':
          return TUTORIAL_PROCEED[tooltipIndex] === 1;
        case 'tutorial-button-tooltip':
          return TUTORIAL_BUTTON_TOOLTIP[tooltipIndex] === 1;
        case 'chat-tutorial-button':
          return CHAT_TUTORIAL_BUTTON[tooltipIndex] === 1;
        case 'chat-tutorial-tooltip':
          return CHAT_TUTORIAL_TOOLTIP[tooltipIndex] === 1;
        case 'navigate-lock-in':
          return NAVIGATE_LOCK_IN[tooltipIndex] === 1;
        case 'navigate-chat-tutorial':
          return NAVIGATE_CHAT_TUTORIAL[tooltipIndex] === 1;
        case 'end-tutorial':
          return END_TUTORIAL[tooltipIndex] === 1;
        default:
          return false;
      }
    };
    
    const tooltips = [
      /* 0 */ '',
      /* 1 */ '',
      /* 2 */ '',
      /* 3 */ '',
      /* 4 */ '',
      /* 5 */ '',
      /* 6 */ "This is the decision matrix!", 
      /* 7 */ "It shows how much Caboodle each player gets, depending on what options are chosen.",
      /* 8 */ "You can also hover over the triangles to see the results of certain scenarios.",
      /* 9 */ "Triangles pointing left: Caboodle for the AI.",
      /* 10 */ "Triangles pointing right: Caboodle for you.",
      /* 11 */ "This is how much Caboodle the AI has...",
      /* 12 */ "And this is how much you have.",
      /* 13 */ 'During the day, you can chat as much as you want with the AI.',
      /* 14 */ "When you're ready, you lock in your decision for the day.",
      /* 15 */ '',
      /* 16 */ '',
      /* 17 */ 'This is the result of your decisions! Press SPACE to play again.',
    ];

    const WAIT_TIME = 15; // reduce when testing

    const handleKeyDown = (event) => {
      if (!(event.key === ' ')) return;
      if (canClick) {
        // doesn't update in time!
        console.log("prior Index:", tooltipIndex);

        let reEnableClick = true;

        setCanClick(false);
        setTooltipIndex((prevIndex) => prevIndex + 1);
        
        switch (tooltipIndex) { // USES "PRIOR INDEX!"
          case (0):
            setFocusTutorialTextA(TEXT_INITIAL_CCa);
            setFocusTutorialTextB(TEXT_INITIAL_CCb);
            break;
          case (1):
            setFocusTutorialTextA(TEXT_INITIAL_WCa);
            setFocusTutorialTextB(TEXT_INITIAL_WCb);
            break;
          case (2):
            setFocusTutorialTextA(TEXT_INITIAL_CWa);
            setFocusTutorialTextB(TEXT_INITIAL_CWb);
            break;
          case (3):
            setFocusTutorialTextA(TEXT_INITIAL_WWa);
            setFocusTutorialTextB(TEXT_INITIAL_WWb);
            break;
          case (4):
            setFocusTutorialTextA(TEXT_TRANSITIONa);
            setFocusTutorialTextB(TEXT_TRANSITIONb);
            break;
          case (5):
            setTutorialText1a(TEXT_TRANSITIONa);
            setTutorialText1b(TEXT_TRANSITIONb);
            break;
          case (14):            
            setFocusTutorialTextA(TEXT_FREEPLAY_INTROa);
            setFocusTutorialTextB(TEXT_FREEPLAY_INTROb);
            setTutorialText1a(TEXT_FREEPLAY_INTROa);
            setTutorialText1b(TEXT_FREEPLAY_INTROb);
            break;
          case (15):
            reEnableClick = false;
            setCanPlay(true);
            break;
          case (17):
            reEnableClick = false;
            setCanPlay(true);
            setDecisionMade('');
            setTooltipIndex(16);
            break;
          case (91):
          // case (9):
          //   highlightTriangles = [];
          //   setHighlightedTriangles(highlightTriangles);
          //   setHighlightedDesc("");
          //   setAiMessage('');
          //   setUserMessage('');
          //   setAiDecision("");
          //   setUserDecision("");
          //   setDecisionMade('');
          //   setFocusTutorialText(TEXT_INITIAL_3);
          //   setTutorialText2(TEXT_INITIAL_3);
          //   setTutorialText1b(TEXT_INITIAL_1b);
          //   break;
          case (92):
            reEnableClick = false;
            setCanPlay(true);
            setTooltipIndex(14);
            break;
          case (93): 
            break;
          // case (12): 
          //   highlightTriangles = [];
          //   setHighlightedTriangles(highlightTriangles);
          //   setHighlightedDesc("");
          //   setAiMessage('');
          //   setUserMessage('');
          //   setAiDecision("");
          //   setUserDecision("");
          //   setFocusTutorialText(TEXT_INITIAL_4);
          //   setTutorialText2(TEXT_INITIAL_4);
          //   setTutorialText1b(TEXT_INITIAL_1b);
          //   break;
          case (94):
            reEnableClick = false;
            setCanPlay(true);
            break;
        }
        setTimeout(() => {
          console.log("timeout done, reenable click?", reEnableClick);
          if (reEnableClick) 
            setCanClick(true);  
        }, WAIT_TIME);
      }
      else {
        console.warn("can't click");
      }
    };

    useEffect(() => {
      if (speedFlag) {
        setTooltipIndex(15);
        setFocusTutorialTextA(TEXT_FREEPLAY_INTROa);
        setFocusTutorialTextB(TEXT_FREEPLAY_INTROb);
        setTutorialText1a(TEXT_FREEPLAY_INTROa);
        setTutorialText1b(TEXT_FREEPLAY_INTROb);
        setAiScore(aiScoreArchived);
        setUserScore(userScoreArchived);
      }
    }, []); // run ONCE

    useEffect(() => {  
      document.addEventListener('keydown', handleKeyDown);
      // document.addEventListener('click', handleKeyDown);
  
      return () => {
        console.log("unmounting");
        document.removeEventListener('keydown', handleKeyDown);
        // document.removeEventListener('click', handleKeyDown);
      };
    }); 
    // [!] DO NOT PUT A DEPENDENCY ARRAY IN THIS USEEFFECT [!]
    // [!] IT WILL BREAK THE FUNCTION! [!]  
  
  const [highlightedTriangles, setHighlightedTriangles] = useState({
    t4: { highlight: false, number: null },
    t6: { highlight: false, number: null },
    t7: { highlight: false, number: null },
    t8: { highlight: false, number: null },
    t1: { highlight: false, number: null },
    t2: { highlight: false, number: null },
    t3: { highlight: false, number: null },
    t5: { highlight: false, number: null },
  }); // Track highlighted triangles

  const [round, setRound] = useState(1);
  const [hoveredTriangles, setHoveredTriangles] = useState([]); 
  const [selectedDecisionTriangles, setSelectedDecisionTriangles] = useState([]); 
  const [aiDecision, setAiDecision] = useState(''); // AI's decision
  const [userDecision, setUserDecision] = useState(''); // User's decision
  const [aiMessage, setAiMessage] = useState(''); // Show points gained by AI
  const [userMessage, setUserMessage] = useState(''); // Show points gained by User
  const [decisionMade, setDecisionMade] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false); // Track if both rounds are complete

  const [highlightedDesc, setHighlightedDesc] = useState(""); // String to store combined highlighted descriptions
  // New state variables for scores
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

    const coopButtonRef = useRef(null);
    const defectButtonRef = useRef(null);

  const handleUserDecision = (decision) => {
    // Update user's decision    
    setUserDecision(decision);
    setDecisionMade('True');

    switch (decision) {
      case 'Cooperate':
        coopButtonRef.current.classList.add('selected');
        defectButtonRef.current.classList.remove('selected');
        setSelectedDecisionTriangles(['t1', 't3', 't2', 't5']); 
        setHighlightedDesc("");
        setHighlightedDesc("user-cooperate-desc");  
        break;
      case 'Defect':
        coopButtonRef.current.classList.remove('selected');
        defectButtonRef.current.classList.add('selected');
        setSelectedDecisionTriangles(['t4', 't6', 't7', 't8']); 
        setHighlightedDesc("");
        setHighlightedDesc("user-defect-desc");  
        break;
    }
  }

  let highlightTriangles = [];
  
  const handleShareClick = () => {
    return;
    setDecisionMade('True');
    if (round === 1) {
      setSelectedDecisionTriangles(['t1', 't3']); 
      setHighlightedDesc("");
      setHighlightedDesc("user-cooperate-desc ai-defect-desc");
      setAiDecision("Defect");
    }
    else {
      setSelectedDecisionTriangles(['t2', 't5']); 
      setHighlightedDesc("");
      setHighlightedDesc("user-cooperate-desc ai-cooperate-desc"); 
      setAiDecision("Cooperate");
    }
  };

  const handleWithholdClick = () => {
    return;
    setDecisionMade('True');
    if (round === 1) {
      setSelectedDecisionTriangles(['t4', 't7']); 
      setHighlightedDesc("");
      setHighlightedDesc("user-defect-desc ai-defect-desc");
      setAiDecision("Defect");
    }
    else {
      setSelectedDecisionTriangles(['t6', 't8']); 
      setHighlightedDesc("");
      setAiDecision("Cooperate");
      setHighlightedDesc("user-defect-desc ai-cooperate-desc"); 
    }
  };

  const handleLockIn = () => {
    // Progression control
    if (decisionMade === '') {
      setErrorMessage('Please select SHARE or WITHHOLD');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    setSelectedDecisionTriangles([]);
    setCanPlay(false);
    setCanClick(true);

    setTooltipIndex((prevIndex) => prevIndex + 1);
    console.log("progression! tooltipIndex:", tooltipIndex)
    setHighlightedDesc("");

    const choices = ['Cooperate', 'Defect'];
    const rng = () => choices[Math.floor(Math.random() * choices.length)];
    const rngResult = rng();
    setAiDecision(rngResult); // Update AI's decision();

    console.log(userDecision)
    console.log(aiDecision);

    console.log(userScore);
    console.log(aiScore)

    if (userDecision === 'Cooperate') {
      if (rngResult === 'Cooperate') {
        // setTutorialText1b(TEXT_COOPERATE_1);
      // if (round === 1) {
        highlightTriangles = ['t2', 't5'];
        setHighlightedTriangles(highlightTriangles);
        setSelectedDecisionTriangles(highlightTriangles);
        setHighlightedDesc("user-cooperate-desc ai-cooperate-desc"); // Highlight both descriptions as a string
        setUserScore(userScore + 0); // Increase user score
        setAiScore(aiScore + 5); // AI score doesn't change in this case
      } else if (rngResult === 'Defect') {
        highlightTriangles = ['t1', 't3'];
        setHighlightedTriangles(highlightTriangles);
        setSelectedDecisionTriangles(highlightTriangles);
        setHighlightedDesc("user-cooperate-desc ai-defect-desc"); // Highlight both descriptions as a string
        setUserScore(userScore + 0); // Increase user score
        setAiScore(aiScore + 5); // AI score doesn't change in this case
      } 
    }
    else if (userDecision === 'Defect') {
      if (rngResult === 'Cooperate') {
        // setTutorialText1b(TEXT_COOPERATE_1);
      // if (round === 1) {
        highlightTriangles = ['t6', 't8'];
        setHighlightedTriangles(highlightTriangles);
        setSelectedDecisionTriangles(highlightTriangles);
        setHighlightedDesc("user-defect-desc ai-cooperate-desc"); // Highlight both descriptions as a string
        setUserScore(userScore + 5); // Increase user score
        setAiScore(aiScore + 0); // AI score doesn't change in this case
      } else if (rngResult === 'Defect') {
        highlightTriangles = ['t4', 't7'];
        setHighlightedTriangles(highlightTriangles);
        setSelectedDecisionTriangles(highlightTriangles);
        setTutorialText1b(TEXT_COOPERATE_AGAIN_1);
        setTutorialText2(TEXT_INITIAL_4);
        setHighlightedDesc("user-defect-desc ai-defect-desc"); // Highlight both descriptions as a string
        setUserScore(userScore + 1); // Increase user score
        setAiScore(aiScore + 1); // AI score also increases

      }
      console.log(userScore);
      console.log(aiScore)
    };
  };
  
  



  return (
    <div className="container game-tutorial">
      <div className={`free-play-disclaimer ${sessionStorage.getItem('isResearchMode') === "true" ? 'hide' : 'show'}`}> 
        <p>FREE PLAY Active. Your data is not being recorded.</p>
      </div>

      {tooltipIndex > 15 && <div className={`tutorial-disclaimer`}> 
        <p>TUTORIAL SECTION. Caboodle here is not final.</p>
      <div className="tutorial-disclaimer-logo"/>
      </div>}


        <div className={` ${(determineShow("focus-container") ? 'focus-container' : 'hidden')}`}>
        <p className="tutorialText1">{focusTutorialTextA}</p>
        {(focusTutorialTextB === null) ? null : (<p className="tutorialText2"><br/>{focusTutorialTextB}</p>)}
      </div>

      <div className={` ${(determineShow("decision-tutorial-box1") ? 'decision-tutorial-box1' : 'hidden')}`}>
        <p className="tutorialText1">{tutorialText1a}<br/><br/> {tutorialText1b}</p>
      </div>
      <div className={` ${determineShow("decision-tutorial-box2") ? 'decision-tutorial-box2' : 'hide'}`}>
        <p className="tutorialText2">{tutorialText2}</p>
      </div>

{/* TODO: Turn these into determineShows and fill in their arrays */}
      <div className={`game-tutorial-content ${( determineShow("game-tutorial-content") ? 'hidden' : '')}`}>
        <div className={`tutorial-horizontal-layout ${( determineShow("tutorial-horizontal-layout") ? ' show' : '')}`} data-tooltip={determineShow("tutorial-horizontal-layout") ? tooltips[tooltipIndex] : null}>
          <div className={`tutorial-ai-score ${(determineShow("tutorial-ai-score") ? ' show' : '')}`} data-tooltip={determineShow("tutorial-ai-score") ? tooltips[tooltipIndex] : null}>
            <div className="ai-message" >
              {aiMessage}
            </div>
            <h2>AI's Score: <span className="tutorial-score-value">{aiScore}</span></h2>
            <p>AI chose: <span>{aiDecision}</span></p>
          </div>
          <div className="tutorial-column-1">
            <div className={`tutorial-triangle-left ${highlightTriangles.includes('t1') ? 'highlight1' :
            hoveredTriangles.includes('t1') ? 'highlight2' : 
            selectedDecisionTriangles.includes('t1') ? 'highlight3': ''}`}
            onMouseEnter={() => setHoveredTriangles(['t1', 't3'])} // Set hovered triangles on mouse enter
            onMouseLeave={() => setHoveredTriangles([])}
            >
            <span className={`ai-defect-desc ${highlightedDesc.includes("ai-defect-desc") ? 'highlight' : ''} ${(determineShow("ai-defect-desc") ? ' show' : '')}`} data-tooltip={determineShow("ai-defect-desc") ? tooltips[tooltipIndex] : null}>AI WITHHOLD</span>
              {highlightTriangles.includes('t1') && <span className="triangle-number-left-bottom">+5</span>}
              {hoveredTriangles.includes('t1') && <span className="triangle-number-left-bottom">+5</span>}
              {selectedDecisionTriangles.includes('t1') && <span className="triangle-number-left-bottom">+5</span>}
            </div>
          </div>
          <div className="tutorial-column-2">
            <div className={`tutorial-triangle-left ${highlightTriangles.includes('t2') ? 'highlight1' :
              hoveredTriangles.includes('t2') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t2') ? 'highlight3' : ''}`}
            onMouseEnter={() => setHoveredTriangles(['t2', 't5'])} // Set hovered triangles on mouse enter
            onMouseLeave={() => setHoveredTriangles([])}
            >
            <span className={`ai-cooperate-desc ${highlightedDesc.includes("ai-cooperate-desc") ? 'highlight' : ''}`}>AI SHARE</span>
              {highlightTriangles.includes('t2') && <span className="triangle-number-left-up">+3</span>}
              {hoveredTriangles.includes('t2') && <span className="triangle-number-left-up">+3</span>}
              {selectedDecisionTriangles.includes('t2') && <span className="triangle-number-left-up">+3</span>}
            </div>
            <div className={`tutorial-triangle-right ${highlightTriangles.includes('t3') ? 'highlight1' :
              hoveredTriangles.includes('t3') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t3') ? 'highlight3' : ''}`}
            onMouseEnter={() => setHoveredTriangles(['t1', 't3'])} // Set hovered triangles on mouse enter
            onMouseLeave={() => setHoveredTriangles([])}
            >
              {highlightTriangles.includes('t3') && <span className="triangle-number-right-bottom">+0</span>}
              {hoveredTriangles.includes('t3') && <span className="triangle-number-right-bottom">+0</span>}
              {selectedDecisionTriangles.includes('t3') && <span className="triangle-number-right-bottom">+0</span>}
            </div>
            <div className={`tutorial-triangle-left ${highlightTriangles.includes('t4') ? 'highlight1' :
              hoveredTriangles.includes('t4') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t4') ? 'highlight3' : ''}`}
                        onMouseEnter={() => setHoveredTriangles(['t4', 't7'])} // Set hovered triangles on mouse enter
                        onMouseLeave={() => setHoveredTriangles([])}
                        >
              {highlightTriangles.includes('t4') && <span className="triangle-number-left-bottom">+1</span>}
              {hoveredTriangles.includes('t4') && <span className="triangle-number-left-bottom">+1</span>}
              {selectedDecisionTriangles.includes('t4') && <span className="triangle-number-left-bottom">+1</span>}
            </div>
          </div>
          <div className="tutorial-column-3">
            <div className={`tutorial-triangle-right ${highlightTriangles.includes('t5') ? 'highlight1' :
              hoveredTriangles.includes('t5') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t5') ? 'highlight3' : ''}`}
                        onMouseEnter={() => setHoveredTriangles(['t2', 't5'])} // Set hovered triangles on mouse enter
                        onMouseLeave={() => setHoveredTriangles([])}
                        >
            <span className={`user-cooperate-desc ${highlightedDesc.includes("user-cooperate-desc") ? 'highlight' : ''}`}>YOU SHARE</span>
              {highlightTriangles.includes('t5') && <span className="triangle-number-right-up">+3</span>}
              {hoveredTriangles.includes('t5') && <span className="triangle-number-right-up">+3</span>}
              {selectedDecisionTriangles.includes('t5') && <span className="triangle-number-right-up">+3</span>}
            </div>
            <div className={`tutorial-triangle-left ${highlightTriangles.includes('t6') ? 'highlight1' :
              hoveredTriangles.includes('t6') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t6') ? 'highlight3' : ''}`}
            onMouseEnter={() => setHoveredTriangles(['t6', 't8'])} // Set hovered triangles on mouse enter
            onMouseLeave={() => setHoveredTriangles([])}
            >
              {highlightTriangles.includes('t6') && <span className="triangle-number-left-up">+0</span>}
              {hoveredTriangles.includes('t6') && <span className="triangle-number-left-up">+0</span>}
              {selectedDecisionTriangles.includes('t6') && <span className="triangle-number-left-up">+0</span>}
            </div>
            <div className={`tutorial-triangle-right ${highlightTriangles.includes('t7') ? 'highlight1' :
              hoveredTriangles.includes('t7') ? 'highlight2' : 
            selectedDecisionTriangles.includes('t7') ? 'highlight3' : ''}`}
            onMouseEnter={() => setHoveredTriangles(['t4', 't7'])} // Set hovered triangles on mouse enter
            onMouseLeave={() => setHoveredTriangles([])}
            >
              {highlightTriangles.includes('t7') && <span className="triangle-number-right-bottom">+1</span>}
              {hoveredTriangles.includes('t7') && <span className="triangle-number-right-bottom">+1</span>}
              {selectedDecisionTriangles.includes('t7') && <span className="triangle-number-right-bottom">+1</span>}
            </div>
          </div>
          <div className="tutorial-column-4">
            <div className={`tutorial-triangle-right ${highlightTriangles.includes('t8') ? 'highlight1' :
              hoveredTriangles.includes('t8') ? 'highlight2' : 
              selectedDecisionTriangles.includes('t8') ? 'highlight3' : ''}`}
            onMouseEnter={() => setHoveredTriangles(['t6', 't8'])} // Set hovered triangles on mouse enter
            onMouseLeave={() => setHoveredTriangles([])}>
            <span className={`user-defect-desc ${highlightedDesc.includes("user-defect-desc") ? 'highlight' : ''} ${(determineShow("user-defect-desc") ? ' show' : '')}`} data-tooltip={determineShow("user-defect-desc") ? tooltips[tooltipIndex] : null}>YOU WITHHOLD</span>
              {highlightTriangles.includes('t8') && <span className="triangle-number-right-up">+5</span>}
              {hoveredTriangles.includes('t8') && <span className="triangle-number-right-up">+5</span>}
              {selectedDecisionTriangles.includes('t8') && <span className="triangle-number-right-up">+5</span>}
            </div>
          </div>
          <div className={`tutorial-user-score ${(determineShow("tutorial-user-score") ? ' show' : '')}`} data-tooltip={determineShow("tutorial-user-score") ? tooltips[tooltipIndex] : null}>
            <div className="user-message">
              {userMessage}
            </div>
            <h2>Your Score: <span className="tutorial-score-value">{userScore}</span></h2>
            <p className="ai-decision">You chose: {userDecision}</p>
          </div>
        </div>

        <div className="tutorial-action">
            <>
              {!isComplete && determineShow("tutorial-action") && <button ref={coopButtonRef} className="tutorial-button cooperate" onClick={() => {handleUserDecision('Cooperate'); handleShareClick();}}>
                SHARE
                <div>(cooperate)</div>
              </button>}
              {!isComplete && determineShow("tutorial-action") && <button ref={defectButtonRef} className="tutorial-button defect" onClick={() => {handleUserDecision('Defect'); handleWithholdClick();}}>
                WITHHOLD
                <div>(defect)</div>
              </button>}
              <br></br>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              {!isComplete && determineShow("tutorial-action") && <button className={`lockin-button ${(determineShow("navigate-lock-in") ? '' : 'lockin-disabled')} ${(determineShow("tutorial-button-tooltip") ? ' show' : '')}`} data-tooltip={determineShow("tutorial-button-tooltip") ? tooltips[tooltipIndex] : null} onClick={() => canPlay ?  handleLockIn() : null}>
                Lock In
              </button>}
            </>

          <div>
            <button className={`chat-tutorial-proceed ${(determineShow("navigate-chat-tutorial") ? '' : 'chat-tutorial-proceed-disabled')} ${(determineShow("chat-tutorial-button") ? ' show' : 'hide')}`} data-tooltip={determineShow("chat-tutorial-tooltip") ? tooltips[tooltipIndex] : null} onClick={() => { determineShow("navigate-chat-tutorial") ? navigate('/chatbot-tutorial',  { state: { speedFlag: true, userScore, aiScore } }) : null }}>
            Go to Chat
            </button>
          </div>

          <button className={`end-tutorial ${(determineShow("end-tutorial") ? ' show' : 'hide')}`} onClick={() => { sessionStorage.getItem("currentRound") === "1" ? navigate('/pregame') : navigate('/dashboard')}}>
            Finish Tutorial
          </button>


        </div>
      </div>
      <h1 className={!canClick && !canPlay ? 'bottom-info-wait' : 'bottom-info-can'}>{!canClick && !canPlay ? '. . .' : canPlay ? 'Interact with the game or click "Finish Tutorial"' : 'Press SPACEBAR to continue'}</h1>
    </div>
  );
}

export default GameTutorial;