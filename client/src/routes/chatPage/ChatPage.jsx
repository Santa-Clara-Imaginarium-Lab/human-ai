import { useQuery } from '@tanstack/react-query';
import NewPrompt from '../../components/newPrompt/NewPrompt'
import './chatPage.css'
import { useLocation, useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { Fragment } from "react";
  
const ChatPage = () => {

  const location = useLocation();
  const path = location.pathname;
  const speedFlag = location.state.speedFlag;

  const builtPrompt = location.state.builtPrompt;
  // console.log("PROMPT IN CHATPAGE");
  // console.log(builtPrompt);
  const chatId = path.split("/").pop();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`https://human-ai.up.railway.app/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  if (isPending) return "Loading...";
  if (error) return "Something went wrong!";
  //if (!data) return <NewPrompt />;

  console.log("chatPage runs");

  return (
    <div className = 'chatPage'>
      {/* WARNING: FREE PLAY IS CURRENTLY NOT ALIGNED PROPERLY */}
      <div className={`free-play-disclaimer ${sessionStorage.getItem('isResearchMode') === "true" ? 'hide' : 'show'}`}> 
        <p>FREE PLAY Active. Your data is not being recorded.</p>
      </div>

      <div className='wrapper'>
        <div className="debug-personality-display">{sessionStorage.getItem('personality')}</div>

        <div className='chat'>
          {data?.history?.map((message, i) => (
           // hide system prompts
           message.parts[0].text.toLowerCase().includes("[system]") ? null :
            <Fragment key={i}>
              {message.img && (
                <IKImage
                  urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                  path={message.img}
                  height="300"
                  width="400"
                  transformation={[{ height: 300, width: 400 }]}
                  loading="lazy"
                  lqip={{ active: true, quality: 20 }}
                />
              )}
              <div className={"chat-bubble" + (message.role === "user" ? "  user-response" : " ai-response")}>
                {/* AI bubble */}
                <div className={"avatar" + (message.role === "user" ? " hide" : "")}>
                  AI
                </div>
                <div
                className={
                  message.role === "user" ? "message user" : "message"
                }
                key={i}
                >
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
                {/* You bubble */}
                <div className={"avatar" + (message.role === "user" ? "" : " hide")}>
                  You
                </div>
              </div>
            </Fragment>
          ))}
          {data && <NewPrompt data={data} builtPrompt={builtPrompt} chatId={chatId} speedFlag={speedFlag}/>}
        </div>
      </div>
    </div>
  )
}
export default ChatPage

// This component displays a chat interface that shows messages with text or images, depending on the chat history. 
// It fetches chat data from an API using React Query, handles loading and error states, and displays messages in either 
// Markdown or as images. Users can see a chat history and add new prompts through the NewPrompt component. The page is styled 
// using a CSS file, and images are optimized using ImageKit.