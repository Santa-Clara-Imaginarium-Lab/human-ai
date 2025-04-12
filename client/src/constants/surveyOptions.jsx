const options = [
    "I agree strongly",
    "I agree somewhat",
    "I'm neutral about it",
    "I disagree somewhat",
    "I disagree strongly",
    "I do not use AI",
  ];

  const optionValueMap = {
    "I agree strongly": 5,
    "I agree somewhat": 4,
    "I'm neutral about it": 3,
    "I disagree somewhat": 2,
    "I disagree strongly": 1,
    "I do not use AI": 0,
  };

  const postGameOptionValueMap = {
    "Strongly Agree": 5,
    "Somewhat Agree": 4,
    "Neutral": 3,
    "Somewhat Disagree": 2,
    "Strongly Disagree": 1,
  };

export {options, optionValueMap, postGameOptionValueMap};