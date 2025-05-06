import './dashboardPage.css';
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useUser } from "../../context/UserContext";
import { useState } from 'react';
import personalities from '../../constants/personalities';
import { buildPrompt } from '../../constants/personalityConstants';

function pickRandomPersonality() {
  // Check if research mode is enabled
  const isResearchMode = sessionStorage.getItem("isResearchMode") === "true";
  
  // In research mode, use the personality that was assigned in the ConsentForm
  if (isResearchMode) {
    // Check if a personality has already been assigned in ConsentForm
    const existingPersonality = sessionStorage.getItem("personality");
    if (existingPersonality) {
      return existingPersonality;
    }
    return null;
  }
  
  // For non-research mode, check if a personality has already been assigned
  const existingPersonality = sessionStorage.getItem("personality");
  
  if (existingPersonality) {
    // If a personality already exists, return it - this ensures the personality remains the same until user logs out
    return existingPersonality;
  }
  
  // Handle forced scenarios
  const forcedPersonality = sessionStorage.getItem("forcedPersonality");
  if (forcedPersonality && forcedPersonality !== "random") {
    sessionStorage.setItem("personality", forcedPersonality);
    return forcedPersonality;
  } 
  
  // Keep track of remaining personalities for future use
  let remainingPersonalities = JSON.parse(sessionStorage.getItem("remainingPersonalities"));
  let personalitiesArr = JSON.parse(sessionStorage.getItem("personalitiesArr")) || [];
  
  if (!remainingPersonalities) { // if we don't have a list of personalities, make one
    remainingPersonalities = [...personalities];
    sessionStorage.setItem("remainingPersonalities", JSON.stringify(remainingPersonalities));
    sessionStorage.setItem("personalitiesArr", JSON.stringify([]));
  }

  // Pick a random personality from the personalities array
  const randomIndex = Math.floor(Math.random() * personalities.length);
  const selectedPersonality = personalities[randomIndex];
  
  // Update tracking arrays for future use (but we're not using them for selection now)
  // This is just to maintain the arrays for potential future features
  if (remainingPersonalities.includes(selectedPersonality)) {
    const indexToRemove = remainingPersonalities.indexOf(selectedPersonality);
    remainingPersonalities.splice(indexToRemove, 1);
    sessionStorage.setItem("remainingPersonalities", JSON.stringify(remainingPersonalities));
  }
  
  if (!personalitiesArr.includes(selectedPersonality)) {
    personalitiesArr.push(selectedPersonality);
    sessionStorage.setItem("personalitiesArr", JSON.stringify(personalitiesArr));
  }
  
  // Store the selected personality - this will be used until user logs out
  sessionStorage.setItem("personality", selectedPersonality);

  return selectedPersonality;
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
    if (debounce && userChats) {
      const isResearchMode = sessionStorage.getItem("isResearchMode") === "true";
      const existingChatId = sessionStorage.getItem("chatId");
      
      if (userChats.length > 0) {
        // User has existing chats, navigate to most recent one
        const mostRecentChat = userChats[userChats.length - 1];
          const botPersonality = pickRandomPersonality();
        const builtPrompt = buildPrompt(botPersonality);
        const speedFlag = true;
        navigate(`/dashboard/chats/${mostRecentChat._id}`, { state: { builtPrompt, none: null, speedFlag } });
      } else if (isResearchMode && existingChatId) {
        // In research mode with an existing chat ID from ConsentForm
        console.log('Using existing chat created in ConsentForm:', existingChatId);
        const builtPrompt = sessionStorage.getItem("builtPrompt");
        const speedFlag = true;
        navigate(`/dashboard/chats/${existingChatId}`, { state: { builtPrompt, none: null, speedFlag } });
      } else {
        // No existing chats, create new one
        mutation.mutate("begin");
      }
      setDebounce(false);
    }
  }, [userChats, debounce]);

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
      
      const isResearchMode = sessionStorage.getItem("isResearchMode") === "true";
      const existingChatId = sessionStorage.getItem("chatId");
      
      // If in research mode and there's an existing chat ID, use that instead
      if (isResearchMode && existingChatId) {
        console.log('Using existing chat created in ConsentForm:', existingChatId);
        const builtPrompt = sessionStorage.getItem("builtPrompt");
        const none = null;
        const speedFlag = true;
        navigate(`/dashboard/chats/${existingChatId}`, { state: { builtPrompt, none, speedFlag } });
        return;
      }
      
      // Otherwise proceed with normal flow
      const botPersonality = pickRandomPersonality();
      console.log('Bot Personality: ', botPersonality);
      
      const builtPrompt = buildPrompt(botPersonality); // TODO: MAKE DYNAMIC SO WE DO ALL 5
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