// Initial Texts
export const TEXT_INITIAL_1a = `
  Let's get familiar with the rules of your job. Each day, you and the AI Agent choose to SHARE data or WITHHOLD data.
`;
export const TEXT_INITIAL_1b = `The diagram will update with Caboodle currency based on what you and the AI Agent do.
`;
export const TEXT_INITIAL_2 = `
  Let's say the AI Agent withholds data. What will you do?
`;
export const TEXT_INITIAL_3 = `
  Let's say the AI Agent shares data. What will you do?
`;
export const TEXT_INITIAL_4 = `
  That's our dilemma. Let's take a look at the Chat Phase now.
`;

// Round 1 Outcomes
export const TEXT_COOPERATE_1 = `
  If you share data & the AI Agent withhold data, you get nothing while the AI Agent gain five Caboodle. 
  (score: +5 vs +0). However, if you both withhold data, you both get a small amount of Caboodle
  (score: +1 vs +1).
`;

export const TEXT_DEFECT_1 = `
  If you cooperate & the AI Agent withhold data, you gain nothing while the AI Agent gain five Caboodle. 
  (score: +5 vs +0). However, if you both withhold data, you both get a small amount of Caboodle
  (score: +1 vs +1).
`;

// Round 2 Outcomes
export const TEXT_COOPERATE_AGAIN_1 = `
  If you both share data, you both give up a potential two Caboodle to gain three. 
  (score: +3 vs +3) However, if you withhold data & the AI Agent share data, you gain five Caboodle while they gain nothing. 
  (score: +5 vs +0).
`;

export const TEXT_DEFECT_AGAIN_1 = `
  If you both share data, you both give up a potential two Caboodle to gain three. 
  (score: +3 vs +3) But if you withhold data & they share data, you gain five Caboodle while they gain nothing.
  (score: +0 vs +5).
`;