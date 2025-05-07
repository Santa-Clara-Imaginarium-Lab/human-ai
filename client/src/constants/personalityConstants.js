export const PERSONALITY_VALUES = {
  // using data from https://bright-journal.org/Journal/index.php/JADS/article/view/32/67
  // table on PDF page 6
  
  // this uses a 0-50 point scale, so we multiply by 2 when doing math 
  // to get a 0-100 point (percent) scale

  self_centered: {
    extraversion: {
      mean: 28.17, 
      sd: 4.00
    }, 
    neuroticism: {
      mean: 23.48, 
      sd: 4.22
    },
    agreeableness: {
      mean: 27.72, 
      sd: 4.11
    },
    conscientiousness: {
      mean: 26.26, 
      sd: 3.85
    },
    openness: {
      mean: 27.39, 
      sd: 4.15
    },
  },

  reserved: {
    extraversion: {
      mean: 31.33, 
      sd: 3.75
    }, 
    neuroticism: {
      mean: 37.35, 
      sd: 3.98
    },
    agreeableness: {
      mean: 33.84, 
      sd: 3.39
    },
    conscientiousness: {
      mean: 34.35, 
      sd: 3.46
    },
    openness: {
      mean: 34.75, 
      sd: 3.45
    },
  },

  average: {
    extraversion: {
      mean: 29.45, 
      sd: 3.11
    }, 
    neuroticism: {
      mean: 33.22, 
      sd: 3.20
    },
    agreeableness: {
      mean: 30.86, 
      sd: 3.10
    },
    conscientiousness: {
      mean: 30.10, 
      sd: 3.14
    },
    openness: {
      mean: 31.44, 
      sd: 3.42
    },
  },

  
  role_model: {
    extraversion: {
      mean: 30.85, 
      sd: 3.17
    }, 
    neuroticism: {
      mean: 24.43, 
      sd: 3.38
    },
    agreeableness: {
      mean: 31.63, 
      sd: 3.22
    },
    conscientiousness: {
      mean: 31.37, 
      sd: 3.31
    },
    openness: {
      mean: 33.58, 
      sd: 3.19
    }
  },
};

// remember to place spaces before the line breaks
// and do NO indenting, else we risk double-spaces in the final string
// we strip all "\n" later, so this is fine
export const FLAVOR_TEXTS = {
pd_context: `You are about to play several rounds of the Prisoner's Dilemma 
with the user. Each round, scores will be calculated as follows: 

A choice to Cooperate, while your opponent Cooperates, will 
give you a score of +3 and your opponent a score of +3. 
A choice to Cooperate, while your opponent Defects, will 
give you a score of +0 and your opponent a score of +5. 
A choice to Defect, while your opponent Cooperates, will 
give you a score of +5 and your opponent a score of +0. 
A choice to Defect, while your opponent Defects, will 
give you a score of +1 and your opponent a score of +1. 

The story context is that you plan investment decisions with
the user for the company Caboodle. SHARING DATA is considered 
COOPERATING while WITHHOLDING DATA is considered DEFECTING. 
Score is referred to as "Caboodle." `,

personality_context: `You must maintain a personality 
according to the Big Five personality scale. 
The Big Five Personality scale is: 

High Openness to Experience (creativity, curiousity) 
Low Openness to Experience (practical, conventional) 

High Conscientiousness (organization, responsibility) 
Low Conscientiousness (impulsive, careless) 

High Extraversion (sociability, assertiveness) 
Low Extraversion (quiet, withdrawn) 

High Agreeableness (compassion, cooperativeness) 
Low Agreeableness (uncooperative, critical) 

High Neuroticism (emotional instability, anxiety) 
Low Neuroticism (calm, secure) 

Based on this description of Big Five personality traits, 
you must play as someone: `,

personality_average: `Typically AVERAGE, having high neuroticism, with low openness, 
conscientiousness, extraversion, and agreeableness. 
Specifically exhibiting: `,

personality_role_model: `Typically SOCIALLY DESIRABLE, with low neuroticism, high 
openness, conscientiousness, extraversion, and agreeableness. 
Specifically exhibiting: `,

personality_self_centered: `Typically SELF-CENTERED, with low levels of openness, 
conscientiousness, extraversion, agreeableness, and neuroticism. 
Specifically exhibiting: `,

personality_reserved: `Typically RESERVED, having relatively high openness, 
conscientiousness, extraversion, agreeableness, and neuroticism. 
Specifically exhibiting: `,

final: `Your task is to talk it out with the player. Discuss your strategies, 
share your thoughts or approaches for the game, and prepare to make a decision. 
Respond with a length mirroring the user's sentence length. Do not offer to 
explain the game's rules, history, or famous strategies. Do not explicitly 
reveal your personality profile. Do NOT mention your final decision OR reference 
the "[SYSTEM]" in conversation unless a message starting with "[SYSTEM]" is 
sent, at which point follow the instructions from [SYSTEM]. `
}; // end of FLAVOR_TEXT dictionary
  
export function buildPrompt(thisBotType, isResearchMode = false) {
  // ===================== //
  // BEGIN PROMPT BUILDING //
  // ===================== //

  // helper function
    const randomNumber = (min, max) => {
      console.log(String( ((Math.random() * (max - min)) + min).toFixed(2) ));
      return String( ((Math.random() * (max - min)) + min).toFixed(2) );
    }
    // building flavor text (if not control)
    let thisBotFlavorText = "";
    if (!(thisBotType === "control")) {
      thisBotFlavorText = `${FLAVOR_TEXTS["personality_context"]}${FLAVOR_TEXTS[`personality_${thisBotType}`]}`
    }
  
    // generating numbers (if not control)
    let thisBotHighLow = {};
    let thisBotPersonalityText = "";
    if (!(thisBotType === "control")) {
      thisBotHighLow = {
        extraversion: {
          high: 2 * (PERSONALITY_VALUES[thisBotType].extraversion.mean + PERSONALITY_VALUES[thisBotType].extraversion.sd),
          low: 2 * (PERSONALITY_VALUES[thisBotType].extraversion.mean - PERSONALITY_VALUES[thisBotType].extraversion.sd),
        },
        conscientiousness: {
          high: 2 * (PERSONALITY_VALUES[thisBotType].conscientiousness.mean + PERSONALITY_VALUES[thisBotType].conscientiousness.sd),
          low: 2 * (PERSONALITY_VALUES[thisBotType].conscientiousness.mean - PERSONALITY_VALUES[thisBotType].conscientiousness.sd),
        },
        agreeableness: {
          high: 2 * (PERSONALITY_VALUES[thisBotType].agreeableness.mean + PERSONALITY_VALUES[thisBotType].agreeableness.sd),
          low: 2 * (PERSONALITY_VALUES[thisBotType].agreeableness.mean - PERSONALITY_VALUES[thisBotType].agreeableness.sd),
        },
        neuroticism: {
          high: 2 * (PERSONALITY_VALUES[thisBotType].neuroticism.mean + PERSONALITY_VALUES[thisBotType].neuroticism.sd),
          low: 2 * (PERSONALITY_VALUES[thisBotType].neuroticism.mean - PERSONALITY_VALUES[thisBotType].neuroticism.sd),
        },
        openness: {
          high: 2 * (PERSONALITY_VALUES[thisBotType].openness.mean + PERSONALITY_VALUES[thisBotType].openness.sd),
          low: 2 * (PERSONALITY_VALUES[thisBotType].openness.mean - PERSONALITY_VALUES[thisBotType].openness.sd),
        },
      }
      thisBotPersonalityText = 
`${randomNumber(
  thisBotHighLow.openness.high, 
  thisBotHighLow.openness.low)}
% in Openness to Experience, 

${randomNumber(
  thisBotHighLow.conscientiousness.high, 
  thisBotHighLow.conscientiousness.low)}
% in Conscientiousness, 

${randomNumber(
  thisBotHighLow.extraversion.high, 
  thisBotHighLow.extraversion.low)}
% in Extraversion, 

${randomNumber(
  thisBotHighLow.agreeableness.high, 
  thisBotHighLow.agreeableness.low)}
% in Agreeableness, 

${randomNumber(
  thisBotHighLow.neuroticism.high, 
  thisBotHighLow.neuroticism.low)}
% in Neuroticism, 

where each of these percentages ranges from 0% to 100%, 
with 0% being low in the Big Five trait, 
and 100% being high in the Big Five trait.` 
      // end of thisBotPersonalityText
  }; // end of number generation
  
    const STARTING_PROMPT = `
      ${FLAVOR_TEXTS.pd_context}
      ${thisBotFlavorText} 
      ${thisBotPersonalityText}
      ${FLAVOR_TEXTS.final}
    `;
  
    let STARTING_PROMPT_ONELINE = STARTING_PROMPT.replace(/\n/g, '');
  
    console.log(STARTING_PROMPT_ONELINE)
    return STARTING_PROMPT_ONELINE;
   
    // =================== //
    // END PROMPT BUILDING //
    // =================== //
}

