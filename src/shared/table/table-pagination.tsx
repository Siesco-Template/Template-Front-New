import { FC, useEffect } from 'react';

import S_Pagination from '@/ui/pagination';

import { useTableContext } from './table-context';

interface TablePaginationProps {
    totalCount?: number | undefined;
    currentPage?: number;
    setCurrentPage?: (page: number) => void;
    take?: number | undefined;
}

const TablePagination: FC<TablePaginationProps> = ({ totalCount }: any) => {
    const { filterDataState, onPaginationChange } = useTableContext();

    const handlePageChange = (page: number) => {
        const take = filterDataState.take;
        const newSkip = (page - 1) * take;
        onPaginationChange({ skip: newSkip });
    };

    return (
        <div>
            <S_Pagination
                totalCount={totalCount}
                take={filterDataState.take}
                currentPage={Math.floor(filterDataState.skip / filterDataState.take) + 1}
                setCurrentPage={handlePageChange}
            />
        </div>
    );
};

export default TablePagination;
