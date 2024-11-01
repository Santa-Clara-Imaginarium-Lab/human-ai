import { useQuery } from '@tanstack/react-query'
import './chatList.css'
import {useNavigate, Link} from 'react-router-dom'

const ChatList = () => {

    const navigate = useNavigate();

    const { isPending, error, data } = useQuery({
        queryKey: ["userChats"],
        queryFn: () =>
          fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
            credentials: "include",
          }).then((res) => res.json()),
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
          ? "Something went wrong!"
          : data?.map((chat) => (
              <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                {chat.title}
              </Link>
            ))}
            </div>
            <hr />
        </div>
    )
}

export default ChatList