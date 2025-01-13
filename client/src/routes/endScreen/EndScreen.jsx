import './endScreen.css';

const EndScreen = () => {
    return (
        <div className="end-screen-container">
            <button className="results-title-button">
                Results
            </button>
            <div className="results-container">
                <div className="round-results-rectangle">
                    <p className="round-results-text">R1</p>
                </div>
                <div className="round-results-rectangle">
                    <p className="round-results-text">R2</p>
                </div>
                <div className="round-results-rectangle">
                    <p className="round-results-text">R3</p>
                </div>
                <div className="round-results-rectangle">
                    <p className="round-results-text">R4</p>
                </div>
                <div className="round-results-rectangle">
                    <p className="round-results-text">R5</p>
                </div>
                <div className="chatbot-results-wrapper">
                    <div className="chatbot-results-rectangle">
                        <p className="chatbot-results-text">Chatbot 1</p>
                    </div>
                    <div className="chatbot-results-rectangle">
                        <p className="chatbot-results-text">Chatbot 2</p>
                    </div>
                    <div className="chatbot-results-rectangle">
                        <p className="chatbot-results-text">Chatbot 3</p>
                    </div>
                    <div className="chatbot-results-rectangle">
                        <p className="chatbot-results-text">Chatbot 4</p>
                    </div>
                    <div className="chatbot-results-rectangle">
                        <p className="chatbot-results-text">Chatbot 5</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EndScreen;