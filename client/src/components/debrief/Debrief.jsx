import { React, useEffect } from 'react';
import './Debrief.css'; 
import { useNavigate } from 'react-router-dom';

function Debrief() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/complete'); 
    };

    useEffect(() => {
    setTimeout(() => {
        document.getElementById("btu").classList.add("brief-underline-go");
    }, 500)
    setTimeout(() => {
        document.getElementById("bt").classList.add("brief-go");
        document.getElementById("btt").classList.add("brief-txt");
        document.getElementById("btu").classList.add("brief-underline-hide");
    }, 2000)
    }, );

    return (
        <div className="container tutorial-container">
            <div id="bt" className="brief-transitioner">
                <h1 id="btt" className="brief-transitioner-text"> Debrief </h1>
            <div id="btu" className="brief-transitioner-underline"/>
          </div>

          <div className='survey-shadow-container'>
          <h2 className="brief-subtitle">This was a study about human-AI interactions. Specifically, aiming to explore how AI chatbot personalities can be optimized to enhance trust and cooperation between humans and AI during a Prisoner’s Dilemma trust game. Each of the chatbots you played against was designed according to a specific personality archetype. We were interested in how these personalities affected your trust and overall interactions.</h2>
          <div className="brief-options">
            <button className="no-button" onClick={handleClick}>Finish</button>
          </div>
          </div>
        </div>
      );
}

export default Debrief;