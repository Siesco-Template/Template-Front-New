import { Dropdown, MenuProps } from 'antd';
import { useEffect, useState } from 'react';

import { MRT_ColumnDef } from 'material-react-table';

import { useTableConfig } from './tableConfigContext';

export const useTableVisibility = (tableKey: string) => {
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
    const [columnsDatas, setColumnsDatas] = useState<{ accessorKey: string; header: string }[]>([]);
    const { config } = useTableConfig();

    const configReady = !!config?.tables?.[tableKey];

    const initializeVisibility = (columns: MRT_ColumnDef<any>[]) => {
        const columnsData = columns.map((column) => ({
            accessorKey: column.accessorKey!,
            header: column.header,
        }));

        setColumnsDatas(columnsData);

        if (!configReady) return;

        const result = Object.fromEntries(
            columnsData.map((column) => {
                const isVisible = config?.tables?.[tableKey]?.columns?.[column.accessorKey]?.visible;
                return [column.accessorKey, isVisible !== false]; 
            })
        );

        setColumnVisibility(result);
    };

    useEffect(() => {
        // Config yükləndikdən sonra əgər columns artıq müəyyən olunubsa, visibility-i yenilə
        if (columnsDatas.length > 0 && configReady) {
            const result = Object.fromEntries(
                columnsDatas.map((column) => {
                    const isVisible = config?.tables?.[tableKey]?.columns?.[column.accessorKey]?.visible;
                    return [column.accessorKey, isVisible !== false];
                })
            );
            setColumnVisibility(result);
        }
    }, [configReady]); // yalnız config hazır olduqda yenidən tətiklənəcək

    return {
        columnVisibility,
        columnsDatas,
        setColumnVisibility,
        initializeVisibility,
    };
};
