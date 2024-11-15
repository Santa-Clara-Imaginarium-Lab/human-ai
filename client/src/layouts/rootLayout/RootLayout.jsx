import './rootLayout.css'
import { Outlet } from "react-router-dom";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient()

const RootLayout = () => {
    return (
        <QueryClientProvider client={queryClient}>    
        <div className = 'rootLayout'>
            <main>
                <Outlet />
            </main>
        </div>
        </QueryClientProvider>
    )
}
export default RootLayout 

// This component serves as the foundation of the app, providing:

// Authentication context using Clerk.
// Data fetching capabilities using React Query.
// A placeholder (Outlet) where other pages or components can be rendered.
// It ensures that the app is properly set up for user authentication and efficient data management, making it easier to handle 
// routing and child components.