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
    fetch('${import.meta.env.VITE_API_URL}/api/chathistory')
      .then(res => res.json())
      .then(data => {
        const uniqueUsers = [...new Set(data.map(chat => chat.userId))];
        setUsers(uniqueUsers);
      });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetch(`${import.meta.env.VITE_API_URL}/api/chats?userId=${selectedUser}`)
        .then(res => res.json())
        .then(data => setMessages(data[0]?.history || []));
    }
  }, [selectedUser]);

  const filteredUsers = users.filter(user =>
    user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleDownloadCSV() {
    if (!messages.length) return;
  
    const rows = messages.flatMap(msg =>
      msg.parts.map(part => ({
        role: msg.role,
        text: part.text,
        timestamp: part.messageTimestamp || '',
      }))
    );
  
    const csvContent = [
      ['Timestamp', 'Role', 'Message'],
      ...rows.map(row => [
        `"${row.timestamp}"`,
        row.role,
        `"${row.text.replace(/"/g, '""')}"`,
      ]),
    ]
      .map(e => e.join(','))
      .join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${selectedUser}_chat.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }  

  async function handleDownloadAllChats() {
    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/chats');
      const allChats = await res.json();
  
      const rows = allChats.flatMap(chat =>
        chat.history.flatMap(entry =>
          entry.parts.map(part => ({
            userId: chat.userId,
            role: entry.role,
            text: part.text,
            timestamp: part.messageTimestamp || '',
          }))
        )
      );
  
      const csvAllContent = [
        ['userId', 'timestamp', 'role', 'message'],
        ...rows.map(row => [
          row.userId,
          `"${row.timestamp}"`,
          row.role,
          `"${row.text.replace(/"/g, '""')}"`
        ]),
      ]
        .map(e => e.join(','))
        .join('\n');
  
      const blob = new Blob([csvAllContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `all_chats.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download all chats:', error);
    }
  }
  

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
        <div className="button-row">
          <button className="dwnd-button" onClick={handleDownloadCSV}>
            Download Selected Chat
          </button>
          <button className="dwnd-button" onClick={handleDownloadAllChats}>
            Download All Chats
          </button>
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
