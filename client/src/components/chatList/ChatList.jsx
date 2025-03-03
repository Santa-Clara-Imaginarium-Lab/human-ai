import { useQuery } from '@tanstack/react-query'
import './chatList.css'
import {useNavigate, Link} from 'react-router-dom'
import { useUser } from '../../context/UserContext'

const ChatList = () => {

    const navigate = useNavigate();
    const { userId } = useUser();

    const { isPending, error, data } = useQuery({
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

      const handleExit = () => {
        navigate('/game'); 
      };

    return (
        <div className='chatList'>
          <hr/>
          <Link onClick={handleExit}>Exit</Link>
            <Link to="/dashboard">New Chat</Link>
            <hr/>
            <span className='title'>RECENT CHATS</span>
            <div className='list'>
            {isPending
          ? "Loading..."
          : error
          ? "Error loading chats"
          : data && data.length > 0
          ? data.map((chat) => (
              <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                {chat.title}
              </Link>
            ))
          : ""}
            </div>
            <hr />
        </div>
    )
}

export default ChatList