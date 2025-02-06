import React, {useState} from 'react';
import './DemographicQuestions.css'; 
import { useNavigate } from 'react-router-dom';

function DemographicQuestion2() {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('');
    const [showError, setShowError] = useState(false);
    const [showError2, setShowError2] = useState(false);

    const handleOptionChange = (event) => {
      const value = event.target.value;
      setSelectedOption(value);
      setShowError(false); // Hide error message if an option is selected

      if (value !== "Other") {
        document.querySelector('.gender-input').value = ''; // Clear the textbox
      }
    };

    const handleClick = () => {
      if (!selectedOption) {
        setShowError(true);
        return;
      }
      if (selectedOption === "Other" && !document.querySelector('.gender-input').value) {
        setShowError2(true); // Show error if "Other" is selected but textbox is empty
        return;
      }
      navigate('/demographic-question3'); 
    };

    return (
        <div className="container tutorial-container">
          <div className='demographic-container'>
          <h2 className="brief-subtitle">Do you identify as transgender?</h2>
          <div className="demographic-options">
          <label className="demographic-option">
              <input
                type="radio"
                value="Yes"
                checked={selectedOption === "Yes"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>Yes</p>
            </label>

            <label className="demographic-option">
              <input
                type="radio"
                value="No"
                checked={selectedOption === "No"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>No</p>
            </label>

            <label className="demographic-option">
              <input
                type="radio"
                value="Other"
                checked={selectedOption === "Other"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>Other (Please specify)</p>
              <input
                type="text"
                className="gender-input"
                onChange={(e) => {
                  handleOptionChange({ target: { value: "Other" } }); // Keep "Other" selected
                }}
              />
            </label>
          </div>
          {showError && <p className="error-message">Please select an option before proceeding.</p>}
          {showError2 && <p className="error-message">Please specify an answer before proceeding.</p>}
          <button className="submit-button" onClick={handleClick}>Submit</button>
          </div>
        </div>
      );
}

export default DemographicQuestion2;