import { useEffect, useState } from 'react';

import { MRT_RowData } from 'material-react-table';

import { S_Button } from '@/ui';
import Modal from '@/ui/dialog';

import { PresetSize } from '.';
import ConfigPanel from '../config';
import FilterPanel from '../filter/FilterPanel';
import { FilterConfig } from '../filter/types';
import { generateFiltersFromColumns } from '../filter/utils/generateColumns';
import { CustomMRTColumn, Table } from '../table';
import { TableProvider } from '../table/table-context';
import Table_Footer from '../table/table-footer';
import Table_Header from '../table/table-header';
import styles from './CatalogViewAllDialog.module.css';

function CatalogViewAllDialog<T extends Record<string, any> & MRT_RowData>({
    open,
    setOpen,
    items,
    getRowId,
    value,
    multiple,
    handleSelect,
    paperStyle,
    showMoreColumns,
    sizePreset,
    totalItemCount,
    onRefetch,
    onClickNew,
    isLoading = false,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    items: T[];
    getRowId: (item: T) => string;
    value: T | T[] | null;
    multiple: boolean;
    handleSelect: (sel: T | T[] | null) => void;
    paperStyle?: React.CSSProperties;
    showMoreColumns?: CustomMRTColumn<T>[];
    sizePreset: PresetSize;
    totalItemCount: number;
    onRefetch?: () => void;
    onClickNew?: () => void;
    isLoading?: boolean;
}) {
    const [selectedItems, setSelectedItems] = useState<T[]>(value as T[]);

    const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
    const [isConfigCollapsed, setIsConfigCollapsed] = useState(true);

    const handleToggleFilterPanel = () => {
        if (isFilterCollapsed) {
            setIsFilterCollapsed(false);
            setIsConfigCollapsed(true);
        } else {
            setIsFilterCollapsed(true);
        }
    };

    const handleToggleConfigPanel = () => {
        if (isConfigCollapsed) {
            setIsConfigCollapsed(false);
            setIsFilterCollapsed(true);
        } else {
            setIsConfigCollapsed(true);
        }
    };

    useEffect(() => {
        setSelectedItems(value as T[]);
    }, [value]);

    const [filters, setFilters] = useState<FilterConfig[]>([]);

    useEffect(() => {
        const generatedFilters = generateFiltersFromColumns(
            showMoreColumns?.map((col) => ({
                accessorKey: col.accessorKey,
                header: col.header,
                filterVariant: col.filterVariant,
            })) ?? []
        );
        setFilters(generatedFilters);
    }, []);

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            size="xl"
            footer={
                <>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <S_Button
                            variant="outlined"
                            onClick={() => {
                                setSelectedItems(value as T[]);
                                setOpen(false);
                            }}
                        >
                            Ləğv et
                        </S_Button>
                        <S_Button
                            onClick={() => {
                                handleSelect(multiple ? selectedItems : (selectedItems[0] ?? null));
                                setOpen(false);
                            }}
                            variant="primary"
                        >
                            Təsdiqlə
                        </S_Button>
                    </div>
                </>
            }
        >
            <TableProvider tableKey="reports">
                <Table_Header
                    columns={showMoreColumns ?? []}
                    data={items}
                    title="Catalog"
                    onToggleFilter={handleToggleFilterPanel}
                    onToggleConfig={handleToggleConfigPanel}
                    onClickRightBtn={onClickNew}
                    tableVisibiltyColumn={false}
                    headerClassName={styles.modalHeader}
                    onRefresh={onRefetch}
                />

                <div className={styles.wrapper}>
                    <div
                        className={styles.tableArea}
                        style={{
                            marginRight: (isFilterCollapsed ? 0 : 280) + (isConfigCollapsed ? 0 : 280) + 'px',
                        }}
                    >
                        <Table<T>
                            tableKey="reports"
                            columns={
                                showMoreColumns?.map((col) => {
                                    return {
                                        ...col,
                                        accessorFn: (row) =>
                                            col.accessorKey ? row[col.accessorKey as keyof typeof row] : undefined,
                                    };
                                }) ?? []
                            }
                            data={items as any}
                            getRowId={(row) => {
                                return getRowId(row.original);
                            }}
                            enableCheckbox={true}
                            enableMultiSelect={multiple}
                            rowCheckboxSelectState={selectedItems.map((item) => getRowId(item))}
                            setRowCheckboxSelect={(value) => {
                                setSelectedItems(
                                    Object.keys(value).map((key) => items.find((item) => item.id === key) as T)
                                );
                            }}
                            enableRowNumbers={false}
                            isLoading={isLoading}
                        />

                        <div className={styles.modalFooter}>
                            <Table_Footer totalItems={totalItemCount} />
                        </div>
                    </div>

                    <div
                        className={[
                            styles.panel,
                            styles.filterPanel,
                            isFilterCollapsed ? styles.collapsed : styles.expanded,
                        ].join(' ')}
                    >
                        <FilterPanel
                            filters={filters}
                            onChange={() => {}}
                            isCollapsed={isFilterCollapsed}
                            onToggleCollapse={handleToggleFilterPanel}
                            table_key="reports"
                        />
                    </div>

                    <div
                        className={[
                            styles.panel,
                            styles.configPanel,
                            isConfigCollapsed ? styles.collapsed : styles.expanded,
                        ].join(' ')}
                    >
                        <ConfigPanel
                            isCollapsed={isConfigCollapsed}
                            onToggleCollapse={handleToggleConfigPanel}
                            modalTableData={[]}
                            table_key="reports"
                            modalTableColumns={[]}
                        />
                    </div>
                </div>
            </TableProvider>
        </Modal>
    );
}
export default CatalogViewAllDialog;
