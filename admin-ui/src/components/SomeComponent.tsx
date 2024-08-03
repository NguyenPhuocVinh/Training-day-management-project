// components/SomeComponent.tsx
import React from 'react';
import { useToast } from '@/contexts/ToastContext';

const SomeComponent: React.FC = () => {
    const { addToast } = useToast();

    const handleClick = () => {
        addToast('Success!', 'Your operation was successful.', 'success');
    };

    return (
        <div>
            <button onClick={handleClick}>Show Success Toast</button>
        </div>
    );
};

export default SomeComponent;
