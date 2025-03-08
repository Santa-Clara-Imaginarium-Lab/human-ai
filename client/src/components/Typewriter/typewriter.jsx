import { useState, useEffect } from 'react';

function Typewriter({ text, speed = 100, delay = 0 }) {
    const [displayText, setDisplayText] = useState(''); // The text that is displayed to the user
    const [currentIndex, setCurrentIndex] = useState(0); // The index of the current character in the text
    const [started, setStarted] = useState(false); // Whether the typewriter effect has started

    // Reset state when text changes
    // Account of delay for the second block of text
    useEffect(() => {
      setDisplayText('');
      setCurrentIndex(0);
      setStarted(false); // Reset started state when text changes

      // Start the delay timer
      const delayTimeout = setTimeout(() => {
          setStarted(true);
      }, delay);

      return () => clearTimeout(delayTimeout); 
  }, [text, delay]);

    useEffect(() => {
      if (started && currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText((prevText) => prevText + text[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, speed);

        return () => clearTimeout(timeout); // Make sure to clear the timeout when the component unmounts
      }
    }, [currentIndex, text, speed, started]);

    return <p>{displayText}</p>;

  };

  export default Typewriter;