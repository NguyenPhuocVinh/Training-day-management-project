export interface IToastProps {
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    duration?: number;
    onClose: () => void;
}