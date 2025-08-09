import { useEffect, useState } from 'react';

import { MRT_ColumnDef } from 'material-react-table';

import { useTableConfig } from '../table/tableConfigContext';

const specialKeys = ['mrt-row-select', 'mrt-row-numbers'];

export const useTableOrdering = (tableKey: string) => {
    const [tableOrdering, setTableOrdering] = useState<string[]>([]);
    const { config } = useTableConfig();

    const initializeOrdering = (columns: MRT_ColumnDef<any>[]): MRT_ColumnDef<any>[] => {
        const backendOrder = config.tables?.[tableKey]?.columnsOrder || {};
        const orderedKeys = Object.keys(backendOrder).sort((a, b) => backendOrder[a] - backendOrder[b]);

        const columnAccessorArray = columns.map((col) => col.accessorKey) as string[];
        const fullKeyList = [...specialKeys, ...columnAccessorArray];

        const orderedColumns = [
            ...orderedKeys.filter((key) => fullKeyList.includes(key)),
            ...fullKeyList.filter((key) => !orderedKeys.includes(key)),
        ];

        setTableOrdering(orderedColumns);

        const sortedColumns = orderedColumns
            .map((key) => {
                if (specialKeys.includes(key)) return null;
                return columns.find((col) => col.accessorKey === key)!;
            })
            .filter(Boolean) as MRT_ColumnDef<any>[];

        return sortedColumns;
    };

    return {
        tableOrdering,
        setTableOrdering,
        initializeOrdering,
    };
};
