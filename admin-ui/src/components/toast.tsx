import { IToastProps } from '@/types/toast.type';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import styles from '@/styles/Toast.module.css';

const icons = {
    success: <FaCheckCircle />,
    info: <FaInfoCircle />,
    warning: <FaExclamationCircle />,
    error: <FaExclamationCircle />
};

const Toast: React.FC<IToastProps> = ({ title, message, type, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={styles['toast-container']}>
            {isVisible && (
                <div className={`${styles.toast} ${styles[`toast--${type}`]}`} role="alert">
                    <div className={styles.toast__icon}>
                        {icons[type]}
                    </div>
                    <div className={styles.toast__body}>
                        <h3 className={styles.toast__title}>{title}</h3>
                        <p className={styles.toast__msg}>{message}</p>
                    </div>
                    <div className={styles.toast__close} onClick={onClose}>
                        <FaTimes />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Toast;
