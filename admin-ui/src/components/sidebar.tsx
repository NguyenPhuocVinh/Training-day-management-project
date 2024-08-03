// components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';
import styles from '@/styles/Sidebar.module.css';
import { RiMiniProgramFill } from "react-icons/ri";

const Sidebar: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    <li className={styles.li}>
                        <Link href="/" className={styles.link}>
                            <FaHome /> Trang chủ
                        </Link>
                    </li>
                    <li className={styles.li}>
                        <Link href="/profile" className={styles.link}>
                            <FaUser /> Hồ sơ
                        </Link>
                    </li>

                    <li className={styles.li}>
                        <Link href="/program" className={styles.link}>
                            <RiMiniProgramFill /> Chương trình
                        </Link>
                    </li>

                    <li className={styles.li}>
                        <Link href="/settings" className={styles.link}>
                            <FaCog /> Cài đặt
                        </Link>
                    </li>

                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
