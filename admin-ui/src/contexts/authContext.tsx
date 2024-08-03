import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    const login = (accessToken: string, refreshToken: string) => {
        Cookies.set('accessToken', accessToken, { sameSite: 'strict', secure: true });
        Cookies.set('refreshToken', refreshToken, { sameSite: 'strict', secure: true });
        setIsAuthenticated(true);
        router.push('/dashboard');
    };

    const logout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        setIsAuthenticated(false);
        router.push('/login');
    };

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');
        if (accessToken && refreshToken) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            router.push('/login');
        }
    }, [router]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
