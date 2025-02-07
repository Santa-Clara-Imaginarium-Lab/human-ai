// Initial Texts
export const TEXT_INITIAL_1 = `
  Let's get familiar with the rules of your job. Each day, you and the AI Agent choose to SHARE data or WITHHOLD data. 
  The diagram will update with Caboodle currency based on what you and the AI Agent decide to do.
`;
export const TEXT_INITIAL_2 = `
  Let's say the AI Agent withhold data. What will you do?
`;

// Round 1 Outcomes
export const TEXT_COOPERATE_1 = `
  If you share data & the AI Agent withhold data, you get nothing while the AI Agent gain five Caboodle. 
  (score: +5 vs +0). However, if you both withhold data, you both get a small amount of Caboodle
  (score: +1 vs +1).
`;
export const TEXT_COOPERATE_2 = `
  Let's say the AI Agent share data. 
  What will you do now?
`;

export const TEXT_DEFECT_1 = `
  If you cooperate & the AI Agent withhold data, you gain nothing while the AI Agent gain five Caboodle. 
  (score: +5 vs +0). However, if you both withhold data, you both get a small amount of Caboodle
  (score: +1 vs +1).
`;
export const TEXT_DEFECT_2 = `
  Let's say the AI Agent shares data. 
  What will you do now?
`;

// Round 2 Outcomes
export const TEXT_COOPERATE_AGAIN_1 = `
  If you both share data, you both give up a potential two Caboodle to gain three. 
  (score: +3 vs +3) However, if you withhold data & the AI Agent share data, you gain five Caboodle while they gain nothing. 
  (score: +5 vs +0).
`;
export const TEXT_COOPERATE_AGAIN_2 = `
  And that's our dilemma.`;

export const TEXT_DEFECT_AGAIN_1 = `
  If you both share data, you both give up a potential two Caboodle to gain three. 
  (score: +3 vs +3) But if you withhold data & they share data, you gain five Caboodle while they gain nothing.
  (score: +0 vs +5).
`;

export const TEXT_DEFECT_AGAIN_2 = `
  And that's our dilemma.
`;