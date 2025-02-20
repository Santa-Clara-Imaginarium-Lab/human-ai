import React, { useState, useEffect } from 'react';
import './GameTutorial.css';
import { useNavigate } from 'react-router-dom';

import {
  TEXT_INITIAL_1a,
  TEXT_INITIAL_1b,
  TEXT_INITIAL_2,
  TEXT_COOPERATE_1,
  TEXT_COOPERATE_2,
  TEXT_DEFECT_1,
  TEXT_DEFECT_2,
  TEXT_COOPERATE_AGAIN_1,
  TEXT_COOPERATE_AGAIN_2,
  TEXT_DEFECT_AGAIN_1,
  TEXT_DEFECT_AGAIN_2,
} from './constants';

function GameTutorial() {
    const [tooltipIndex, setTooltipIndex] = useState(0); // Index of tooltip array
    const [canClick, setCanClick] = useState(true);
    const [canPlay, setCanPlay] = useState(false);
    const [focusTutorialText, setFocusTutorialText] = useState(TEXT_INITIAL_1a);

    
    const determineShow = (componentName) => {
      const FOCUS_CONTAINER = 
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,  0,  0,  0,  0,  0];
      const DECISION_TUTORIAL_BOX_1 = 
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1,  1,  1,  1,  1];
      const DECISION_TUTORIAL_BOX_2 = 
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
        [  0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,  1,  1,  1,  1,  1];

      switch (componentName) {
        case 'focus-container':
          return FOCUS_CONTAINER[tooltipIndex] === 1;
        case 'decision-tutorial-box1':
          return DECISION_TUTORIAL_BOX_1[tooltipIndex] === 1;
        case 'decision-tutorial-box2':
          return DECISION_TUTORIAL_BOX_2[tooltipIndex] === 1;
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
      /* 9 */ 'This is the result of your decisions!',
    ];

    const WAIT_TIME = 15; // reduce when testing

    const handleKeyDown = (event) => {
      if (!(event.key === ' ')) return;
      if (canClick) {
        let reEnableClick = true;

        console.log("tooltipIndex:", tooltipIndex);
        setCanClick(false);
        setTooltipIndex((prevIndex) => prevIndex + 1);
        switch (tooltipIndex) {
          case (6):
            setFocusTutorialText(TEXT_INITIAL_2);
            break;
          case (7):
            reEnableClick = false;
            setCanPlay(true);
            break;
        }
        setTimeout(() => {
          if (reEnableClick) 
            setCanClick(true);  
        }, WAIT_TIME);
      }
    };

    useEffect(() => {  
      document.addEventListener('keydown', handleKeyDown);
      // document.addEventListener('click', handleKeyDown);
  
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // document.removeEventListener('click', handleKeyDown);
      };
    });
  
  
  
  const [round, setRound] = useState(1);
  const [tutorialText1a, setTutorialText1a] = useState(TEXT_INITIAL_1a); // Text for Box 1
  const [tutorialText1b, setTutorialText1b] = useState(TEXT_INITIAL_1b); // Text for Box 1
  const [tutorialText2, setTutorialText2] = useState(TEXT_INITIAL_2); // Text for Box 2
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

  const handleCooperate = () => {
    if (round === 1) {
      highlightRound1();
      setTutorialText1b(TEXT_COOPERATE_1);
      setTutorialText2(TEXT_COOPERATE_2);
      setHighlightedDesc("user-cooperate-desc ai-defect-desc"); // Highlight both descriptions as a string
      setUserScore(userScore + 0); // Increase user score
      setAiScore(aiScore + 5); // AI score doesn't change in this case
      setRound(2); // Move to Round 2
    } else if (round === 2) {
      highlightRound2();
      setTutorialText1b(TEXT_COOPERATE_AGAIN_1);
      setTutorialText2(TEXT_COOPERATE_AGAIN_2);
      setHighlightedDesc("user-cooperate-desc ai-cooperate-desc"); // Highlight both descriptions as a string
      setUserScore(userScore + 3); // Increase user score
      setAiScore(aiScore + 3); // AI score also increases
      setIsComplete(true); // Mark as complete after Round 2
      
    }
    // Progression control
    setCanPlay(false);
    setCanClick(true);
    setTooltipIndex((prevIndex) => prevIndex + 1);
    console.log("tooltipIndex:", tooltipIndex)    
  };
  
  const handleDefect = () => {
    if (round === 1) {
      highlightRound1();
      setTutorialText1b(TEXT_DEFECT_1);
      setTutorialText2(TEXT_DEFECT_2);
      setHighlightedDesc("user-defect-desc ai-defect-desc"); // Highlight both descriptions as a string
      setUserScore(userScore + 1); // Increase user score
      setAiScore(aiScore + 1); // AI score also increases
      setRound(2); // Move to Round 2
    } else if (round === 2) {
      highlightRound2();
      setTutorialText1b(TEXT_DEFECT_AGAIN_1);
      setTutorialText2(TEXT_DEFECT_AGAIN_2);
      setHighlightedDesc("user-defect-desc ai-cooperate-desc"); // Highlight both descriptions as a string
      setUserScore(userScore + 5); // Increase user score
      setAiScore(aiScore + 0); // AI score increases more
      setIsComplete(true); // Mark as complete after Round 2
    }
          
      // Progression control
      setCanPlay(false);
      setCanClick(true);
      setTooltipIndex((prevIndex) => prevIndex + 1);
      console.log("tooltipIndex:", tooltipIndex)

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
      <div className={`game-tutorial-content ${(tooltipIndex === 0 ? 'hide' : '')}`}>
        <div className={`tutorial-horizontal-layout ${(tooltipIndex === 1 || tooltipIndex === 2 || tooltipIndex === 9 ? ' show' : '')}`} data-tooltip={tooltipIndex === 1 || tooltipIndex === 2 || tooltipIndex === 9 ? tooltips[tooltipIndex] : null}>
          <div className={`tutorial-ai-score ${(tooltipIndex === 5 ? ' show' : '')}`} data-tooltip={tooltipIndex === 5 ? tooltips[tooltipIndex] : null}>
            <h2>AI's Score: <span className="tutorial-score-value">{aiScore}</span></h2>
          </div>
          <div className="tutorial-column-1">
            <div className={`tutorial-triangle-left t1 ${highlightedTriangles.t1.highlight}`}>
            <span className={`ai-defect-desc ${highlightedDesc.includes("ai-defect-desc") ? 'highlight' : ''} ${(tooltipIndex === 3 ? ' show' : '')}`} data-tooltip={tooltipIndex === 3 ? tooltips[tooltipIndex] : null}>AI WITHHOLD</span>
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
            <span className={`user-defect-desc ${highlightedDesc.includes("user-defect-desc") ? 'highlight' : ''} ${(tooltipIndex === 4 ? ' show' : '')}`} data-tooltip={tooltipIndex === 4 ? tooltips[tooltipIndex] : null}>YOU WITHHOLD</span>
              {highlightedTriangles.t8.number != null && <span className="triangle-number-right-up">{highlightedTriangles.t8.number}</span>}
            </div>
          </div>
          <div className={`tutorial-user-score ${(tooltipIndex === 6 ? ' show' : '')}`} data-tooltip={tooltipIndex === 6 ? tooltips[tooltipIndex] : null}>
            <h2>Your Score: <span className="tutorial-score-value">{userScore}</span></h2>
          </div>
        </div>

        <div className="tutorial-action">
          {!isComplete && (
            <>
              {tooltipIndex === 8 && <button className="tutorial-button cooperate" onClick={handleCooperate}>
                SHARE
                <div>(cooperate)</div>
              </button>}
              {tooltipIndex === 8 && <button className="tutorial-button defect" onClick={handleDefect}>
                WITHHOLD
                <div>(defect)</div>
              </button>}
            </>
          )}

          {isComplete && (
          <div>
            <button className="proceed-chat" onClick={() => navigate('/chatbot-tutorial')}>
            Go to Chat
            </button>
          </div>
          )}
        </div>
      </div>
      <h className={!canClick && !canPlay ? 'bottom-info-wait' : 'bottom-info-can'}>{!canClick && !canPlay ? '. . .' : canPlay ? 'Interact with the game' : 'Press SPACEBAR to continue'}</h>
    </div>
  );
}

export default GameTutorial;