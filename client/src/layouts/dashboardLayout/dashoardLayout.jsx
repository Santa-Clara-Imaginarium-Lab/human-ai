import './dashboardLayout.css'
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import ChatList from '../../components/chatList/ChatList';

const DashboardLayout = () => {
    const { userId, isLoaded } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && !userId) {
          navigate("/sign-in");
        }
      }, [isLoaded, userId, navigate]);
    
      if (!isLoaded) return "Loading...";

    return (
        <div className = 'dashboardLayout'>
                <div className='menu'><ChatList/></div>
                <div className='content'>
                    <Outlet />
                </div>
            </div>
    )
}
export default DashboardLayout


// This component sets up a layout for the dashboard that includes:

// User authentication handling: It checks if the user is logged in; if not, it redirects them to the sign-in page.
// Dashboard structure: It provides a menu section that displays the chat list and a content area where specific chat pages or other dashboard content will be shown.
// Outlet for nested routes: This allows dynamic rendering of child routes within the dashboard.
// This layout ensures that the dashboard is only accessible to authenticated users and organizes the page structure accordingly.