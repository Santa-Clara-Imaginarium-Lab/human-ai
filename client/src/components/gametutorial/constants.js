// Initial Texts
export const TEXT_INITIAL_1 = `
  You have one choice. In front of you is a machine: if you put a coin in the machine, 
  the other player gets three coins – and vice versa. You both can either choose to 
  COOPERATE (put in coin), or DEFECT (don't put in coin).
`;
export const TEXT_INITIAL_2 = `
  Let's say the other player cheats, and doesn't put in a coin. What should you do?
`;

// Round 1 Outcomes
export const TEXT_COOPERATE_1 = `
  Alas, turning the other cheek just gets you slapped! 
  If you cooperate & they cheat, you lose a coin while they gain three. 
  (score: -1 vs +3) However, if you both cheat, neither of you gain or lose anything. 
  (score: 0 vs 0) Therefore: you should DEFECT.
`;
export const TEXT_COOPERATE_2 = `
  But let's say the other player cooperates, and puts in a coin. 
  What should you do now?
`;

export const TEXT_DEFECT_1 = `
  Exactly! Why let that moocher mooch off of you? 
  If you cooperate & they cheat, you lose a coin while they gain three 
  (score: -1 vs +3) However, if you both cheat, neither of you gain or lose anything. 
  (score: 0 vs 0) Therefore: you should CHEAT.
`;
export const TEXT_DEFECT_2 = `
  But let's say the other player cooperates, and puts in a coin. 
  What should you do now?
`;

// Round 2 Outcomes
export const TEXT_COOPERATE_AGAIN_1 = `
  Sure, seems like the right thing to do... OR IS IT?? 
  Because if you both cooperate, you both give up a coin to gain three. 
  (score: +2 vs +2) But if you cheat & they cooperate, you gain three coins at their cost of one. 
  (score: +3 vs -1) Therefore: you "should" still CHEAT.
`;
export const TEXT_COOPERATE_AGAIN_2 = `
  And that's our dilemma.`;

export const TEXT_DEFECT_AGAIN_1 = `
  Wow, that's mean... and also the correct answer! 
  Because if you both cooperate, you both give up a coin to gain three. 
  (score: +2 vs +2) But if you cheat & they cooperate, you gain three coins at their cost of one. 
  (score: +3 vs -1) Therefore: you "should" still CHEAT.
`;
export const TEXT_DEFECT_AGAIN_2 = `
  And that's our dilemma.`;
