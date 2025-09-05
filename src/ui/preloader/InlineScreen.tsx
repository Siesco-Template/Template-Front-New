import React from 'react';

import styles from './style.module.css';

const LINE_COUNT = 8;

const InlineScreen: React.FC = () => {
    return (
        <div className={styles.InlineWrapper}>
            {Array.from({ length: LINE_COUNT }).map((_, i) => {
                const delay = Math.random() * 2; // 0 - 2s arası gecikmə
                const duration = 1 + Math.random() * 1.5; // 1 - 2.5s arası müddət

                return (
                    <div key={i} className={styles.lineWrapper}>
                        <div
                            className={styles.loadingBar}
                            style={{
                                animationDelay: `${delay}s`,
                                animationDuration: `${duration}s`,
                            }}
                        ></div>
                    </div>
                );
            })}
        </div>
    );
};

export default InlineScreen;
