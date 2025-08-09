import React from 'react';

import { SearchIcon } from '@/shared/icons';

import { S_Input } from '@/ui';

import styles from './style.module.css';

const SearchBar = ({ title }: any) => {
    return (
        <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <S_Input
                type="text"
                placeholder="Axtar"
                icon={<SearchIcon color="hsl(var(--clr-grey-25))" />}
                iconPosition="left"
                inputSize='default'
                className={styles.input}
            />
        </div>
    );
};

export default SearchBar;
