// pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/authContext';
import { ThemeProvider } from '@/contexts/themeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { Layout } from '@/components';
import { useRouter } from 'next/router';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { pathname } = useRouter();
  const isLoginPage = pathname === '/login';

  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          {isLoginPage ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default MyApp;
