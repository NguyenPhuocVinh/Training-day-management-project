import React from "react";
import Link from "next/link";
import { IoMdNotifications } from "react-icons/io";
import { FaSun, FaMoon, FaUserCircle } from "react-icons/fa";
import { useTheme } from "@/contexts/themeContext";
import { FaBarsStaggered } from "react-icons/fa6";
import styles from '@/styles/Header.module.css'; // Đảm bảo đường dẫn đúng

const Header: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className={`${styles.headerContainer} ${theme === 'dark' ? styles.dark : styles.light}`}>
            <div className={styles.leftSection}>
                <Link href="/" className={styles.logo}>ADMIN</Link>
                <FaBarsStaggered className={styles.menuIcon} />
            </div>
            <div className={styles.rightSection}>
                <button onClick={toggleTheme} aria-label="Toggle theme" className={styles.themeToggleButton}>
                    {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
                <IoMdNotifications className={styles.icon} />
                <FaUserCircle className={styles.icon} />
            </div>
        </header>
    );
};

export default Header;
