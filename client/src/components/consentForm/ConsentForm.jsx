import React from 'react';
import './ConsentForm.css';
import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';

// todo: change font on these screens
// request from professor!
function ConsentForm() {
    const navigate = useNavigate();

    const [termsIndex, setTermsIndex] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);

    const [briefGo, setBriefGo] = useState(false);
    const [btuGo, setBtuGo] = useState(false);

    const terms = [
        "OPTIMIZING TRUST IN HUMAN-AI INTERACTIONS INFORMED CONSENT FORM <br /><br /> 1. David C. Jeong, Assistant Professor and Erin Schmidt, Research Assistant at Santa Clara University, have requested your participation in a research study at this institution. <br /><br />2. The purpose of the research is to study human-AI interaction (HAX). Participants will engage in a Prisoner’s DIlemma-style trust game, interacting with AI chatbots designed to reflect distinct personalities. These chatbots will demonstrate unique language patterns and decision-making strategies, offering a dynamic approach to studying trust-building.", 
        "3. Your participation will involve participating in a survey that should last no longer than 30 minutes of your time. Please be advised that participation is voluntary and that nonparticipation or withdrawal from the study will not affect your grade, treatment, care, employment status, as appropriate. <br /><br /> 4. There is no direct benefit to you anticipated from participating in this study. However, it is hoped that the information gained from the study will help contribute to a deeper understanding of how trust is developed between humans and AI systems, which can have broader applications in areas such as AI design, decision-making frameworks, and human-computer interaction.",
        "5. The results of the research study may be published but your name or identity will not be revealed. In order to maintain confidentiality of your records, David Jeong will not collect personal identifying information and all data will be stored in a secure location with data encryption. Only research assistants actively analyzing and collecting data as part of this research project will have access to this data. <br /><br /> 6. You will not be paid for your participation.",
        "7. Any questions you have concerning the research study or your participation in it, before or after your consent, will be answered by Principal Investigator David Jeong, 500 El Camino Real, (408) 554-5710. <br /><br /> 8. If you have questions about your rights as a subject/participant in this research, or if you feel you have been placed at risk, you can contact the Chair of the Human Subjects Committee, through Office of Research Compliance and Integrity at (408) 554-5591.",
        "9. This form explains the nature, demands, benefits and any risk of the project. By signing this form you agree knowingly to assume any risks involved. Remember, your participation is voluntary. You may choose not to participate or to withdraw your consent and discontinue participation at any time without penalty or loss of benefit."
    ];

    useEffect(() => {
        if (termsIndex >= terms.length) {
            navigate('/pre-surveys'); //change this
        }

        setIsDisabled(true);

        setTimeout(() => {
            setIsDisabled(false);
        }, 3000)
    }, [termsIndex])

    const handleClick = () => {
        setTermsIndex((prevTerm) => prevTerm + 1);
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
                <h1 className="brief-transitioner-text"> Consent Form </h1>
            <div className={`brief-transitioner-underline ${btuGo ? 'brief-underline-go' : ''}`}/>
          </div>
            <div className='survey-shadow-container'>
            <h2><p dangerouslySetInnerHTML={{ __html: terms[termsIndex] }}></p></h2>
            <div className="brief-options">
            <button id="no-button" onClick={handleClick} disabled={isDisabled}>
                {isDisabled && <span>Wait</span>}
                {!isDisabled && <span>Proceed</span>}
            </button>
        </div>
        </div>
        </div>
      );
}

export default ConsentForm;