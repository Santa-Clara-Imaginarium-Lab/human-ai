import './chatbotArchetype.css';
import formattedPersonalities from '../../constants/formattedPersonalities';'../../constants/formattedPersonalities'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ChatbotArchetype = () => {
    const totalChatbotScore = sessionStorage.getItem('aiScore') || '?';
    const totalUserScore = sessionStorage.getItem('userScore') || '?';
    const personality = sessionStorage.getItem('personality');
    const aiChoices = JSON.parse(sessionStorage.getItem('aiChoices'));
    const userChoices = JSON.parse(sessionStorage.getItem('userChoices'));
    
    const MAX_POSSIBLE_ROUNDS = 5; // Maximum number of rounds in a game
    const MAX_ROUNDS = parseInt(sessionStorage.getItem('maxRounds')); // Total number of rounds

    const [showBt, setShowBt] = useState(true);
    const [briefGo, setBriefGo] = useState(false);
    const [btuGo, setBtuGo] = useState(false);

    // Fill in missing rounds with X's
    for (let i = MAX_ROUNDS; i < MAX_POSSIBLE_ROUNDS; i++) {
        aiChoices.push('X');
        userChoices.push('X');
    }

    const chatbotScoreInt = parseInt(totalChatbotScore);
    const userScoreInt = parseInt(totalUserScore);
    const allChoices = aiChoices.concat(userChoices);

    const navigate = useNavigate();
    
    const handleClick = () => {
        if(sessionStorage.getItem("isResearchMode") === "true"){
            navigate('/debrief'); 
        } else {
            navigate('/complete');
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setBtuGo(true); // Show the underline
        }, 500)
        setTimeout(() => {
            setBriefGo(true); // Hide the brief transitioner
            setShowBt(false); // Hide the header
        }, 2000)
    }, []);
    

    return (
        <div className="container end-screen-container">
            {showBt && <div className={`brief-transitioner ${briefGo ? 'brief-go' : ''}`}>
                    <h1 className="brief-transitioner-text">Results</h1>
                    <div className={`brief-transitioner-underline ${btuGo ? 'brief-underline-go' : ''}`}/>
                </div>
            }

            <div className="results-container">
                <div className="top-half">
                    <div className="chatbot-results">
                        <h2>Role Model</h2>
                        <p>{totalChatbotScore}</p>
                    </div>
                    <div className="user-results">
                        <h2>You</h2>
                        <p>{totalUserScore}</p>
                    </div>
                    <div className="win-banner">
                        {userScoreInt > chatbotScoreInt && <div className="win-text">YOU WIN</div>}
                        {userScoreInt < chatbotScoreInt && <div className="win-text">YOU LOSE</div>}
                        {userScoreInt === chatbotScoreInt && <div className="win-text">YOU TIE</div>}

                        <div className="divider"></div>
                    </div>
                </div>
                <div className="bottom-half">
                    <div className="personality">
                        <h2>{formattedPersonalities[personality]}</h2>
                        <p>Click here to learn more about this personality</p>
                    </div>
                    <div className="actions">
                        <div className="left-side">
                            <h2>Chatbot</h2>
                            <div className="divider2"></div>
                            <h2>You</h2>
                        </div>
                        <div className="right-side">
                            <div className="grid-container">
                                {allChoices.map((choice, index) => (
                                    <div className={`cell ${choice === 'X' ? 'unplayed' : ''}`} key={index}>
                                        {choice === 'X' ? '✖' : choice}
                                    </div>
                                ))}
                                {/* Vertical dividers */}
                                <div className="vertical-divider" style={{ left: "18.5%" }}></div>
                                <div className="vertical-divider" style={{ left: "39%" }}></div>
                                <div className="vertical-divider" style={{ left: "59.5%" }}></div>
                                <div className="vertical-divider" style={{ left: "80.25%" }}></div>
                                {/* Horizontal divider */}
                                <div className="horizontal-divider"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="no-button" onClick={handleClick}>Next</button>
            </div>
        </div>
    );
}

export default ChatbotArchetype;