'use client';

import { FC } from 'react';

import { Pagination, PaginationRootProps } from '@ark-ui/react';

import { useWidthViewport } from '@/shared/hooks';
import { DirectionLeft01, DirectionRight01 } from '@/shared/icons';
import { cls } from '@/shared/utils';

import styles from './pagination.module.css';

interface I_PaginationProps extends Omit<PaginationRootProps, 'count' | 'pageSize' | 'page' | 'onPageChange'> {
    take: number | undefined;
    totalCount: number | undefined;
    setCurrentPage: (page: number) => void;
    currentPage: number;
    showPageNumbers?: boolean;
    noPadding?: boolean;
}

const S_Pagination: FC<I_PaginationProps> = ({
    totalCount,
    take = 25,
    currentPage,
    setCurrentPage,
    showPageNumbers = true,
    noPadding = false,
    ...props
}) => {
    const width = useWidthViewport();
    const siblingCount = (() => (width > 660 ? 2 : width > 480 ? 1 : 0))();
    return (
        <div className={styles.paginationWrapper}>
            <Pagination.Root
                count={totalCount || take}
                pageSize={take}
                siblingCount={siblingCount}
                page={currentPage}
                className={cls(styles.pagination, noPadding ? styles.noPadding : '')}
                onPageChange={(details) => setCurrentPage(details.page)}
                {...props}
            >
                <Pagination.PrevTrigger className={styles.paginationPrevTrigger}>
                    <DirectionLeft01 />
                </Pagination.PrevTrigger>
                {showPageNumbers ? (
                    <Pagination.Context>
                        {(pagination) =>
                            pagination.pages.map((page, index) =>
                                page.type === 'page' ? (
                                    <Pagination.Item key={index} {...page}>
                                        {page.value}
                                    </Pagination.Item>
                                ) : (
                                    <Pagination.Ellipsis key={index} index={index}>
                                        &#8230;
                                    </Pagination.Ellipsis>
                                )
                            )
                        }
                    </Pagination.Context>
                ) : null}
                <Pagination.NextTrigger className={styles.paginationNextTrigger}>
                    <DirectionRight01 />
                </Pagination.NextTrigger>
            </Pagination.Root>
        </div>
    );
};
export default S_Pagination;
