import './dashboardPage.css';
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../context/UserContext";

const DashboardPage = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { userId } = useUser();
    
    const mutation = useMutation({
        mutationFn: (text) => {
            if (!userId) {
                throw new Error('No userId found');
            }
            
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
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
            navigate(`/dashboard/chats/${id}`);
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