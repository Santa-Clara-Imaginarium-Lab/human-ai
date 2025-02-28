import './ChatbotArchetype.css';
import formattedPersonalities from '../../constants/formattedPersonalities';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Average = () => {
    const totalChatbotScore = sessionStorage.getItem('aiScore') || '?';
    const totalUserScore = sessionStorage.getItem('userScore') || '?';
    const personality = sessionStorage.getItem('personality');
    const aiChoices = JSON.parse(sessionStorage.getItem('aiChoices'));
    const userChoices = JSON.parse(sessionStorage.getItem('userChoices'));

    const MAX_POSSIBLE_ROUNDS = 5;
    const MAX_ROUNDS = parseInt(sessionStorage.getItem('maxRounds'));

    const navigate = useNavigate();

    const [showBt, setShowBt] = useState(true);
    const [briefGo, setBriefGo] = useState(false);
    const [btuGo, setBtuGo] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setBtuGo(true); // Show the underline
        }, 500)
        setTimeout(() => {
            setBriefGo(true); // Hide the brief transitioner
            setShowBt(false); // Hide the header
        }, 2000)
    }, []);



    // Fill in missing rounds with X's
    for (let i = MAX_ROUNDS; i < MAX_POSSIBLE_ROUNDS; i++) {
        aiChoices.push('X');
        userChoices.push('X');
    }

    const handleClick = () => {
        if(sessionStorage.getItem("isResearchMode") === "true"){
            navigate('/debrief'); 
        } else {
            navigate('/complete');
        }
    }

    return (
        <div className="container end-screen-container1">
            {showBt && <div className={`brief-transitioner ${briefGo ? 'brief-go' : ''}`}>
                    <h1 className="brief-transitioner-text">Chatbot Archetype</h1>
                    <div className={`brief-transitioner-underline ${btuGo ? 'brief-underline-go' : ''}`}/>
                </div>
            }

            <div className="results-container">
                <div className="win-banner1">
                    <div className="win-text">Chatbot Archetype</div>
                </div>
                <div className="bottom-half">
                    <div className="scores">
                        <div className="top-half">
                            <div className="chatbot-results1">
                                <h2>Average</h2>
                            </div>
                        </div>
                        <div className="bottom-half">
                            <div className="choices">
                                <div className="choice-header">
                                    <p>Cooperate</p>
                                    <div className="vertical-divider1" style={{ left: "18.5%" }}></div>
                                    <p>Defect</p>
                                </div>
                                <div className="rounds">
                                    {aiChoices.map((choice, index) => (
                                        <div className="round" key={index}>
                                            <span>
                                                {aiChoices[index] === 'Cooperate' ? '✔' : ''}
                                            </span>
                                            <span>Day {index + 1}</span>
                                            <span>
                                                {aiChoices[index] === 'Defect' ? '✔' : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="actions1">
                            <h3>Description</h3>
                            <p>
                                You played against the Average chatbot! This chatbot has a balanced personality, responding in a neutral and practical way. It doesn’t lean too strongly in any direction but engages in a straightforward and reasonable manner. Its decisions are predictable and fair, without extreme reactions. 
                            </p>
                    </div>
                </div>

                <button className="submit-button" onClick={handleClick}>Next</button>
            </div>
        </div>
    );
}

export default Average;