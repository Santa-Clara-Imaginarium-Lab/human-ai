import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userId, setuserId] = useState(() => {
        // Initialize from sessionStorage if available
        return sessionStorage.getItem('userId') || null;
    });

    // Update sessionStorage whenever userId changes
    useEffect(() => {
        if (userId) {
            sessionStorage.setItem('userId', userId);
        } else {
            sessionStorage.removeItem('userId');
        }
    }, [userId]);

    const login = (id) => {
        setuserId(id);
    };

    const logout = () => {
        setuserId(null);
    };

    return (
        <UserContext.Provider value={{ userId, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook to use the user context
export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
