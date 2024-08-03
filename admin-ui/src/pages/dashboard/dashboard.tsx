import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/router';

const Dashboard: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    return (
        <div>
            <h1>ádasa   </h1>
        </div>
    );
};

export default Dashboard;
