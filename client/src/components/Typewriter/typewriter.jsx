import { useState, useEffect } from 'react';

function Typewriter({ text, speed = 100 }) {
    const [displayText, setDisplayText] = useState(''); // The text that is displayed to the user
    const [currentIndex, setCurrentIndex] = useState(0); // The index of the current character in the text

    // Reset state when text changes
    // Make sure the text changes in tutorial 
    useEffect(() => {
        setDisplayText('');
        setCurrentIndex(0);
    }, [text]); // Dependency on text ensures it resets when text changes

    useEffect(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText((prevText) => prevText + text[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, speed);

        return () => clearTimeout(timeout); // Make sure to clear the timeout when the component unmounts
      }
    }, [currentIndex, text, speed]);

    return <p>{displayText}</p>;

  };

  export default Typewriter;