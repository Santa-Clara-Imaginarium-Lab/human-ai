import './dashboardPage.css';
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DashboardPage = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const mutation = useMutation({
        mutationFn: (text) => {
            const playerId = localStorage.getItem('playerId');
            console.log("Sending playerId:", playerId);
            
            if (!playerId) {
                throw new Error('PlayerId not found in localStorage');
            }
            
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    text,
                    playerId
                }),
            }).then((res) => res.json());
        },
        onSuccess: (id) => {
            queryClient.invalidateQueries({ queryKey: ["userChats"] });
            navigate(`/dashboard/chats/${id}`);
        },
        onError: (error) => {
            console.error("Mutation error:", error);
            // Handle error appropriately
        }
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if(!text) return;
        mutation.mutate(text);
    };

    return (
        <div className = 'dashboardPage'>
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