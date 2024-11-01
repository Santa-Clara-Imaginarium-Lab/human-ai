import { useNavigate } from "react-router-dom";
import "./welcome.css";

const Welcome = () => {

    const navigate = useNavigate();
    const handlePlayClick = () => {
        navigate('/survey'); 
      };

    return (
        <div className="container">
          <h1 className="welcome">Welcome</h1>
          <h2 className="subtitle">to the Prisoner's Dilemma Game</h2>
          <button className="play-button" onClick={handlePlayClick}>Play</button>
        </div>
      );
};

export default Welcome;
