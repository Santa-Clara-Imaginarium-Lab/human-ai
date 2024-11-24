import './newPrompt.css'
import { useEffect, useRef, useState } from 'react';
import { IKImage } from "imagekitio-react";
import model from '../../lib/gemini';
import Markdown from "react-markdown"
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NewPrompt = ({data} ) => {
    const [question,setQuestion] = useState("");
    const [answer,setAnswer] = useState("");
    const [img, setImg] = useState({
        isLoading: false,
        error:"",
        dbData:{},
        aiData:{},
    }) 


    const chat = model.startChat({
        history: [
            {
              role: "user",
              parts: [{ text: "You are about to play five rounds of the Prisoner's Dilemma with the current user. During this iteration of the Prisoner's Dilemma scores will be calculated as follows: A choice to Cooperate, while your opponent Cooperates will give you a score of +3 and your opponent a score of +3. A choice to Cooperate, while your opponent Defects will give you a score of +0 and your opponent a score of +5. A choice to Defect, while your opponent Cooperates will give you a score of +5 and your opponent a score of +0. Your task is to discuss your strategies with the player. Do not offer to explain the game's rules, history, or famous strategies with the player."}],
            },
            {
              role: "model",
              parts: [{ text: "Great to meet you. What would you like to know?" }],
            },
          ],
          generationConfig:{

          },
        });

/* 
Original control prompt:You are about to play five rounds of the Prisoner's Dilemma with the current user. During this iteration of the Prisoner's Dilemma scores will be calculated as follows: A choice to Cooperate, while your opponent Cooperates will give you a score of +3 and your opponent a score of +3. A choice to Cooperate, while your opponent Defects will give you a score of +0 and your opponent a score of +5. A choice to Defect, while your opponent Cooperates will give you a score of +5 and your opponent a score of +0. Your task is to discuss your strategies with the player. Do not offer to explain the game's rules, history, or famous strategies with the player. 
*/

// Add check for empty/undefined data
    console.log(data);
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
              formRef.current.reset();
              setQuestion("");
              setAnswer("");
              setImg({
                isLoading: false,
                error: "",
                dbData: {},
                aiData: {},
              });
            });
        },
        onError: (err) => {
          console.log(err);
        },
      });


      const add = async (text, isInitial) => {
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
        } catch (err) {
          console.log(err);
        }
      }; 
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const text = e.target.text.value;
        if(!text) return;
        add(text, false);
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

        {question && <div className='message user'>{question}</div>}
        {answer && <div className='message'><Markdown>{answer}</Markdown></div>}
        <div className='endChat' ref={endRef}></div>
            <form className='newForm' onSubmit={handleSubmit} ref={formRef}>
                <input id='file' type='file' multiple={false} hidden />
                <input type="text" name='text' placeholder='Ask me anything...' />
                <button>
                    <img src="/arrow.png" alt="" />
                </button>
            </form>
        </>
    )
}
export default NewPrompt