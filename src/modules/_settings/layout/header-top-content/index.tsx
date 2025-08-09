import React from 'react';

import styles from './style.module.css';

const Header_top_content = ({ text, icon }: any) => {
    return (
        <>
            <section className={styles.header_top}>
                <div className={styles.icon}>{icon}</div>
                <div className={styles.text}>
                    <h1>{text} məlumatları</h1>
                    <p>{text} məlumatlarını daxil edin</p>
                </div>
            </section>
        </>
    );
};

export default Header_top_content;
