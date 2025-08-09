import React from 'react';

import { S_Button } from '@/ui';

import { FilterIcon } from '../icons';
import { useTableContext } from './table-context';
import styles from './table.module.css';

const ShowColumnFilters = () => {
    const { showColumnFilters, setShowColumnFilters } = useTableContext();

    if (!setShowColumnFilters) {
        throw new Error('ToggleColumnFiltersBtn: TableProviderin içərisində istifadə edin');
    }
    return (
        <S_Button
            variant={'outlined-20'}
            onClick={() => setShowColumnFilters((prev) => !prev)}
            className={` ${styles.filterBtn} ${showColumnFilters ? styles.active : ''}`}
        >
            <FilterIcon style={{ marginRight: 5 }} width={16} height={16} />
            {showColumnFilters ? 'Filtrləri Bağla' : 'Filtrləri Aç'}
        </S_Button>
    );
};

export default ShowColumnFilters;
