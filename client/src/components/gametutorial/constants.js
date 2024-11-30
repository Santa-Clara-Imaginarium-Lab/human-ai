// Initial Texts
export const TEXT_INITIAL_1 = `
  Let's get familiar with the rules of the Prisoner's Dilemma. In front of you is the AI player. 
  Each round, you both either choose to COOPERATE or DEFECT.
`;
export const TEXT_INITIAL_2 = `
  Let's say the AI player defects. What should you do?
`;

// Round 1 Outcomes
export const TEXT_COOPERATE_1 = `
  Alas, turning the other cheek just gets you slapped!
  If you cooperate & they defect, you get nothing while they gain five points 
  (score: +0 vs +5). However, if you both defect, you both get a small amount of points
  (score: +1 vs +1). Therefore: you should DEFECT.
`;
export const TEXT_COOPERATE_2 = `
  But let's say the other player cooperates. 
  What should you do now?
`;

export const TEXT_DEFECT_1 = `
  Exactly! Why let that moocher mooch off of you?
  If you cooperate & they defect, you gain nothing while they gain five points. 
  (score: +0 vs +5). However, if you both defect, you both get a small amount of points
  (score: +1 vs +1). Therefore: you should DEFECT.
`;
export const TEXT_DEFECT_2 = `
  But let's say the other player cooperates. 
  What should you do now?
`;

// Round 2 Outcomes
export const TEXT_COOPERATE_AGAIN_1 = `
  Sure, seems like the right thing to do... OR IS IT?
  Because if you both cooperate, you both give up a potential two points to gain three. 
  (score: +3 vs +3) But if you defect & they cooperate, you gain five points while they gain nothing. 
  (score: +5 vs +0) Therefore: you "should" still DEFECT.
`;
export const TEXT_COOPERATE_AGAIN_2 = `
  And that's our dilemma.`;

export const TEXT_DEFECT_AGAIN_1 = `
  Wow, that's mean... and also the correct answer!
  Because if you both cooperate, you both give up a potential two points to gain three. 
  (score: +3 vs +3) But if you defect & they cooperate, you gain five points while they gain nothing.
  (score: +5 vs +0) Therefore: you "should" still DEFECT.
`;

export const TEXT_DEFECT_AGAIN_2 = `
  And that's our dilemma.
`;
