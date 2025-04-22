import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatHistory.css';

function ChatHistory() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);   
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://human-ai.up.railway.app/api/chathistory')
      .then(res => res.json())
      .then(data => {
        const uniqueUsers = [...new Set(data.map(chat => chat.userId))];
        setUsers(uniqueUsers);
      });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetch(`https://human-ai.up.railway.app/api/chats?userId=${selectedUser}`)
        .then(res => res.json())
        .then(data => setMessages(data[0]?.history || []));
    }
  }, [selectedUser]);

  const filteredUsers = users.filter(user =>
    user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-history-container">
      <div className="user-panel">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search user..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-item"
          />
        </div>
        {filteredUsers.map((userId, idx) => (
          <div
            key={idx}
            className={`user-item ${userId === selectedUser ? 'active' : ''}`}
            onClick={() => setSelectedUser(userId)}
          >
            {userId}
          </div>
        ))}
      </div>
      <div className="chat-panel">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.role === 'user' ? 'user-response' : 'ai-response'}`}
          >
            <div className="avatar">{msg.role === 'user' ? 'You' : 'AI'}</div>
            <div className="bubble">
              {msg.parts.map((part, i) => (
                <div key={i}>{part.text}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatHistory;
