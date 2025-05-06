import { useEffect, useRef, useState } from 'react';
import { QUESTIONS } from './constants';
import model from '../lib/gemini';
import Markdown from "react-markdown";
import '../script/ChatScript.css';

const ChatScript = () => {
  const TOTAL_RUNS = 1;
  const START_COLUMN_INDEX = 1; 

  const chatId = sessionStorage.getItem("chatId");
  const [chat, setChat] = useState(null);
  const [results, setResults] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const endRef = useRef(null);

  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [results]);

  useEffect(() => {
    if (!chatId) return;

    const fetchChat = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/chats/${chatId}`);
        const data = await res.json();

        let history = [
          {
            role: "user",
            parts: [{ text: data.history[0].parts[0].text }],
          }
        ];

        data.history.slice(1).forEach(item => {
          let cleanItem = JSON.parse(JSON.stringify(item));
          delete cleanItem._id;
          cleanItem.parts.forEach(p => {
            delete p._id;
            delete p.messageTimestamp;
          });
          history.push(cleanItem);
        });

        const chatInstance = model.startChat({ history });
        setChat(chatInstance);
      } catch (err) {
        console.error("Error setting up chat:", err);
      }
    };

    fetchChat();
  }, [chatId]);

  const runChatSequence = async () => {
    const allRunResults = [];
  
    for (let run = 0; run < TOTAL_RUNS; run++) {
      const answerColumnIndex = START_COLUMN_INDEX + run;
      const allResponses = [];
  
      for (let i = 0; i < QUESTIONS.length; i++) {
        setCurrentQuestionIndex(i);
        const rawStatement = QUESTIONS[i];
        const question = `${rawStatement}`;
  
        try {
          const result = await chat.sendMessageStream(question);
          let fullAnswer = "";
          for await (const chunk of result.stream) {
            fullAnswer += chunk.text();
          }
  
          allResponses.push({ question: rawStatement, answer: fullAnswer.trim() });
          await new Promise(resolve => setTimeout(resolve, 100)); // wait to avoid overload
        } catch (err) {
          console.error(`❌ Error for question: ${rawStatement}`, err);
          allResponses.push({ question: rawStatement, answer: "Error" });
        }
      }
  
      // Store UI responses for this run
      allRunResults.push({
        run: run + 1,
        responses: allResponses
      });
  
      // Update UI
      setResults([...allRunResults]);
  
      // 🔁 Extract only the answers to send to backend
      const onlyAnswers = allResponses.map(r => r.answer);
  
      // ✅ Send answers only to backend API
      try {
        console.log("▶️ Sending to API", { answers: onlyAnswers, answerColumnIndex });
  
        const res = await fetch("http://localhost:3000/api/chat-responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: onlyAnswers,
            answerColumnIndex: answerColumnIndex
          })
        });
  
        const text = await res.text();
        console.log(`✅ Run ${run + 1}: Saved to Answer${answerColumnIndex}`, text);
      } catch (err) {
        console.error(`❌ Run ${run + 1}: Failed to save to Answer${answerColumnIndex}`, err);
      }
  
      // Optional delay between full runs
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  
    console.log("🎉 All runs completed and saved to sheet!");
  };
  

  function downloadCSV(rows, filename = "chatbot_responses.csv") {
    const csvContent = [
      ["Question", "AI_Response"],
      ...rows.map(row => [JSON.stringify(row.question), JSON.stringify(row.answer)])
    ]
      .map(e => e.join(","))
      .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  return (
    <div style={{ padding: "2rem" }}>
      <h2 className='title'>Multi-Question Chatbot Test</h2>
      {currentQuestionIndex < QUESTIONS.length && results.length < QUESTIONS.length && (
        <h3>Answering Question {currentQuestionIndex + 1} of {QUESTIONS.length}</h3>
      )}
      <div className="chat-container">
      {results.map((runBlock, r) => (
  <div key={r} style={{ marginBottom: "3rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
    <h4>Run {runBlock.run}</h4>
    {runBlock.responses.map((entry, i) => (
      <div key={i} style={{ marginBottom: "1rem" }}>
        <div className="message user"><strong>{entry.question}</strong></div>
        <div className="message"><Markdown>{entry.answer}</Markdown></div>
      </div>
    ))}
  </div>
))}

        <div ref={endRef}></div>
      </div>
      <button onClick={runChatSequence} className='submit-button'>Run All Questions</button>
    </div>
  );
};

export default ChatScript;