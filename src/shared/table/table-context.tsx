import {
    type Dispatch,
    FC,
    type PropsWithChildren,
    type SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router';

import { MRT_ColumnDef } from 'material-react-table';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { CurrentFilters, FILTER_QUERY_URL, changeFilterDataForTable, getFilterDataOnUrl } from './table-helpers';
import { useTableOrdering } from './table-ordering';
import { useTableVisibility } from './table-visibility';
import { useDebounce } from './useDebounce';

export type ColumnSizingType = Record<string, number | undefined>;
type TableContextState = {
    onColumnFiltersChange: (filtering: any) => void;
    onSortChange: (filtering: any) => void;
    onPaginationChange: ({ skip, take }: TablePagination) => void;
    filterDataState: ReturnType<typeof changeFilterDataForTable>;
    columnSizing: ColumnSizingType;
    setColumnSizing: Dispatch<SetStateAction<ColumnSizingType>>;
    // getColumnSizingOnLocal: () => ColumnSizingType | undefined;
    initializeOrdering: (columns: MRT_ColumnDef<any>[]) => MRT_ColumnDef<any>[];
    setTableOrdering: Dispatch<SetStateAction<string[]>>;
    tableOrdering: string[];
    showColumnFilters: boolean;
    setShowColumnFilters: Dispatch<SetStateAction<boolean>>;
    columnVisibility: Record<string, boolean>;
    setColumnVisibility: Dispatch<SetStateAction<Record<string, boolean>>>;
    initializeVisibility: (columns: MRT_ColumnDef<any>[]) => void;
    columnsDatas: {
        accessorKey: string;
        header: string;
    }[];
    selectedColumnKey: string | null;
    setSelectedColumnKey: any;
    setFilterDataState: any;
};

type TablePagination = {
    skip?: number;
    take?: number;
};

export const TableContext = createContext<TableContextState | null>(null);

export const useTableContext = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('contextin icinde istifade etmirsen');
    }

    return context;
};
interface TableProviderProps {
    children: React.ReactNode;
    tableKey: string;
}
export const TableProvider: FC<TableProviderProps> = ({ tableKey, children }) => {
    const navigate = useNavigate();
    const [columnSizing, setColumnSizing] = useState({});
    const [selectedColumnKey, setSelectedColumnKey] = useState<string | null>(null);

    const [showColumnFilters, setShowColumnFilters] = useState(false);
    const { initializeOrdering, setTableOrdering, tableOrdering } = useTableOrdering(tableKey);
    const { columnVisibility, columnsDatas, setColumnVisibility, initializeVisibility } = useTableVisibility(tableKey);

    const onColumnFiltersChange = (filtering: any) => {
        const current = getFilterDataOnUrl();
        let newFilter;

        if (typeof filtering === 'function') {
            newFilter = filtering(current?.filter);
        } else {
            newFilter = filtering;
        }

        const newData = {
            ...current,
            filter: newFilter,
            skip: 0,
        };

        setFilterDataOnUrl(newData);
        setFilterDataState(changeFilterDataForTable(newData)); // <-- Əsas hissə
    };

    const onSortChange = (filtering: any) => {
        if (typeof filtering === 'function') {
            const getFilters = getFilterDataOnUrl();
            const sort = filtering(getFilters?.sort);
            setFilterDataOnUrl({ filter: getFilters.filter, skip: 0, take: getFilters?.take, sort });
        } else {
            const getFilters = getFilterDataOnUrl();
            setFilterDataOnUrl({ filter: getFilters.filter, skip: 0, take: getFilters.take, sort: filtering });
        }
    };
    const setFilterDataOnUrl = (filterData: CurrentFilters) => {
        navigate(
            `?${FILTER_QUERY_URL}=${JSON.stringify({
                filter: filterData.filter,
                skip: filterData.skip,
                take: filterData.take,
                sort: filterData.sort,
            })}`
        );
    };

    const [filterDataState, setFilterDataState] = useState(() => changeFilterDataForTable(getFilterDataOnUrl()));

    const location = useLocation();

    useEffect(() => {
        const updated = getFilterDataOnUrl();
        setFilterDataState(changeFilterDataForTable(updated));
    }, [location.search]);

    // const onPaginationChange = ({ skip, take }: TablePagination) => {
    //     const getFilters = getFilterDataOnUrl();

    //     const newSkip = typeof skip === 'number' ? skip : (getFilters.skip ?? 0);
    //     const newTake = typeof take === 'number' ? take : (getFilters.take ?? 10);

    //     setFilterDataOnUrl({ ...getFilters, skip: newSkip, take: newTake });
    // };

    const onPaginationChange = ({ skip, take }: TablePagination) => {
        const getFilters = getFilterDataOnUrl();

        const newSkip = typeof skip === 'number' ? skip : (getFilters.skip ?? 0);
        const newTake = typeof take === 'number' ? take : (getFilters.take ?? 20);

        const updated = {
            ...getFilters,
            skip: newSkip,
            take: newTake,
        };

        setFilterDataOnUrl(updated);
        setFilterDataState(changeFilterDataForTable(updated));
    };

    return (
        <TableContext.Provider
            value={{
                onSortChange,
                onPaginationChange,
                onColumnFiltersChange,
                filterDataState,
                columnSizing,
                setColumnSizing,
                initializeOrdering,
                setTableOrdering,
                tableOrdering,
                showColumnFilters,
                setFilterDataState,
                setShowColumnFilters,
                columnVisibility,
                setColumnVisibility,
                initializeVisibility,
                columnsDatas,
                selectedColumnKey,
                setSelectedColumnKey,
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
        </TableContext.Provider>
    );
};
