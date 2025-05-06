import './dashboardPage.css';
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useUser } from "../../context/UserContext";
import { useState } from 'react';
import personalities from '../../constants/personalities';
import { buildPrompt } from '../../constants/personalityConstants';

function pickRandomPersonality() {
  const existingPersonality = sessionStorage.getItem("personality");
  if (existingPersonality) {
    return existingPersonality;
  }
  // handle forced scenarios
  const forcedPersonality = sessionStorage.getItem("forcedPersonality");
  if (forcedPersonality && forcedPersonality !== "random") {
    return forcedPersonality;
  } 
  
  // standard scenarios
  const remainingPersonalities = JSON.parse(sessionStorage.getItem("remainingPersonalities"));
  const personalitiesArr = JSON.parse(sessionStorage.getItem("personalitiesArr"));
  
  if (!remainingPersonalities) { // if we don't have a list of personalities, make one
    sessionStorage.setItem("remainingPersonalities", JSON.stringify(personalities));
    sessionStorage.setItem("personalitiesArr", JSON.stringify([]));
    return pickRandomPersonality();
  }

  const randomIndex = Math.floor(Math.random() * remainingPersonalities.length);
  const nextPersonality = remainingPersonalities[randomIndex];
  
  // Remove personality from list of remaining personalities
  remainingPersonalities.splice(randomIndex, 1);
  sessionStorage.setItem("remainingPersonalities", JSON.stringify(remainingPersonalities));
  
  // Add personality to list of personalities the user has seen
  personalitiesArr.push(nextPersonality);
  sessionStorage.setItem("personalitiesArr", JSON.stringify(personalitiesArr));

  return nextPersonality;
}

const DashboardPage = () => {

    const [debounce,setDebounce] = useState(true);

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { userId } = useUser();

    const transitionRef = useRef(null);
  // Add new query to fetch user's chats
  const { data: userChats } = useQuery({
    queryKey: ["userChats", userId],
    queryFn: () => {
      if (!userId) return [];
      return fetch(`https://human-ai.up.railway.app/api/userchats?userId=${userId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        });
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (debounce) {
      // Check if we have a chatId from ConsentForm
      const existingChatId = sessionStorage.getItem('chatId');
      console.log('Checking for existing chatId:', existingChatId);
      
      if (existingChatId) {
        console.log('Found existing chatId from ConsentForm:', existingChatId);
        // We have a chatId from ConsentForm, use that
        const builtPrompt = sessionStorage.getItem('builtPrompt');
        console.log('Using built prompt from ConsentForm:', builtPrompt);
        const speedFlag = true;
        navigate(`/dashboard/chats/${existingChatId}`, { state: { builtPrompt, none: null, speedFlag } });
        setDebounce(false);
      } else if (userChats) {
        // No chatId from ConsentForm, proceed with normal flow
        if (userChats.length > 0) {
          console.log('Using existing chats:', userChats.length);
          const researchMode = sessionStorage.getItem('isResearchMode');
          // User has existing chats, navigate to most recent one
          const mostRecentChat = userChats[userChats.length - 1];
          const botPersonality = pickRandomPersonality();
          sessionStorage.setItem("personality", botPersonality);
          const builtPrompt = buildPrompt(botPersonality, researchMode);
          const speedFlag = true;
          navigate(`/dashboard/chats/${mostRecentChat._id}`, { state: { builtPrompt, none: null, speedFlag } });
        } else {
          console.log('No existing chats, creating new one');
          // No existing chats, create new one
          mutation.mutate("begin");
        }
        setDebounce(false);
      }
    }
  }, [userChats, debounce, navigate]);

  const mutation = useMutation({
    mutationFn: (text) => {
      if (!userId) {
        throw new Error('No userId found');
      }
      
      return fetch(`https://human-ai.up.railway.app/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text,
          userId 
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      });
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats", userId] });
      
      const botPersonality = pickRandomPersonality();
      sessionStorage.setItem("personality", botPersonality);
      console.log('Bot Personality: ', botPersonality);

            const researchMode = sessionStorage.getItem('isResearchMode');
            const builtPrompt = buildPrompt(botPersonality, researchMode); // Include researchMode parameter
            console.log(builtPrompt);
            const none = null;
            const speedFlag = true;
            navigate(`/dashboard/chats/${id}`, { state: { builtPrompt, none, speedFlag } });
        },
        onError: (error) => {
            console.error("Mutation error:", error);
            alert("Failed to create chat. Please try again.");
        }
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if(!text) return;
        mutation.mutate(text);
    };

  // safety: render bottom form in case redirect above does not work
  return (
    <div className = 'dashboardPage'>
      <div className="transitioner go" ref={transitionRef}>
        <h1 className="transitioner-text">Preparing Chatbot...</h1>
      </div>
      <div className='formContainer'>
        <form onSubmit={handleSubmit}>
          <input type="text" name='text' placeholder='Ask me anything...' />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  )
}
export default DashboardPage

//This is a dashboard page where users can type a message or question into an input box and submit it. The app sends the text to the server, creates a new chat, updates the cached data, and redirects the user to a chat page with the new chat ID. It uses React Query for managing the data fetching and mutation logic, making the code more efficient and responsive.