import React, { JSX } from 'react';

import styles from './style.module.css';

type Props = {
    title: string;
    rightSide?: JSX.Element;
};

const PageHeader = ({ title, rightSide }: Props) => {
    return (
        <div className={styles.pageHeaderContainer}>
            <div className={styles.leftSide}>
                <h3>{title}</h3>
            </div>
            <div className={styles.rightSide}>{rightSide}</div>
        </div>
    );
};

export default PageHeader;
