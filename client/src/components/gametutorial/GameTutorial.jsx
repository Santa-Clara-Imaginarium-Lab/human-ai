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
        [   0,  1,  1,  1,  1,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,
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
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const TUTORIAL_AI_SCORE = 
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0, 
            0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const TUTORIAL_USER_SCORE = 
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0, 
            0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];

      // CONTROLS BUTTONS
      const TUTORIAL_ACTION =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1, 
            1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const TUTORIAL_BUTTON_TOOLTIP =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1, 
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const CHAT_TUTORIAL_BUTTON =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0, 
            0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  
            1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const CHAT_TUTORIAL_TOOLTIP =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0, 
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];

      // CONTROLS ALLOW/DENY BUTTONS
      const NAVIGATE_LOCK_IN =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 
            0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  
            0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const NAVIGATE_CHAT_TUTORIAL =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 
            0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  
            0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ];
      const END_TUTORIAL =
        [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 
            0,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
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
      /* 17 */ 'This is the result of your decisions!',




      /* old */
      /* 1 */ "This is the Caboodle Decision Matrix!", 
      /* 2 */ "It shows how much Caboodle each player gets, depending on what options are chosen.",
      /* 3 */ "Triangles pointing left: Caboodle for the AI.",
      /* 4 */ "Triangles pointing right: Caboodle for you.",
      /* 5 */ "This is how much Caboodle the AI has...",
      /* 6 */ "And this is how much you have.",
      /* 7 */ '',
      /* 8 */ '',
      /* 9 */ 'This is the result of your decisions! The AI defected. See the scoring explanation above.',
      /* 10 */ '',
      /* 11 */ '',
      /* 12 */ 'This is the result of your decisions! The AI cooperated. See the scoring explanation above.',
      /* 13 */ '',
      /* 14 */ 'You can chat with the AI using this button.',
      /* 15 */ 'It is always available on the game page. Press it now!',
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
            setTooltipIndex(16);
            break;
          case (91):
            setFocusTutorialText(TEXT_INITIAL_3);
            setTutorialText2(TEXT_INITIAL_3);
            setTutorialText1b(TEXT_INITIAL_1b);
            break;
          case (92):
            reEnableClick = false;
            setCanPlay(true);
            setTooltipIndex(14);
            break;
          case (93): 
            setFocusTutorialText(TEXT_INITIAL_4);
            setTutorialText2(TEXT_INITIAL_4);
            setTutorialText1b(TEXT_INITIAL_1b);
            break;
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

  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false); // Track if both rounds are complete

  const [highlightedDesc, setHighlightedDesc] = useState(""); // String to store combined highlighted descriptions
  // New state variables for scores
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

    const coopButtonRef = useRef(null);
    const defectButtonRef = useRef(null);

  const [userDecision, setUserDecision] = useState(''); // User's decision

  const handleUserDecision = (decision) => {
    // Update user's decision    
    setUserDecision(decision);

    switch (decision) {
      case 'Cooperate':
        coopButtonRef.current.classList.add('selected');
        defectButtonRef.current.classList.remove('selected');
        break;
      case 'Defect':
        coopButtonRef.current.classList.remove('selected');
        defectButtonRef.current.classList.add('selected');
        break;
    }
  }

  const handleLockIn = () => {
    // Progression control
    setCanPlay(false);
    setCanClick(true);
    setTooltipIndex((prevIndex) => prevIndex + 1);
    console.log("progression! tooltipIndex:", tooltipIndex)
            
    if (userDecision === 'Cooperate') {
        // setTutorialText1b(TEXT_COOPERATE_1);
        setTutorialText2(TEXT_INITIAL_3);
        setHighlightedDesc("user-cooperate-desc ai-defect-desc"); // Highlight both descriptions as a string
        setUserScore(userScore + 0); // Increase user score
        setAiScore(aiScore + 5); // AI score doesn't change in this case
      } else if (userDecision === 'Defect') {
        // setTutorialText1b(TEXT_COOPERATE_AGAIN_1);
        setTutorialText2(TEXT_INITIAL_4);
        setHighlightedDesc("user-cooperate-desc ai-cooperate-desc"); // Highlight both descriptions as a string
        setUserScore(userScore + 3); // Increase user score
        setAiScore(aiScore + 3); // AI score also increases
      }
  };
  
  

  const highlightRound1 = () => {
    setHighlightedTriangles({
      t4: { highlight: 'top', number: "+1" },
      t6: { highlight: false, number: null },
      t7: { highlight: 'bottom', number: "+1" },
      t8: { highlight: false, number: null },
      t2: { highlight: false, number: null },
      t5: { highlight: false, number: null },
      t1: { highlight: 'top', number: "+5" },
      t3: { highlight: 'bottom', number: "+0" },
    });
  };

  const highlightRound2 = () => {
    setHighlightedTriangles({
      t4: { highlight: false, number: null },
      t6: { highlight: "top", number: "+0" },
      t7: { highlight: false, number: null },
      t8: { highlight: "bottom", number: "+5" },
      t1: { highlight: false, number: null },
      t2: { highlight: 'top', number: "+3" },
      t3: { highlight: false, number: null },
      t5: { highlight: 'bottom', number: "+3" },
    });
  };

  return (
    <div className="container game-tutorial">
      <div className={`free-play-disclaimer ${sessionStorage.getItem('isResearchMode') ? 'hide' : 'show'}`}> 
        <p>FREE PLAY Active. Your data is not being recorded.</p>
      </div>

      {tooltipIndex > 15 && <div className={`tutorial-disclaimer`}> 
        <p>TUTORIAL SECTION. Caboodle here is not final.</p>
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
            <h2>AI's Score: <span className="tutorial-score-value">{aiScore}</span></h2>
          </div>
          <div className="tutorial-column-1">
            <div className={`tutorial-triangle-left t1 ${highlightedTriangles.t1.highlight}`}>
            <span className={`ai-defect-desc ${highlightedDesc.includes("ai-defect-desc") ? 'highlight' : ''} ${(determineShow("ai-defect-desc") ? ' show' : '')}`} data-tooltip={determineShow("ai-defect-desc") ? tooltips[tooltipIndex] : null}>AI WITHHOLD</span>
              {highlightedTriangles.t1.number && <span className="triangle-number-left-bottom">{highlightedTriangles.t1.number}</span>}
            </div>
          </div>
          <div className="tutorial-column-2">
            <div className={`tutorial-triangle-left t2 ${highlightedTriangles.t2.highlight}`}>
            <span className={`ai-cooperate-desc ${highlightedDesc.includes("ai-cooperate-desc") ? 'highlight' : ''}`}>AI SHARE</span>
              {highlightedTriangles.t2.number && <span className="triangle-number-left-up">{highlightedTriangles.t2.number}</span>}
            </div>
            <div className={`tutorial-triangle-right t3 ${highlightedTriangles.t3.highlight}`}>
              {highlightedTriangles.t3.number && <span className="triangle-number-right-bottom">{highlightedTriangles.t3.number}</span>}
            </div>
            <div className={`tutorial-triangle-left t4 ${highlightedTriangles.t4.highlight}`}>
              {highlightedTriangles.t4.number != null && <span className="triangle-number-left-bottom">{highlightedTriangles.t4.number}</span>}
            </div>
          </div>
          <div className="tutorial-column-3">
            <div className={`tutorial-triangle-right t5 ${highlightedTriangles.t5.highlight} `}>
            <span className={`user-cooperate-desc ${highlightedDesc.includes("user-cooperate-desc") ? 'highlight' : ''}`}>YOU SHARE</span>
              {highlightedTriangles.t5.number && <span className="triangle-number-right-up">{highlightedTriangles.t5.number}</span>}
            </div>
            <div className={`tutorial-triangle-left t6 ${highlightedTriangles.t6.highlight}`}>
              {highlightedTriangles.t6.number && <span className="triangle-number-left-up">{highlightedTriangles.t6.number}</span>}
            </div>
            <div className={`tutorial-triangle-right t7 ${highlightedTriangles.t7.highlight}`}>
              {highlightedTriangles.t7.number != null && <span className="triangle-number-right-bottom">{highlightedTriangles.t7.number}</span>}
            </div>
          </div>
          <div className="tutorial-column-4">
            <div className={`tutorial-triangle-right t8 ${highlightedTriangles.t8.highlight}`}>
            <span className={`user-defect-desc ${highlightedDesc.includes("user-defect-desc") ? 'highlight' : ''} ${(determineShow("user-defect-desc") ? ' show' : '')}`} data-tooltip={determineShow("user-defect-desc") ? tooltips[tooltipIndex] : null}>YOU WITHHOLD</span>
              {highlightedTriangles.t8.number != null && <span className="triangle-number-right-up">{highlightedTriangles.t8.number}</span>}
            </div>
          </div>
          <div className={`tutorial-user-score ${(determineShow("tutorial-user-score") ? ' show' : '')}`} data-tooltip={determineShow("tutorial-user-score") ? tooltips[tooltipIndex] : null}>
            <h2>Your Score: <span className="tutorial-score-value">{userScore}</span></h2>
          </div>
        </div>

        <div className="tutorial-action">
            <>
              {!isComplete && determineShow("tutorial-action") && <button ref={coopButtonRef} className="tutorial-button cooperate" onClick={() => handleUserDecision('Cooperate')}>
                SHARE
                <div>(cooperate)</div>
              </button>}
              {!isComplete && determineShow("tutorial-action") && <button ref={defectButtonRef} className="tutorial-button defect" onClick={() => handleUserDecision('Defect')}>
                WITHHOLD
                <div>(defect)</div>
              </button>}
              <br></br>
              {!isComplete && determineShow("tutorial-action") && <button className={`lockin-button ${(determineShow("navigate-lock-in") ? '' : 'lockin-disabled')} ${(determineShow("tutorial-button-tooltip") ? ' show' : '')}`} data-tooltip={determineShow("tutorial-button-tooltip") ? tooltips[tooltipIndex] : null} onClick={() => canPlay ?  handleLockIn() : null}>
                Lock In
              </button>}
            </>

          <div>
            <button className={`chat-tutorial-proceed ${(determineShow("navigate-chat-tutorial") ? '' : 'chat-tutorial-proceed-disabled')} ${(determineShow("chat-tutorial-button") ? ' show' : 'hide')}`} data-tooltip={determineShow("chat-tutorial-tooltip") ? tooltips[tooltipIndex] : null} onClick={() => { determineShow("navigate-chat-tutorial") ? navigate('/chatbot-tutorial',  { state: { speedFlag: true, userScore, aiScore } }) : null }}>
            Go to Chat
            </button>
          </div>

          <button className={`end-tutorial ${(determineShow("end-tutorial") ? ' show' : 'hide')}`} onClick={() => { sessionStorage.getItem("currentRound") === 1 ? navigate('/pregame') : navigate('/dashboard')}}>
            Finish Tutorial
          </button>


        </div>
      </div>
      <h1 className={!canClick && !canPlay ? 'bottom-info-wait' : 'bottom-info-can'}>{!canClick && !canPlay ? '. . .' : canPlay ? 'Interact with the game' : 'Press SPACEBAR to continue'}</h1>
    </div>
  );
}

export default GameTutorial;