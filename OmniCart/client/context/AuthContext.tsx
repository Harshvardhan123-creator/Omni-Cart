
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface User {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    // Add other user properties as needed
    addresses?: any[];
    paymentMethods?: any[];
    profilePicUrl?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                // Set stored user temporarily for fast render
                setUser(JSON.parse(storedUser));
                
                // Fetch fresh data behind the scenes
                try {
                    const freshProfile = await api.getProfile(storedToken);
                    setUser(freshProfile);
                    localStorage.setItem('user', JSON.stringify(freshProfile));
                } catch (err) {
                    console.error("Failed to fetch fresh profile:", err);
                    // Don't auto-logout here, let handleUnauthorized catch 401s
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    useEffect(() => {
        const handleUnauthorized = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
            window.location.href = '/'; // Redirect to home/login
        };

        window.addEventListener('unauthorized', handleUnauthorized);
        return () => window.removeEventListener('unauthorized', handleUnauthorized);
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        // Optional: window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
