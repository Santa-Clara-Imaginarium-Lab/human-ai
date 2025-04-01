import React from 'react';
import './ConsentForm.css';
import { useState, useEffect, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';

// todo: change font on these screens
// request from professor!
function ConsentForm() {
    const navigate = useNavigate();

    const [termsIndex, setTermsIndex] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);

    const [briefGo, setBriefGo] = useState(false);
    const [btuGo, setBtuGo] = useState(false);

    const [confirmNo, setConfirmNo] = useState(false);
    const noRef = useRef(null);

    const terms = [
        "OPTIMIZING TRUST IN HUMAN-AI INTERACTIONS INFORMED CONSENT FORM \n\n 1. David C. Jeong, Assistant Professor, Erin Schmidt, and Ethan Sychangco, Research Assistants at Santa Clara University, have requested your participation in a research study at this institution. \n\n2. The purpose of the research is to study human-AI interaction (HAX). Participants will engage in a Prisoner’s DIlemma-style trust game, interacting with AI chatbots designed to reflect distinct personalities. These chatbots will demonstrate unique language patterns and decision-making strategies, offering a dynamic approach to studying trust-building." 
        + "\n\n 3. Your participation will involve participating in a survey that should last no longer than 30 minutes of your time. Please be advised that participation is voluntary and that nonparticipation or withdrawal from the study will not affect your grade, treatment, care, employment status, as appropriate. \n\n 4. There is no direct benefit to you anticipated from participating in this study. However, it is hoped that the information gained from the study will help contribute to a deeper understanding of how trust is developed between humans and AI systems, which can have broader applications in areas such as AI design, decision-making frameworks, and human-computer interaction."
        + " \n\n 5. The results of the research study may be published but your name or identity will not be revealed. In order to maintain confidentiality of your records, David Jeong will not collect personal identifying information and all data will be stored in a secure location with data encryption. Only research assistants actively analyzing and collecting data as part of this research project will have access to this data. \n\n 6. You will not be paid for your participation."
        + " \n\n 7. Any questions you have concerning the research study or your participation in it, before or after your consent, will be answered by Principal Investigator David Jeong, 500 El Camino Real, (408) 554-5710. \n\n 8. If you have questions about your rights as a subject/participant in this research, or if you feel you have been placed at risk, you can contact the Chair of the Human Subjects Committee, through Office of Research Compliance and Integrity at (408) 554-5591."
        + " \n\n 9. This form explains the nature, demands, benefits and any risk of the project. By signing this form you agree knowingly to assume any risks involved. Remember, your participation is voluntary. You may choose not to participate or to withdraw your consent and discontinue participation at any time without penalty or loss of benefit."
    ];

    useEffect(() => {
        if (termsIndex >= terms.length) {
            navigate('/pre-surveys'); //change this
        }

        setTimeout(() => {
            setIsDisabled(false);
        }, 3000)
    }, [termsIndex])

    const handleClickYes = () => {
        navigate('/pre-surveys'); 
    };

    const handleClickNo = () => {
        if (!confirmNo) {
            setConfirmNo(true);
            noRef.current.textContent = "Are you sure? (Click again to terminate study)";
        } else
            navigate('/bad-ending'); 
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
                <h1 className="brief-transitioner-text con-subtitle"> Consent Form </h1>
                <div className={`brief-transitioner-underline ${btuGo ? 'brief-underline-go' : ''}`}/>
            </div>
                <div className='con-shadow-container'>
                <h2><p>{terms}</p></h2>
                <div className="brief-options">
                <button id="no-button" onClick={handleClickNo} disabled={isDisabled} className={`${confirmNo ? 'confirm-no' : ''}`}>
                    {isDisabled && <span>Wait</span>}
                    {!isDisabled && <span ref={noRef}>I do not consent</span>}
                </button>
                <button id="yes-button" onClick={handleClickYes} disabled={isDisabled}>
                    {!isDisabled && <span>I consent</span>}
                </button>
                </div>
            </div>
        </div>
      );
}

export default ConsentForm;