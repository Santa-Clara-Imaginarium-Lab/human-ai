import React, {useState} from 'react';
import './DemographicQuestions.css'; 
import { useNavigate } from 'react-router-dom';

function DemographicQuestion4() {
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showError, setShowError] = useState(false);
    const userId = sessionStorage.getItem('userId'); // Assuming userId is stored in sessionStorage

    const handleOptionChange = (event) => {
      const value = event.target.value;
      setShowError(false); // Hide error message if an option is selected

      // Update selected options
      setSelectedOptions(prev => 
        prev.includes(value) ? prev.filter(option => option !== value) : [...prev, value]
      );
    };

    const handleClick = async () => {
      if (selectedOptions.length === 0) { // Check if no options are selected
        setShowError(true);
        return;
      }

      try {
        const response = await fetch(`https://human-ai.up.railway.app/api/demographics`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            ethnicity: selectedOptions, // Send selected options as ethnicity
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update demographic data');
        }

        console.log("Demographic data updated successfully");
        navigate('/tutorial'); // Navigate after successful submission
      } catch (error) {
        console.error('Error updating demographic data:', error);
        setShowError(true); // Optionally show an error message
      }
    };

    return (
        <div className="container tutorial-container">
          <div className='demographic-container'>
          <h2 className="demo-brief-subtitle">Choose one or more races you consider yourself to be</h2>
          <div className="demographic-options">
            <label className="demographic-option">
              <input
                type="checkbox"
                value="White or Caucasian"
                checked={selectedOptions.includes("White or Caucasian")}
                onChange={handleOptionChange}
              />
              <p>White or Caucasian</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="Black or African American"
                checked={selectedOptions.includes("Black or African American")}
                onChange={handleOptionChange}
              />
              <p>Black or African American</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="American Indian/Native American or Alaska Native"
                checked={selectedOptions.includes("American Indian/Native American or Alaska Native")}
                onChange={handleOptionChange}
              />
              <p>American Indian/Native American or Alaska Native</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="Asian"
                checked={selectedOptions.includes("Asian")}
                onChange={handleOptionChange}
              />
              <p>Asian</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="Native Hawaiian or Other Pacific Islander"
                checked={selectedOptions.includes("Native Hawaiian or Other Pacific Islander")}
                onChange={handleOptionChange}
              />
              <p>Native Hawaiian or Other Pacific Islander</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="Middle Eastern or North African (MENA)"
                checked={selectedOptions.includes("Middle Eastern or North African (MENA)")}
                onChange={handleOptionChange}
              />
              <p>Middle Eastern or North African (MENA)</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="Other"
                checked={selectedOptions.includes("Other")}
                onChange={handleOptionChange}
              />
              <p>Other</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="Prefer not to say"
                checked={selectedOptions.includes("Prefer not to say")}
                onChange={handleOptionChange}
              />
              <p>Prefer not to say</p>
            </label>

          </div>
          {showError && <p className="error-message">Please select at least one option before proceeding.</p>}
          <button className="submit-button" onClick={handleClick}>Submit</button>
          </div>
        </div>
      );
}

export default DemographicQuestion4;