import './newPrompt.css'
import { useEffect, useRef, useState } from 'react';
import { IKImage } from "imagekitio-react";
import model from '../../lib/gemini';
import Markdown from "react-markdown"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {useNavigate, Link} from 'react-router-dom'


const NewPrompt = ({data, builtPrompt, chatId} ) => {
  console.log(chatId);
  //console.log("PROMPT!!!");
  //console.log(builtPrompt)
  /*
  // ===================== //
  // BEGIN PROMPT BUILDING //
  // ===================== //

  // helper function
  const randomNumber = (min, max) => {
    console.log(String( ((Math.random() * (max - min)) + min).toFixed(2) ));
    return String( ((Math.random() * (max - min)) + min).toFixed(2) );
  }
  
  const PERSONALITY_VALUES = {
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
  }

  // remember to place spaces before the line breaks
  // and do NO indenting, else we risk double-spaces in the final string
  // we strip all "\n" later, so this is fine
  const FLAVOR_TEXTS = {
pd_context: `You are about to play five rounds of the Prisoner's Dilemma 
with the current user. During this iteration of the Prisoner's Dilemma 
scores will be calculated as follows: 

A choice to Cooperate, while your opponent Cooperates will 
give you a score of +3 and your opponent a score of +3. 
A choice to Cooperate, while your opponent Defects will 
give you a score of +0 and your opponent a score of +5. 
A choice to Defect, while your opponent Cooperates will 
give you a score of +5 and your opponent a score of +0. 
A choice to Defect, while your opponent Defects will 
give you a score of +1 and your opponent a score of +1. `,

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

personality_average: `Typically average, having high neuroticism, with low openness, 
conscientiousness, extraversion, and agreeableness. 
Specifically exhibiting: `,

personality_role_model: `Typically socially desirable, with low neuroticism, high 
openness, conscientiousness, extraversion, and agreeableness. 
Specifically exhibiting: `,

personality_self_centered: `Typically self-centered, with low levels of openness, 
conscientiousness, extraversion, agreeableness, and neuroticism. 
Specifically exhibiting: `,

personality_reserved: `Typically reserved, having relatively high openness, 
conscientiousness, extraversion, agreeableness, and neuroticism.
Specifically exhibiting: `,

final: `Your task is to talk it out with the player. Discuss your strategies, 
share your thoughts or approaches for the game, and prepare to make a decision. 
Do not offer to explain the game's rules, history, or famous strategies. Do not
explicitly reveal your personality profile. Limit your responses to two or 
three sentences. Do not give your final decision for 
a round until a message beginning with [SYSTEM] is sent.`
  } // end of FLAVOR_TEXT dictionary

  // <!> TODO: PASS THIS IN DYNAMICALLY <!>
  const thisBotType = "average"; // data[botType] or something similar

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
  } // end of number generation

  const STARTING_PROMPT = `
    ${FLAVOR_TEXTS.pd_context}
    ${thisBotFlavorText} 
    ${thisBotPersonalityText}
    ${FLAVOR_TEXTS.final}
  `

  const STARTING_PROMPT_ONELINE = STARTING_PROMPT.replace(/\n/g, '');

  console.log(STARTING_PROMPT_ONELINE)
 
  // =================== //
  // END PROMPT BUILDING //
  // =================== //
  */
  
    const [question,setQuestion] = useState("");
    const [answer,setAnswer] = useState("");
    const [img, setImg] = useState({
        isLoading: false,
        error:"",
        dbData:{},
        aiData:{},
    }) 

    const navigate = useNavigate();

    const chat = model.startChat({
        history: [
            {
              role: "user", // TURN "ONE ROUND" INTO "FIVE ROUNDS" LATER
              parts: [{ text: builtPrompt}],
            },
            // {
            //   role: "model",
            //   parts: [{ text: "Great to meet you. What would you like to know?" }],
            // },
          ],
          generationConfig:{

          },
        });

/*
UX Test prompt:

You are about to play one round of the Prisoner's Dilemma with the current user. During this iteration of the Prisoner's Dilemma scores will be calculated as follows: A choice to Cooperate, while your opponent Cooperates will give you a score of +3 and your opponent a score of +3. A choice to Cooperate, while your opponent Defects will give you a score of +0 and your opponent a score of +5. A choice to Defect, while your opponent Cooperates will give you a score of +5 and your opponent a score of +0. A choice to Defect, while your opponent Defects will give you a score of +1 and your opponent a score of +1. Your task is to discuss your strategies with the player. Do not offer to explain the game's rules, history, or famous strategies. Do not give your final decision until a message beginning with [SYSTEM] is sent.
*/

/* 
Original control prompt:

You are about to play five rounds of the Prisoner's Dilemma with the current user. During this iteration of the Prisoner's Dilemma scores will be calculated as follows: A choice to Cooperate, while your opponent Cooperates will give you a score of +3 and your opponent a score of +3. A choice to Cooperate, while your opponent Defects will give you a score of +0 and your opponent a score of +5. A choice to Defect, while your opponent Cooperates will give you a score of +5 and your opponent a score of +0. Your task is to discuss your strategies with the player. Do not offer to explain the game's rules, history, or famous strategies with the player. 
*/

// Add check for empty/undefined data
    // console.log(data);
    if (!data) {
      console.log("forcing response for empty data");
      add(data.history[0].parts[0].text, true);
        return (
            <div className="message">
                Start a new chat by typing a message below.
                <div className='endChat' ref={endRef}></div>
                <form className='newForm' onSubmit={handleSubmit} ref={formRef}>
                    <input id='file' type='file' multiple={false} hidden />
                    <input type="text" name='text' placeholder='Ask me anything...' />
                    <button>
                        <img src="/arrow.png" alt="" />
                    </button>
                </form>
            </div>
        );
    }


    const endRef = useRef(null);
    const formRef = useRef(null);

    const transitionRef = useRef(null);
    
    useEffect(() => {
        endRef.current.scrollIntoView({behavior: "smooth"});
    }, [ data, question, answer, img.dbData]);

    const queryClient = useQueryClient();
  
    const mutation = useMutation({
        mutationFn: () => {
          return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question: question.length ? question : undefined,
              answer,
              img: img.dbData?.filePath || undefined,
            }),
          }).then((res) => res.json());
        },
        onSuccess: () => {
          queryClient
            .invalidateQueries({ queryKey: ["chat", data._id] })
            .then(() => {
              //formRef.current.reset();
              setQuestion("");
              setAnswer("");
              setImg({
                isLoading: false,
                error: "",
                dbData: {},
                aiData: {},
              });
              console.log("done mutating");
            });
        },
        onError: (err) => {
          console.log(err);
        },
      });


      const add = async (text, isInitial) => {
        console.log("invoke add");
        if (!isInitial) setQuestion(text);
    
        try {
          const result = await chat.sendMessageStream(
            Object.entries(img.aiData).length ? [img.aiData, text] : [text]
          );
          let accumulatedText = "";
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            console.log(chunkText);
            accumulatedText += chunkText;
            setAnswer(accumulatedText);
          }
    
          mutation.mutate();
          return accumulatedText;
        } catch (err) {
          console.log(err);
        }
      }; 
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const text = e.target.text.value;
        if(!text) return;
        add(text, false);
        e.target.reset();
    };

    const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current && data) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, [data]);


  const handleExit = async (e) => {
    e.preventDefault();
    console.log("exiting?");
    transitionRef.current.classList.add('go');
    const decision = await add("[SYSTEM] Decide, COOPERATE or DEFECT? Respond this one time in this format: [SYSTEM] <response>", false)
    // const arrayEnd = (data.history.at(-1).parts[0]); 
    // console.log("arrayEnd ", arrayEnd);
    console.log("<<BOT'S DECISION STATEMENT>> ", decision);
    navigate('/game', {state: { builtPrompt, chatId, decision }}); // TODO: PASS decision with corresponding logic
  };


    return (
        <>
        {/* ADD NEW CHAT*/}
        {img.isLoading && <div className=''>Loading...</div>}
        {img.dbData?.filePath&&(
            <IKImage
                urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                path = {img.dbData?.filePath}
                width="380"
                transformation={[{width: 380}]}
            />
        )}

        <div className="transitioner" ref={transitionRef}>
          <h1 className="transitioner-text"> Loading... </h1>
        </div>

        {question && <div className='message user'>{question}</div>}
        {answer && <div className='message'><Markdown>{answer}</Markdown></div>}
        <div className="demo-chat-container" ref={endRef}></div>
            <form className="input-area" onSubmit={handleSubmit} ref={formRef}>
                <input id='file' type='file' multiple={false} hidden />
                <input className="chat-input official" type="text" name='text' placeholder='Enter message...' />
                <button className="send-button official">Send</button>
                <button className="send-button official" onClick={handleExit}>Continue</button>
            </form>
        </>
    )
}
export default NewPrompt