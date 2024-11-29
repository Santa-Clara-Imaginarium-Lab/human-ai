import React, { useState } from 'react';
import './GameTutorial.css'; // Ensure this file contains the necessary CSS
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
} from './constants'; // Import all text constants

function GameTutorial() {
  
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

  const handleCooperate = () => {
    if (round === 1) {
      highlightRound1();
      setTutorialText1(TEXT_COOPERATE_1);
      setTutorialText2(TEXT_COOPERATE_2);
      setRound(2); // Move to Round 2
    } else if (round === 2) {
      highlightRound2(); // Highlight triangles for round 2
      setTutorialText1(TEXT_COOPERATE_AGAIN_1);
      setTutorialText2(TEXT_COOPERATE_AGAIN_2);
      setIsComplete(true); // Mark as complete after Round 2
    }
  };

  const handleDefect = () => {
    if (round === 1) {
      highlightRound1();
      setTutorialText1(TEXT_DEFECT_1);
      setTutorialText2(TEXT_DEFECT_2);
      setRound(2); // Move to Round 2
    } else if (round === 2) {
      highlightRound2(); // Highlight triangles for round 2
      setTutorialText1(TEXT_DEFECT_AGAIN_1);
      setTutorialText2(TEXT_DEFECT_AGAIN_2);
      setIsComplete(true); // Mark as complete after Round 2
    }
  };

  const highlightRound1 = () => {
    setHighlightedTriangles({
      t4: { highlight: 'top', number: "0" },
      t6: { highlight: 'top', number: "-1" },
      t7: { highlight: 'bottom', number: "0" },
      t8: { highlight: 'bottom', number: "+3" },
      t1: { highlight: false, number: null },
      t2: { highlight: false, number: null },
      t3: { highlight: false, number: null },
      t5: { highlight: false, number: null },
    });
  };

  const highlightRound2 = () => {
    setHighlightedTriangles({
      t4: { highlight: false, number: null },
      t6: { highlight: false, number: null },
      t7: { highlight: false, number: null },
      t8: { highlight: false, number: null },
      t1: { highlight: 'top', number: "+3" },
      t2: { highlight: 'top', number: "+2" },
      t3: { highlight: 'bottom', number: "-1" },
      t5: { highlight: 'bottom', number: "+2" },
    });
  };

  return (
    <div className="container game-tutorial">
      {/* Text box for tutorial */}
      <div className="decision-tutorial-box">
        <p>{tutorialText1}</p>
      </div>
      <div className="game-tutorial-content">
        {/* Flex container to arrange AI score, triangle grid, and user score horizontally */}
        <div className="tutorial-horizontal-layout">
          <div className="tutorial-ai-score">
          {/* <p className="tutorial-score-change tutorial-ai-change">+5</p> */}
            <h2>AI's Score: <span className="tutorial-score-value">0</span></h2>
          </div>
          <div className="tutorial-column-1">
          <div className={`tutorial-triangle-left t1 ${highlightedTriangles.t1.highlight}`}>
              {highlightedTriangles.t1.number && <span className="triangle-number-left-bottom">{highlightedTriangles.t1.number}</span>}
            </div>
          </div>
          <div className="tutorial-column-2">
          <div className={`tutorial-triangle-left t2 ${highlightedTriangles.t2.highlight}`}>
              {highlightedTriangles.t2.number && <span className="triangle-number-left-up">{highlightedTriangles.t2.number}</span>}
            </div>
            <div className={`tutorial-triangle-right t3 ${highlightedTriangles.t3.highlight}`}>
              {highlightedTriangles.t3.number && <span className="triangle-number-right-bottom">{highlightedTriangles.t3.number}</span>}
            </div>
            <div className={`tutorial-triangle-left t4 ${highlightedTriangles.t4.highlight}`}>
              {highlightedTriangles.t4.number != null && (<span className="triangle-number-left-bottom">{highlightedTriangles.t4.number}</span>)}
            </div>
          
          </div>
          <div className="tutorial-column-3">
          <div className={`tutorial-triangle-right t5 ${highlightedTriangles.t5.highlight}`}>
              {highlightedTriangles.t5.number && <span className="triangle-number-right-up">{highlightedTriangles.t5.number}</span>}
            </div>
            <div className={`tutorial-triangle-left t6 ${highlightedTriangles.t6.highlight}`}>
              {highlightedTriangles.t6.number && <span className="triangle-number-left-up">{highlightedTriangles.t6.number}</span>}
            </div>
            <div className={`tutorial-triangle-right t7 ${highlightedTriangles.t7.highlight}`}>
              {highlightedTriangles.t7.number != null && (<span className="triangle-number-right-bottom">{highlightedTriangles.t7.number}</span>)}
            </div>
          
          </div>
          <div className="tutorial-column-4">
          <div className={`tutorial-triangle-right t8 ${highlightedTriangles.t8.highlight}`}>
              {highlightedTriangles.t8.number != null && (<span className="triangle-number-right-up">{highlightedTriangles.t8.number}</span>)}
            </div>
          </div>
          <div className="tutorial-user-score">
          {/*<p className="tutorial-score-change tutorial-user-change">+0</p>*/}
            <h2>Your Score: <span className="tutorial-score-value">0</span></h2>
          </div>
        </div>
        <div className="decision-tutorial-box2">
        <p>{tutorialText2}</p>
      </div>

      <div className="tutorial-action">
          {/* Render Cooperate and Defect buttons only if not complete */}
          {!isComplete && (
            <>
              <button className="tutorial-button cooperate" onClick={handleCooperate}>
                Cooperate
              </button>
              <button className="tutorial-button defect" onClick={handleDefect}>
                Defect
              </button>
            </>
          )}

          {/* Render Proceed button only after completion */}
          {isComplete && (
            <button
              className="tutorial-proceed-button"
              onClick={() => navigate('/chatbot-tutorial')} // Navigate to the next page
            >
              Proceed
            </button>
          )}
        </div>
          
      </div>
    </div>
  );
}

export default GameTutorial;
