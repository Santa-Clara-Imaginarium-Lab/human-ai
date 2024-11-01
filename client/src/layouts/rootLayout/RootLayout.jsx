import './rootLayout.css'
import { Link, Outlet } from "react-router-dom";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const queryClient = new QueryClient()

const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <QueryClientProvider client={queryClient}>    
        <div className = 'rootLayout'>
            <main>
                <Outlet />
            </main>
        </div>
        </QueryClientProvider>
        </ClerkProvider>
    )
}
export default RootLayout 

// This component serves as the foundation of the app, providing:

// Authentication context using Clerk.
// Data fetching capabilities using React Query.
// A placeholder (Outlet) where other pages or components can be rendered.
// It ensures that the app is properly set up for user authentication and efficient data management, making it easier to handle 
// routing and child components.