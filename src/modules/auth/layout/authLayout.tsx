import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

import { useAuthStore } from '@/store/authStore';

import { APP_URLS } from '@/services/config/url.config';

import largeLogo from '../shared/images/ar-logo.png';
import chart from '../shared/images/charts.png';
import mainLogo from '../shared/images/logo.svg?url';
import authLayoutImg from '../shared/images/right.png';
import './layout.css';
import styles from './layout.module.css';

const AuthLayout = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useAuthStore();
    const location = useLocation();
    const nav = useNavigate();

    useEffect(() => {
        if (user && location.pathname != '/change_password') {
            nav(APP_URLS.root());
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) return null;

    const logoSrc = mainLogo as string;

    return (
        <main className={styles.authContainer}>
            <section className={styles.leftSection}>
                <div className={styles.logoWrapper}>
                    {/* <Link to={APP_URLS.root()}>
                        <img src={logoSrc} alt="Site Logo" />
                    </Link> */}
                    <h2>Template</h2>
                </div>
                <div className={styles.outletWrapper}>
                    <Outlet />
                </div>
            </section>
            <div
                className={styles.rightSection}
                style={{
                    backgroundImage: `linear-gradient(0deg, rgba(1, 14, 106, 0.21), rgba(1, 14, 106, 0.21)), url(${authLayoutImg})`,
                }}
            ></div>
        </main>
    );
};

export default AuthLayout;
