import styles from './style.module.css';

const CustomThemeCard = () => {
    return (
        <div className={styles.boxWrapper}>
            <div className={styles.sidebar}></div>
            <div className={styles.content}>
                <div className={styles.topBox}></div>
                <div className={styles.middleBox}></div>
                <div className={styles.lines}>
                    <div className={`${styles.line} ${styles.line1}`}></div>
                    <div className={`${styles.line} ${styles.line2}`}></div>
                    <div className={`${styles.line} ${styles.line3}`}></div>
                    <div className={`${styles.line} ${styles.line4}`}></div>
                </div>
            </div>
        </div>
    );
};

export default CustomThemeCard;
