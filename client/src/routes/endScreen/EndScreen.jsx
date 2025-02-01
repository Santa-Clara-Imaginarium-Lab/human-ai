import './endScreen.css';
import formattedPersonalities from '../../constants/formattedPersonalities';'../../constants/formattedPersonalities'

const EndScreen = () => {
    const totalChatbotScore = sessionStorage.getItem('aiScore') || '?';
    const totalUserScore = sessionStorage.getItem('userScore') || '?';
    const personality = sessionStorage.getItem('personality');
    const aiChoices = JSON.parse(sessionStorage.getItem('aiChoices'));
    const userChoices = JSON.parse(sessionStorage.getItem('userChoices'));
    
    const chatbotScoreInt = parseInt(totalChatbotScore);
    const userScoreInt = parseInt(totalUserScore);
    const allChoices = aiChoices.concat(userChoices);

    return (
        <div className="container end-screen-container">
            <div className="results-container">
                <div className="top-half">
                    <div className="chatbot-results">
                        <h2>Chatbot</h2>
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
                                    <div className="cell" key={index}>
                                        {choice}
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
            </div>
        </div>
    );
}

export default EndScreen;