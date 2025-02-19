import React, { useState, useEffect } from 'react';
import './GameTutorial.css';
import { useNavigate } from 'react-router-dom';

import {
  TEXT_INITIAL_1,
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
    
    const tooltips = [
      '',
      "This is the decision matrix", 
      "It shows how much Caboodle each player gets, depending on what options are chosen.",
      "Triangles pointing left indicate Caboodle for the AI.",
      "Triangles pointing right indicate Caboodle for you.",
      "This is how much Caboodle\nthe AI has...",
      "And this is how much you have.",
    ];

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (!(event.key === ' ')) return;
        if (canClick) {
          console.log("tooltipIndex:", tooltipIndex);
          setCanClick(false);
          setTooltipIndex((prevIndex) => prevIndex + 1);
          setTimeout(() => {
            setCanClick(true);
          }, 1500)
        }
      };
  
      document.addEventListener('keydown', handleKeyDown);
      // document.addEventListener('click', handleKeyDown);
  
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // document.removeEventListener('click', handleKeyDown);
      };
    }, []);
  
  
  
  const [round, setRound] = useState(1);
  const [tutorialText1, setTutorialText1] = useState(TEXT_INITIAL_1); // Text for Box 1
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
      setTutorialText1(TEXT_COOPERATE_1);
      setTutorialText2(TEXT_COOPERATE_2);
      setHighlightedDesc("user-cooperate-desc ai-defect-desc"); // Highlight both descriptions as a string
      setUserScore(userScore + 0); // Increase user score
      setAiScore(aiScore + 5); // AI score doesn't change in this case
      setRound(2); // Move to Round 2
    } else if (round === 2) {
      highlightRound2();
      setTutorialText1(TEXT_COOPERATE_AGAIN_1);
      setTutorialText2(TEXT_COOPERATE_AGAIN_2);
      setHighlightedDesc("user-cooperate-desc ai-cooperate-desc"); // Highlight both descriptions as a string
      setUserScore(userScore + 3); // Increase user score
      setAiScore(aiScore + 3); // AI score also increases
      setIsComplete(true); // Mark as complete after Round 2
    }
  };
  
  const handleDefect = () => {
    if (round === 1) {
      highlightRound1();
      setTutorialText1(TEXT_DEFECT_1);
      setTutorialText2(TEXT_DEFECT_2);
      setHighlightedDesc("user-defect-desc ai-defect-desc"); // Highlight both descriptions as a string
      setUserScore(userScore + 1); // Increase user score
      setAiScore(aiScore + 1); // AI score also increases
      setRound(2); // Move to Round 2
    } else if (round === 2) {
      highlightRound2();
      setTutorialText1(TEXT_DEFECT_AGAIN_1);
      setTutorialText2(TEXT_DEFECT_AGAIN_2);
      setHighlightedDesc("user-defect-desc ai-cooperate-desc"); // Highlight both descriptions as a string
      setUserScore(userScore + 5); // Increase user score
      setAiScore(aiScore + 0); // AI score increases more
      setIsComplete(true); // Mark as complete after Round 2
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
      <div className={` ${(tooltipIndex === 0 ? 'focus-container' : 'decision-tutorial-box1')}`}>
        <p className="tutorialText1">{tutorialText1}</p>
      </div>
      <div className={` ${(tooltipIndex < 7 ? 'hide' : tooltipIndex === 7 ? 'focus-container' : 'decision-tutorial-box2')}`}>
        <p className="tutorialText2">{tutorialText2}</p>
      </div>

      <div className="game-tutorial-content">
        <div className={`tutorial-horizontal-layout ${(tooltipIndex >= 1 && tooltipIndex <= 4 ? ' show' : '')}`} data-tooltip={tooltipIndex >= 1 && tooltipIndex <= 4 ? tooltips[tooltipIndex] : null}>
          <div className={`tutorial-ai-score ${(tooltipIndex === 5 ? ' show' : '')}`} data-tooltip={tooltipIndex === 5 ? tooltips[tooltipIndex] : null}>
            <h2>AI's Score: <span className="tutorial-score-value">{aiScore}</span></h2>
          </div>
          <div className="tutorial-column-1">
            <div className={`tutorial-triangle-left t1 ${highlightedTriangles.t1.highlight}`}>
            <span className={`ai-defect-desc ${highlightedDesc.includes("ai-defect-desc") ? 'highlight' : ''}`}>AI WITHHOLD</span>
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
            <div className={`tutorial-triangle-right t5 ${highlightedTriangles.t5.highlight}`}>
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
            <span className={`user-defect-desc ${highlightedDesc.includes("user-defect-desc") ? 'highlight' : ''}`}>YOU WITHHOLD</span>
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
              <button className="tutorial-button cooperate" onClick={handleCooperate}>
                SHARE
                <div>(cooperate)</div>
              </button>
              <button className="tutorial-button defect" onClick={handleDefect}>
                WITHHOLD
                <div>(defect)</div>
              </button>
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
      <h className={canClick ? 'bottom-info-can' : 'bottom-info-wait'}>{canClick ? 'Press SPACEBAR to continue' : '...'}</h>
    </div>
  );
}

export default GameTutorial;