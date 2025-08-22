import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';

import S_Select_Simple from '@/ui/select/select-simple';

import { LeftIcon, RightIcon } from '../icons';
import { useTableContext } from '../table-context';
import { useTableConfig } from '../tableConfigContext';
import styles from './style.module.css';

interface TableFooterProps {
    totalItems?: number;
    isInfiniteScroll?: boolean;
    table_key?: string;
    onInfiniteChange?: (val: boolean) => void;
}

const Table_Footer: React.FC<TableFooterProps> = ({
    totalItems,
    isInfiniteScroll = false,
    table_key,
    onInfiniteChange,
}: any) => {
    const { filterDataState, onPaginationChange, setFilterDataState } = useTableContext();
    const { config } = useTableConfig();
    const defaultTake = config.tables?.[table_key]?.row?.paginationTakeCount ?? filterDataState.take;

    const [pageSize, setPageSize] = useState<number>(defaultTake);
    const hasUserChanged = useRef(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const selectRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        if (isInfiniteScroll) {
            setPageSize(-1);
        } else if (pageSize === -1) {
            setPageSize(defaultTake);
        }
    }, [isInfiniteScroll, defaultTake]);

    const currentPage = filterDataState.skip ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    const start = totalItems === 0 ? 0 : currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, totalItems);

    useEffect(() => {
        if (!table_key) return;

        const filterDataParam = searchParams.get('filterData');
        let parsed: any;

        try {
            parsed = filterDataParam ? JSON.parse(filterDataParam) : {};
        } catch {
            parsed = {};
        }

        const currentUrlTake = parsed?.take;
        const defaultTakeFromConfig = config.tables?.[table_key]?.row?.paginationTakeCount;

        if (defaultTakeFromConfig && currentUrlTake !== defaultTakeFromConfig) {
            const updated = {
                ...parsed,
                take: defaultTakeFromConfig,
                skip: 0,
            };

            const stringified = JSON.stringify(updated);
            const base = window.location.origin + window.location.pathname + window.location.hash.split('?')[0];
            window.location.replace(`${base}?filterData=${stringified}`);
        }
    }, [config.tables?.[table_key]?.row?.paginationTakeCount, table_key]);

    const handlePageSizeChange = (val: number) => {
        hasUserChanged.current = true;
        setPageSize(val);
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
                <div style={{ width: '70px' }}>
                    <S_Select_Simple
                        value={[pageSize === -1 ? 'infinite' : pageSize.toString()]}
                        items={[
                            { label: '10', value: '10' },
                            { label: '20', value: '20' },
                            { label: '50', value: '50' },
                            { label: '100', value: '100' },
                            { label: 'Auto', value: 'infinite' },
                        ]}
                        setSelectedItems={(items: any) => {
                            const val = items[0].value;
                            if (val === 'infinite') {
                                hasUserChanged.current = true;
                                setPageSize(-1);
                                onInfiniteChange?.(true);

                                setSearchParams({}, { replace: true });

                                setFilterDataState((prev: any) => ({
                                    ...prev,
                                    take: 20,
                                    skip: 0,
                                }));
                            } else {
                                const parsed = parseInt(val, 10);
                                onInfiniteChange?.(false);
                                handlePageSizeChange(parsed);
                            }
                        }}
                    />
                </div>
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
