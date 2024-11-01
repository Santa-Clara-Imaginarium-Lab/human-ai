import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [playerId, setPlayerId] = useState(() => {
        // Initialize from localStorage if available
        return localStorage.getItem('playerId') || null;
    });

    // Update localStorage whenever playerId changes
    useEffect(() => {
        if (playerId) {
            localStorage.setItem('playerId', playerId);
        } else {
            localStorage.removeItem('playerId');
        }
    }, [playerId]);

    const login = (id) => {
        setPlayerId(id);
    };

    const logout = () => {
        setPlayerId(null);
    };

    return (
        <UserContext.Provider value={{ playerId, login, logout }}>
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
