import React, { useState } from 'react';
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
      <div className="decision-tutorial-box">
        <p>{tutorialText1}</p>
      </div>
      <div className="game-tutorial-content">
        <div className="tutorial-horizontal-layout">
          <div className="tutorial-ai-score">
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
          <div className="tutorial-user-score">
            <h2>Your Score: <span className="tutorial-score-value">{userScore}</span></h2>
          </div>
        </div>
        <div className="decision-tutorial-box2">
          <p>{tutorialText2}</p>
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
                <div>(deflect)</div>
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
    </div>
  );
}

export default GameTutorial;