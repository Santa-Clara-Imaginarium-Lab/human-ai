import React, { useState, useEffect, useRef } from 'react';
import './GameTutorial.css';
import { useNavigate } from 'react-router-dom';

import {
  TEXT_INITIAL_1a,
  TEXT_INITIAL_1b,
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
    const [focusTutorialText, setFocusTutorialText] = useState(TEXT_INITIAL_1a);

    
    const determineShow = (componentName) => {
      // CONTROLS CONTAINER VISIBILITY
      const FOCUS_CONTAINER = 
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,  0,  0,  1,  0,  0];
      const DECISION_TUTORIAL_BOX_1 = 
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,  1,  1,  0,  1,  1];
      const DECISION_TUTORIAL_BOX_2 = 
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,  1,  0,  0,  1,  1];
      const GAME_TUTORIAL_CONTENT = // INVERTED! 1 = HIDE
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,  0,  0,  1,  0,  0];

      // CONTROLS TOOLTIPS
      const TUTORIAL_HORIZONTAL_LAYOUT = 
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0,  0,  1,  0,  0,  0];
      const AI_DEFECT_DESC = 
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0];
      const USER_DEFECT_DESC =
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0];
      const TUTORIAL_AI_SCORE = 
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0];
      const TUTORIAL_USER_SCORE = 
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,  0,  0,  0,  0,  0];

      // CONTROLS BUTTONS
      const TUTORIAL_ACTION = 
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,  1,  0,  0,  0,  0];
      const PROCEED_CHAT_TUTORIAL = // also a tooltip
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  1,  1];

      // CONTROLS NAVIGATION
      const NAVIGATE_CHAT_TUTORIAL =
      // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
      [  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  1];

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
        case 'proceed-chat-tutorial':
          return PROCEED_CHAT_TUTORIAL[tooltipIndex] === 1;
        case 'navigate-chat-tutorial':
          return NAVIGATE_CHAT_TUTORIAL[tooltipIndex] === 1;
        default:
          return false;
      }
    };
    
    const tooltips = [
      /* 0 */ '',
      /* 1 */ "This is the decision matrix", 
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
          case (6):
            setFocusTutorialText(TEXT_INITIAL_2);
            break;
          case (7):
            reEnableClick = false;
            setCanPlay(true);
            resetHighlight();
            break;
          case (9):
            setFocusTutorialText(TEXT_INITIAL_3);
            setTutorialText2(TEXT_INITIAL_3);
            setTutorialText1b(TEXT_INITIAL_1b);
            break;
          case (10):
            reEnableClick = false;
            setCanPlay(true);
            break;
          case (12): 
            setFocusTutorialText(TEXT_INITIAL_4);
            setTutorialText2(TEXT_INITIAL_4);
            setTutorialText1b(TEXT_INITIAL_1b);
            resetHighlight();
            break;
          case (14):
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
  
  const [round, setRound] = useState(1);
  const [tutorialText1a, setTutorialText1a] = useState(TEXT_INITIAL_1a); // Text for Box 1
  const [tutorialText1b, setTutorialText1b] = useState(TEXT_INITIAL_1b); // Text for Box 1
  const [tutorialText2, setTutorialText2] = useState(TEXT_INITIAL_2); // Text for Box 2
  const [hoveredTriangles, setHoveredTriangles] = useState([]); 
  const [selectedDecisionTriangles, setSelectedDecisionTriangles] = useState([]); 
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

  const handleShareClick = () => {
    if (round === 1) {
      setSelectedDecisionTriangles(['t1', 't3']); 
    }
    else {
      setSelectedDecisionTriangles(['t2', 't5']); 
    }
  };

  const handleWithholdClick = () => {
    if (round === 1) {
      setSelectedDecisionTriangles(['t4', 't7']); 
    }
    else {
      setSelectedDecisionTriangles(['t6', 't8']); 
    }
  };

  const handleLockIn = () => {
    // Progression control


    setCanPlay(false);
    setCanClick(true);



    setTooltipIndex((prevIndex) => prevIndex + 1);
    console.log("progression! tooltipIndex:", tooltipIndex)
            
    if (userDecision === 'Cooperate') {
      if (round === 1) {

        setTutorialText1b(TEXT_COOPERATE_1);
        setTutorialText2(TEXT_INITIAL_3);
        setHighlightedDesc("user-cooperate-desc ai-defect-desc"); // Highlight both descriptions as a string
        setUserScore(userScore + 0); // Increase user score
        setAiScore(aiScore + 5); // AI score doesn't change in this case
        setRound(2); // Move to Round 2
      } else if (round === 2) {

        setTutorialText1b(TEXT_COOPERATE_AGAIN_1);
        setTutorialText2(TEXT_INITIAL_4);
        setHighlightedDesc("user-cooperate-desc ai-cooperate-desc"); // Highlight both descriptions as a string
        setUserScore(userScore + 3); // Increase user score
        setAiScore(aiScore + 3); // AI score also increases
        setIsComplete(true); // Mark as complete after Round 2
        resetHighlight(); // Reset highlights after completion
        console.log("isComplete:");
      }
    }
    else {
      if (round === 1) {

        setTutorialText1b(TEXT_DEFECT_1);
        setTutorialText2(TEXT_INITIAL_3);
        setHighlightedDesc("user-defect-desc ai-defect-desc"); // Highlight both descriptions as a string
        setUserScore(userScore + 1); // Increase user score
        setAiScore(aiScore + 1); // AI score also increases
        setRound(2); // Move to Round 2
      } else if (round === 2) {

        setTutorialText1b(TEXT_DEFECT_AGAIN_1);
        setTutorialText2(  TEXT_INITIAL_4);
        setHighlightedDesc("user-defect-desc ai-cooperate-desc"); // Highlight both descriptions as a string
        setUserScore(userScore + 5); // Increase user score
        setAiScore(aiScore + 0); // AI score increases more
        setIsComplete(true); // Mark as complete after Round 2
        resetHighlight(); // Reset highlights after completion
        console.log("isComplete:");
    }

  };
}
  
  

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

  const resetHighlight = () => {
    setHighlightedTriangles({
      t4: { highlight: false, number: null },
      t6: { highlight: false, number: null },
      t7: { highlight: false, number: null },
      t8: { highlight: false, number: null },
      t1: { highlight: false, number: null },
      t2: { highlight: false, number: null },
      t3: { highlight: false, number: null },
      t5: { highlight: false, number: null },
    });
  };

  return (
    <div className="container game-tutorial">
        <div className={` ${(determineShow("focus-container") ? 'focus-container' : 'hide')}`}>
        <p className="tutorialText1">{focusTutorialText}</p>
      </div>

      <div className={` ${(determineShow("decision-tutorial-box1") ? 'decision-tutorial-box1' : 'hide')}`}>
        <p className="tutorialText1">{tutorialText1a}<br/><br/> {tutorialText1b}</p>
      </div>
      <div className={` ${determineShow("decision-tutorial-box2") ? 'decision-tutorial-box2' : 'hide'}`}>
        <p className="tutorialText2">{tutorialText2}</p>
      </div>

{/* TODO: Turn these into determineShows and fill in their arrays */}
      <div className={`game-tutorial-content ${( determineShow("game-tutorial-content") ? 'hide' : '')}`}>
        <div className={`tutorial-horizontal-layout ${( determineShow("tutorial-horizontal-layout") ? ' show' : '')}`} data-tooltip={determineShow("tutorial-horizontal-layout") ? tooltips[tooltipIndex] : null}>
          <div className={`tutorial-ai-score ${(determineShow("tutorial-ai-score") ? ' show' : '')}`} data-tooltip={determineShow("tutorial-ai-score") ? tooltips[tooltipIndex] : null}>
            <h2>AI's Score: <span className="tutorial-score-value">{aiScore}</span></h2>
          </div>
          <div className="tutorial-column-1">
            <div className={`tutorial-triangle-left t1 ${highlightedTriangles.t1.highlight} ${hoveredTriangles.includes('t1') ? 'highlight2' : selectedDecisionTriangles.includes('t1') ? 'highlight3': ''}`}
            onMouseEnter={() => setHoveredTriangles(['t1', 't3'])} // Set hovered triangles on mouse enter
            onMouseLeave={() => setHoveredTriangles([])}
            >
            <span className={`ai-defect-desc ${highlightedDesc.includes("ai-defect-desc") ? 'highlight' : ''} ${(determineShow("ai-defect-desc") ? ' show' : '')}`} data-tooltip={determineShow("ai-defect-desc") ? tooltips[tooltipIndex] : null}>AI WITHHOLD</span>
              {highlightedTriangles.t1.number && <span className="triangle-number-left-bottom">{highlightedTriangles.t1.number}</span>}
              {hoveredTriangles.includes('t1') && <span className="triangle-number-left-bottom">+5</span>}
              {selectedDecisionTriangles.includes('t1') && <span className="triangle-number-left-bottom">+5</span>}
            </div>
          </div>
          <div className="tutorial-column-2">
            <div className={`tutorial-triangle-left t2 ${highlightedTriangles.t2.highlight} ${hoveredTriangles.includes('t2') ? 'highlight2' : selectedDecisionTriangles.includes('t2') ? 'highlight3' : ''}`}
            onMouseEnter={() => setHoveredTriangles(['t2', 't5'])} // Set hovered triangles on mouse enter
            onMouseLeave={() => setHoveredTriangles([])}
            >
            <span className={`ai-cooperate-desc ${highlightedDesc.includes("ai-cooperate-desc") ? 'highlight' : ''}`}>AI SHARE</span>
              {highlightedTriangles.t2.number && <span className="triangle-number-left-up">{highlightedTriangles.t2.number}</span>}
              {hoveredTriangles.includes('t2') && <span className="triangle-number-left-up">+3</span>}
              {selectedDecisionTriangles.includes('t2') && <span className="triangle-number-left-up">+3</span>}
            </div>
            <div className={`tutorial-triangle-right t3 ${highlightedTriangles.t3.highlight} ${hoveredTriangles.includes('t3') ? 'highlight2' : selectedDecisionTriangles.includes('t3') ? 'highlight3' : ''}`}
            onMouseEnter={() => setHoveredTriangles(['t1', 't3'])} // Set hovered triangles on mouse enter
            onMouseLeave={() => setHoveredTriangles([])}
            >
              {highlightedTriangles.t3.number && <span className="triangle-number-right-bottom">{highlightedTriangles.t3.number}</span>}
              {hoveredTriangles.includes('t3') && <span className="triangle-number-right-bottom">+0</span>}
              {selectedDecisionTriangles.includes('t3') && <span className="triangle-number-right-bottom">+0</span>}
            </div>
            <div className={`tutorial-triangle-left t4 ${highlightedTriangles.t4.highlight} ${hoveredTriangles.includes('t4') ? 'highlight2' : selectedDecisionTriangles.includes('t4') ? 'highlight3' : ''}`}
                        onMouseEnter={() => setHoveredTriangles(['t4', 't7'])} // Set hovered triangles on mouse enter
                        onMouseLeave={() => setHoveredTriangles([])}
                        >
              {highlightedTriangles.t4.number != null && <span className="triangle-number-left-bottom">{highlightedTriangles.t4.number}</span>}
              {hoveredTriangles.includes('t4') && <span className="triangle-number-left-bottom">+1</span>}
              {selectedDecisionTriangles.includes('t4') && <span className="triangle-number-left-bottom">+1</span>}
            </div>
          </div>
          <div className="tutorial-column-3">
            <div className={`tutorial-triangle-right t5 ${highlightedTriangles.t5.highlight} ${hoveredTriangles.includes('t5') ? 'highlight2' : selectedDecisionTriangles.includes('t5') ? 'highlight3' : ''}`}
                        onMouseEnter={() => setHoveredTriangles(['t2', 't5'])} // Set hovered triangles on mouse enter
                        onMouseLeave={() => setHoveredTriangles([])}
                        >
            <span className={`user-cooperate-desc ${highlightedDesc.includes("user-cooperate-desc") ? 'highlight' : ''}`}>YOU SHARE</span>
              {highlightedTriangles.t5.number && <span className="triangle-number-right-up">{highlightedTriangles.t5.number}</span>}
              {hoveredTriangles.includes('t5') && <span className="triangle-number-right-up">+3</span>}
              {selectedDecisionTriangles.includes('t5') && <span className="triangle-number-right-up">+3</span>}
            </div>
            <div className={`tutorial-triangle-left t6 ${highlightedTriangles.t6.highlight} ${hoveredTriangles.includes('t6') ? 'highlight2' : selectedDecisionTriangles.includes('t6') ? 'highlight3' : ''}`}
            onMouseEnter={() => setHoveredTriangles(['t6', 't8'])} // Set hovered triangles on mouse enter
            onMouseLeave={() => setHoveredTriangles([])}
            >
              {highlightedTriangles.t6.number && <span className="triangle-number-left-up">{highlightedTriangles.t6.number}</span>}
              {hoveredTriangles.includes('t6') && <span className="triangle-number-left-up">+0</span>}
              {selectedDecisionTriangles.includes('t6') && <span className="triangle-number-left-up">+0</span>}
            </div>
            <div className={`tutorial-triangle-right t7 ${highlightedTriangles.t7.highlight} ${hoveredTriangles.includes('t7') ? 'highlight2' : selectedDecisionTriangles.includes('t7') ? 'highlight3' : ''}`}
            onMouseEnter={() => setHoveredTriangles(['t4', 't7'])} // Set hovered triangles on mouse enter
            onMouseLeave={() => setHoveredTriangles([])}
            >
              {highlightedTriangles.t7.number != null && <span className="triangle-number-right-bottom">{highlightedTriangles.t7.number}</span>}
              {hoveredTriangles.includes('t7') && <span className="triangle-number-right-bottom">+1</span>}
              {selectedDecisionTriangles.includes('t7') && <span className="triangle-number-right-bottom">+1</span>}
            </div>
          </div>
          <div className="tutorial-column-4">
            <div className={`tutorial-triangle-right t8 ${highlightedTriangles.t8.highlight} ${hoveredTriangles.includes('t8') ? 'highlight2' : selectedDecisionTriangles.includes('t8') ? 'highlight3' : ''}`}
            onMouseEnter={() => setHoveredTriangles(['t6', 't8'])} // Set hovered triangles on mouse enter
            onMouseLeave={() => setHoveredTriangles([])}>
            <span className={`user-defect-desc ${highlightedDesc.includes("user-defect-desc") ? 'highlight' : ''} ${(determineShow("user-defect-desc") ? ' show' : '')}`} data-tooltip={determineShow("user-defect-desc") ? tooltips[tooltipIndex] : null}>YOU WITHHOLD</span>
              {highlightedTriangles.t8.number != null && <span className="triangle-number-right-up">{highlightedTriangles.t8.number}</span>}
              {hoveredTriangles.includes('t8') && <span className="triangle-number-right-up">+5</span>}
              {selectedDecisionTriangles.includes('t8') && <span className="triangle-number-right-up">+5</span>}
            </div>
          </div>
          <div className={`tutorial-user-score ${(determineShow("tutorial-user-score") ? ' show' : '')}`} data-tooltip={determineShow("tutorial-user-score") ? tooltips[tooltipIndex] : null}>
            <h2>Your Score: <span className="tutorial-score-value">{userScore}</span></h2>
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
              {!isComplete && determineShow("tutorial-action") && <button className="lockin-button" onClick={handleLockIn}>
                Lock In
              </button>}
            </>

          {determineShow("proceed-chat-tutorial") && (
          <div>
            <button className={`proceed-chat-tutorial ${(determineShow("navigate-chat-tutorial") ? '' : 'proceed-chat-tutorial-disabled')} ${(determineShow("proceed-chat-tutorial") ? ' show' : '')}`} data-tooltip={determineShow("proceed-chat-tutorial") ? tooltips[tooltipIndex] : null} onClick={() => { determineShow("navigate-chat-tutorial") ? navigate('/chatbot-tutorial') : null }}>
            Go to Chat
            </button>
          </div>
          )}
        </div>
      </div>
      <h1 className={!canClick && !canPlay ? 'bottom-info-wait' : 'bottom-info-can'}>{!canClick && !canPlay ? '. . .' : canPlay ? 'Interact with the game' : 'Press SPACEBAR to continue'}</h1>
    </div>
  );
}

export default GameTutorial;