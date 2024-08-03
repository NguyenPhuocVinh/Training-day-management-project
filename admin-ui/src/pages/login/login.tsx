import React, { useState, FC } from 'react';
import { useAuth } from '@/contexts/authContext';
import { LoginRequest } from '@/types/login.request';
import { fetchApi } from '@/utils/fetch-api.util';
import { appConfig } from '@/configs/app.config';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import styles from '@/styles/Login.module.css';
import { Loading } from '@/components';
import Router from 'next/router';

const LoginForm: FC = () => {
    const [loginRequest, setLoginRequest] = useState<LoginRequest>({ email: '', password: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { login, isAuthenticated } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const loginResponse = await fetchApi({
                url: `${appConfig.apiBaseUrl}/admin/login`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: loginRequest,
            });

            if (loginResponse && loginResponse.accessToken && loginResponse.refreshToken) {
                login(loginResponse.accessToken, loginResponse.refreshToken);
            } else {
                setError('Invalid login response. Please try again.');
            }
        } catch (error: any) {
            setError('Login failed. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated) {
        Router.push('/dashboard');
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginRequest({ ...loginRequest, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className={styles.container}>
            {loading && <Loading />} {/* Hiển thị loading khi đang xử lý */}
            <form onSubmit={handleLogin} className={styles.form}>
                <div>
                    <label htmlFor="email" className={styles.label}>EMAIL</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={loginRequest.email}
                        onChange={handleInputChange}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.passwordContainer}>
                    <label htmlFor="password" className={styles.label}>PASSWORD</label>
                    <div className={styles.passwordInputContainer}>
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={loginRequest.password}
                            onChange={handleInputChange}
                            required
                            className={styles.input}
                        />
                        <button
                            type="button"
                            className={styles.passwordToggleButton}
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                    </div>
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
