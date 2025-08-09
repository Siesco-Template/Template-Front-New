import { Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { LeftIcon, RightIcon } from '../icons';
import { useTableContext } from '../table-context';
import { useTableConfig } from '../tableConfigContext';
import styles from './style.module.css';

interface TableFooterProps {
    totalItems: number;
    isInfiniteScroll?: boolean;
    table_key:string;
}

const Table_Footer: React.FC<TableFooterProps> = ({ totalItems, isInfiniteScroll = false, table_key }) => {
    const { filterDataState, onPaginationChange, setFilterDataState } = useTableContext();
    const { config } = useTableConfig();
    const defaultTake = config.tables?.[table_key]?.row?.paginationTakeCount ?? filterDataState.take;

    const [pageSize, setPageSize] = useState<number>(defaultTake);
    const hasUserChanged = useRef(false);

    useEffect(() => {
        setFilterDataState((prev: any) => ({
            ...prev,
            take: defaultTake,
            skip: prev.skip ?? 0,
        }));
    }, []); 

    
    useEffect(() => {
        if (!hasUserChanged.current) {
            setPageSize(defaultTake);
            setFilterDataState((prev: any) => ({
                ...prev,
                take: defaultTake,
            }));
        }
    }, [defaultTake, setFilterDataState]);

    // Cari səhifə indeksi
    const currentPage = filterDataState.skip ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Görünən start–end aralığı
    const start = totalItems === 0 ? 0 : currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, totalItems);

    // İstifadəçi pageSize-i dəyişəndə çağırılır
    const handlePageSizeChange = (val: number) => {
        hasUserChanged.current = true;
        setPageSize(val);
        // Context-də də yeniləyirik və birbaşa sorğuya göndəririk
        setFilterDataState((prev: any) => ({
            ...prev,
            take: val,
            skip: 0,
        }));
        onPaginationChange({ skip: 0, take: val });
    };

    const handlePrev = () => {
        const prev = Math.max(currentPage - 1, 0);
        onPaginationChange({ skip: prev, take: pageSize });
    };

    const handleNext = () => {
        const next = Math.min(currentPage + 1, totalPages - 1);
        onPaginationChange({ skip: next, take: pageSize });
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        const left = Math.max(2, currentPage + 1 - 2);
        const right = Math.min(totalPages - 1, currentPage + 1 + 2);
        pages.push(1);
        if (left > 2) pages.push('...');
        for (let p = left; p <= right; p++) pages.push(p);
        if (right < totalPages - 1) pages.push('...');
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className={styles.paginationWrapper}>
            <div className={styles.leftSide}>
                <span className={styles.label}>Səhifədə göstər:</span>
                <Select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    options={[10, 20, 50, 100].map((val) => ({
                        label: String(val),
                        value: val,
                    }))}
                    className={styles.select}
                    popupMatchSelectWidth={false}
                />
            </div>

            {!isInfiniteScroll && totalPages > 1 && (
                <div className={styles.centerSide}>
                    <button onClick={handlePrev} className={styles.iconBtn} disabled={currentPage === 0}>
                        <LeftIcon width={16} height={16} color="#5E6C79" />
                    </button>

                    {getPageNumbers().map((page, idx) =>
                        typeof page === 'number' ? (
                            <button
                                key={page}
                                className={[
                                    styles.pageNumberBtn,
                                    page - 1 === currentPage ? styles.activePage : '',
                                ].join(' ')}
                                onClick={() => onPaginationChange({ skip: page - 1, take: pageSize })}
                            >
                                {page}
                            </button>
                        ) : (
                            <span key={`dots-${idx}`} className={styles.ellipsis}>
                                …
                            </span>
                        )
                    )}

                    <button onClick={handleNext} className={styles.iconBtn} disabled={currentPage >= totalPages - 1}>
                        <RightIcon width={16} height={16} color="#5E6C79" />
                    </button>
                </div>
            )}

            {!isInfiniteScroll && (
                <div className={styles.rightSide}>
                    <span className={styles.range}>
                        {start}–{end} / {totalItems}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Table_Footer;
