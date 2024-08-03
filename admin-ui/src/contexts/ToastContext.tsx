// contexts/ToastContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Toast } from '@/components';

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface ToastContextProps {
    addToast: (title: string, message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Array<{ id: number; title: string; message: string; type: ToastType; duration: number }>>([]);
    const [nextId, setNextId] = useState(0);

    const addToast = (title: string, message: string, type: ToastType, duration = 5000) => {
        setToasts(prev => [...prev, { id: nextId, title, message, type, duration }]);
        setNextId(prev => prev + 1);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div id="toast-container">
                {toasts.map(({ id, title, message, type, duration }) => (
                    <Toast
                        key={id}
                        title={title}
                        message={message}
                        type={type}
                        duration={duration}
                        onClose={() => removeToast(id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
