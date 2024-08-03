import React from 'react';
import styles from '@/styles/Loading.module.css';

const Loading: React.FC = () => {
    return (
        <div className={styles.overlay}>
            <div className={styles.spinner}></div>
        </div>
    );
};

export default Loading;