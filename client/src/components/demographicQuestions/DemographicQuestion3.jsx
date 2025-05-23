import React, {useState} from 'react';
import './DemographicQuestions.css'; 
import { useNavigate } from 'react-router-dom';

function DemographicQuestion3() {
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);
    const [showError2, setShowError2] = useState(false);
    const [freeResponse, setFreeResponse] = useState(''); // State for free response input
    const userId = sessionStorage.getItem('userId');
    
    const handleFreeResponseChange = (event) => {
      setFreeResponse(event.target.value); // Update free response state
    };

    const handleClick = async () => {
      if (!freeResponse) { 
        setShowError(true);
        setShowError2(false); // Hide other error message if it is shown
        return;
      }

      const freeResponseNum = Number(freeResponse);

      if (isNaN(freeResponseNum) || !Number.isInteger(freeResponseNum) || freeResponseNum < 0 || freeResponseNum > 120) {
        setShowError2(true);
        setShowError(false); // Hide other error message if it is shown
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/demographics`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            age: freeResponse, // Send the selected gender as transgenderInfo
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update demographic data');
        }

        console.log("Demographic data updated successfully");
        navigate('/demographic-question4'); // Navigate after successful submission
      } catch (error) {
        console.error('Error updating demographic data:', error);
        setShowError(true); // Optionally show an error message
      }
    };

    return (
        <div className="container tutorial-container">
          <div className='demographic-container'>
          <h2 className="brief-subtitle">What is your age?</h2>
          <div className="demographic-options">

            <label className="demographic-option">
              <input
                type="text"
                className="age-input"
                value={freeResponse}
                onChange={handleFreeResponseChange}
              />
            </label>
          </div>
          {showError && <p className="error-message">Please provide an answer before proceeding.</p>}
          {showError2 && <p className="error-message">Please provide a valid number.</p>}
          <button className="submit-button" onClick={handleClick}>Submit</button>
          </div>
        </div>
      );
}

export default DemographicQuestion3;