import './newPrompt.css'
import { useEffect, useRef, useState } from 'react';
import { IKImage } from "imagekitio-react";
import model from '../../lib/gemini';
import Markdown from "react-markdown"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {useNavigate, Link} from 'react-router-dom'
import { use } from 'react';


const NewPrompt = ({data, builtPrompt, chatId, speedFlag} ) => {
  let n1 = Date.now();
  console.log("speedFlag: ", speedFlag);
  console.log(data);
  //console.log(chatId);
  //console.log("PROMPT!!!");
  //console.log(builtPrompt)
  
    const [question,setQuestion] = useState("");
    const [answer,setAnswer] = useState("");
    const [img, setImg] = useState({
        isLoading: false,
        error:"",
        dbData:{},
        aiData:{},
    }) 

    const navigate = useNavigate();

    let arr = [
      {
        role: "user", // TURN "ONE ROUND" INTO "FIVE ROUNDS" LATER
        parts: [{ text: builtPrompt}],
      },
      // {
      //   role: "model",
      //   parts: [{ text: "Great to meet you. What would you like to know?" }],
      // },
    ]


    data.history.forEach((item) => {
      // Skip items with empty parts or text
      if (!item.parts || item.parts.length === 0) {
        return;
      }
      
      let dupedItem = JSON.parse(JSON.stringify(item));
      delete dupedItem._id; 

      // Filter out empty parts
      dupedItem.parts = dupedItem.parts.filter(part => {
        return part && part.text !== undefined && part.text !== "";
      });
      
      // Skip if no valid parts remain
      if (dupedItem.parts.length === 0) {
        return;
      }
      
      // Clean up each part
      dupedItem.parts.forEach(part => {
        delete part._id;
        delete part.messageTimestamp;
      });
      
      arr.push(dupedItem);
    })

    console.log("data for chat: ", arr)

    const chat = model.startChat({
      history: arr,
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
              let n2 = Date.now();
              console.log("mutation time taken in ms:")
              console.log(n2 - n1);
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
            console.log("[chunk]",chunkText);
            accumulatedText += chunkText;
            setAnswer(accumulatedText);
          }
    
          console.log("hit mutation");
          mutation.mutate();
          return accumulatedText;
        } catch (err) {
          console.log(err);
          alert("The AI encountered an error. Your message was not recorded. Please try again.");
        }
      }; 
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const text = e.target.text.value;
        if(!text) return;
        add(text, false);
        e.target.reset();
    };


  // useEffect(() => {
  // }, [data]);


  const handleExit = async (e) => {
    /*
    // e.preventDefault();
    console.log("exiting!");
    const decision = await add("[SYSTEM] Decide, COOPERATE or DEFECT? Respond this one time in this format: [SYSTEM] <response>", false)
    // const arrayEnd = (data.history.at(-1).parts[0]); 
    // console.log("arrayEnd ", arrayEnd);
    console.log("<<BOT'S DECISION STATEMENT>> ", decision);

    transitionRef.current.children[0].textContent = "Ready!";
    transitionRef.current.classList.add('col');
    */ 

    navigate('/game', {state: { builtPrompt, chatId, data }});
  };

  const hasRun = useRef(false);

    useEffect(() => {
        console.log("hasRun", hasRun);
        if (!hasRun.current && data) {
          console.log("test for data in INITIAL ADD", data);
          console.log("test for data in INITIAL ADD", data?.history?.length);
          if (data?.history?.length === 1) {
            console.log("INITIAL ADD!");
            add(data.history[0].parts[0].text, true);
          }
        }
        if (!hasRun.current) {
          transitionRef.current.classList.add('go'); 
        }
        hasRun.current = true;

        if (transitionRef.current) {
          if (speedFlag) { 
            transitionRef.current.children[0].textContent = "Chatbot is preparing for the day...";
          }
          else {
            transitionRef.current.children[0].textContent = "Entering Chat...";
          }

          setTimeout(() => {
            console.log("data after in INITIAL ADD", data);
            if (transitionRef.current) {
              transitionRef.current.classList.add('col');

              if (!speedFlag){
                setTimeout(() => {
                  if (transitionRef.current) {
                    transitionRef.current.classList.add('fade');
                    setTimeout(() => {
                      if (transitionRef.current) {
                        transitionRef.current.classList.remove('go');
                      }
                    }, 1000);
                  }
                }, 1000);
              } else {
                setTimeout(() => {
                  handleExit();
                }, 1000);
              }
            }
          }, 1000);
        }
    

      }, [speedFlag, data]); // adding speedFlag dependency should no longer get 429 Too Many Requests

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
          <h1 className="transitioner-text"> Chatbot is thinking... </h1>
        </div>

        {question && <div className='message user'>{question}</div>}
        {answer && <div className='message'><Markdown>{answer}</Markdown></div>}
        <div className="demo-chat-container" ref={endRef}></div>
            <form className="input-area" onSubmit={handleSubmit} ref={formRef}>
                <input id='file' type='file' multiple={false} hidden />
                <input className="chat-input official" type="text" name='text' placeholder='Enter message...' />
                <button className="send-button official">Send</button>
                <button className="send-button official" onClick={handleExit}>Exit Chat</button>
            </form>
        </>
    )
}
export default NewPrompt