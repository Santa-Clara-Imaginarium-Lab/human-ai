import { React, useState, useEffect } from 'react';
import './Debrief.css'; 
import { useNavigate } from 'react-router-dom';

function Debrief() {
    const navigate = useNavigate();

    const [briefGo, setBriefGo] = useState(false);
    const [btuGo, setBtuGo] = useState(false);

    const handleClick = () => {
        navigate('/complete'); 
    };

    useEffect(() => {
    setTimeout(() => {
        setBtuGo(true); // Show the underline
    }, 500)
    setTimeout(() => {
        setBriefGo(true); // Hide the brief transitioner
        // document.getElementById("btt").classList.add("brief-txt");
        // document.getElementById("btu").classList.add("brief-underline-hide");
    }, 2000)
    }, []);

    return (
        <div className="container tutorial-container">
            <div className={`brief-transitioner ${briefGo ? 'brief-go' : ''}`}>
                <h1 className="brief-transitioner-text"> Debrief </h1>
            <div className={`brief-transitioner-underline ${btuGo ? 'brief-underline-go' : ''}`}/>
          </div>

          <div className='survey-shadow-container'>
          <h2 className="debrief-subtitle">This was a study about human-AI interactions. Specifically, aiming to explore how AI chatbot personalities can be optimized to enhance trust and cooperation between humans and AI during a Prisoner’s Dilemma trust game. Each of the chatbots you played against was designed according to a specific personality archetype. We were interested in how these personalities affected your trust and overall interactions.</h2>
          <div className="brief-options">
            <button className="no-button" onClick={handleClick}>Finish</button>
          </div>
          </div>
        </div>
      );
}

export default Debrief;