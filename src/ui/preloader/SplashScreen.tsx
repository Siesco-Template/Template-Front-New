import React from 'react';

import styles from './style.module.css';

const SplashScreen: React.FC = () => {
    return (
        <div className={`${styles.wrapper} ${styles.fullscreen}`}>
            <div className={styles['dot-carousel']} />
        </div>
    );
};

export default SplashScreen;
