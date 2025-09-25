import { Checkbox, Dropdown } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';

import { S_Button, S_Checkbox, S_Input } from '@/ui';

import { FloppyDiskIcon } from '../icons';
import { VisibilityIcon } from './icons';
import { useTableContext } from './table-context';
import styles from './table.module.css';
import { useTableConfig } from './tableConfigContext';

export const TableVisibilityChangeMenu = ({ table_key }: any) => {
    const { columnVisibility, setColumnVisibility, columnsDatas } = useTableContext();
    const { saveConfigToApi, loadConfigFromApi } = useTableConfig();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [localVisibility, setLocalVisibility] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setLocalVisibility(columnVisibility);
    }, [columnVisibility]);

    const visibleColumns = useMemo(
        () =>
            columnsDatas.filter(
                (col) =>
                    typeof col.accessorKey === 'string' &&
                    col.accessorKey.trim() !== '' &&
                    col.accessorKey !== 'actions' &&
                    (col.header || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [columnsDatas, searchTerm]
    );

    const isAllChecked = visibleColumns.length > 0 && visibleColumns.every((col) => localVisibility[col.accessorKey]);
    const hasAnyVisibleSelected = visibleColumns.some((col) => localVisibility[col.accessorKey]);

    const buildDiff = (tableKey: string, current: Record<string, boolean>, original: Record<string, boolean>) => {
        const diff: Record<string, any> = {};
        console.log(current, original, 'current', 'original');
        for (const [key, vis] of Object.entries(current)) {
            if (original[key] !== vis) {
                diff[`tables.${tableKey}.columns.${key}.visible`] = vis;
            }
        }

        console.log(diff, 'diff');
        return diff;
    };

    const handleSave = async () => {
        const changes = Object.entries(localVisibility).filter(([key, vis]) => columnVisibility[key] !== vis);
        if (!changes.length) return;

        const updated = { ...columnVisibility };
        changes.forEach(([key, vis]) => {
            updated[key] = vis;
        });
        setColumnVisibility(updated);

        const fullPayload: Record<string, any> = {};
        for (const [key, vis] of Object.entries(updated)) {
            fullPayload[`tables.${table_key}.columns.${key}.visible`] = vis;
        }

        await saveConfigToApi(fullPayload);
        await loadConfigFromApi();
    };

    const toggleAll = () => {
        const target = !isAllChecked;
        const updated = { ...localVisibility };
        visibleColumns.forEach((col) => {
            updated[col.accessorKey] = target;
        });
        setLocalVisibility(updated);
    };

    return (
        <Dropdown
            trigger={['click']}
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
            dropdownRender={() => (
                <div className={styles.visibilityDropdown}>
                    <div className={styles.visibilityDropdownHeader}>
                        <S_Input
                            placeholder="Axtar"
                            value={searchTerm ?? ''}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="36"
                        />
                        <S_Button
                            color="primary"
                            variant="primary"
                            aria-label="Təsdiq et"
                            onClick={(e) => {
                                e.preventDefault();
                                flushSync(() => setDropdownOpen(false));
                                handleSave();
                            }}
                            disabled={!hasAnyVisibleSelected}
                        >
                            <FloppyDiskIcon color="var(--clr-content-brand-light)" />
                        </S_Button>
                    </div>
                    <ul className={styles.visibilityColumns}>
                        <li className={styles.visibilityDropdownItem} onClick={toggleAll}>
                            <S_Checkbox indeterminate={!isAllChecked} checked={hasAnyVisibleSelected} />
                            <span style={{ marginLeft: 8 }}>Hamısını göstər</span>
                        </li>
                        {visibleColumns.map((column) => (
                            <li
                                className={styles.visibilityDropdownItem}
                                key={column.accessorKey}
                                onClick={() =>
                                    setLocalVisibility((prev) => ({
                                        ...prev,
                                        [column.accessorKey]: !prev[column.accessorKey],
                                    }))
                                }
                            >
                                <S_Checkbox checked={localVisibility[column.accessorKey]} />
                                <span style={{ marginLeft: 8 }}>{column.header}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        >
            <span>
                <S_Button variant="primary" color="secondary">
                    <VisibilityIcon width={14} height={14} color="hsl(var(--clr-primary-900))" />
                </S_Button>
            </span>
        </Dropdown>
    );
};
