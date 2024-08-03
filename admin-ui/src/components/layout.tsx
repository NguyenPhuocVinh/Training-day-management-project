// Layout.tsx
import React, { PropsWithChildren } from 'react';
import { Header, Sidebar } from '@/components';

const Layout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <>
            <Header />
            <Sidebar />
            <main style={{ marginLeft: '250px', padding: '20px', marginTop: '60px' }}>
                {children}
            </main>
        </>
    );
};

export default Layout;
