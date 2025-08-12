import { useEffect, useState } from 'react';

import { MRT_ColumnDef, MRT_RowData, MRT_RowSelectionState } from 'material-react-table';

import { S_Button } from '@/ui';

import { PresetSize } from '.';
import ConfigPanel from '../config';
import { FilterConfig } from '../filter';
import FilterPanel from '../filter/FilterPanel';
import { generateFiltersFromColumns } from '../filter/config/generateColumns';
import { CustomMRTColumn, Table } from '../table';
import { TableProvider } from '../table/table-context';
import Table_Footer from '../table/table-footer';
import Table_Header from '../table/table-header';
import { TableConfigProvider } from '../table/tableConfigContext';
import styles from './CatalogViewAllDialog.module.css';
import { Dialog, DialogClose, DialogContent, DialogFooter } from './shared/dialog/dialog';
import { PanelDialog, PanelDialogContent, PanelDialogFooter } from './shared/dialog/panel-dialog';

function CatalogViewAllDialog<T extends Record<string, any> & MRT_RowData>({
    open,
    setOpen,
    items,
    getLabel,
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
    getLabel: (item: T) => string;
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

    if (['md-lg', 'lg', 'xl'].includes(sizePreset)) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent style={paperStyle}>
                    {/* Body */}
                    <TableProvider tableKey="customer_table">
                        <TableConfigProvider>
                            <div style={{ paddingRight: '44px' }}>
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
                            </div>

                            <div className={styles.wrapper}>
                                <div
                                    className={styles.tableArea}
                                    style={{
                                        marginRight:
                                            (isFilterCollapsed ? 0 : 280) + (isConfigCollapsed ? 0 : 280) + 'px',
                                    }}
                                >
                                    <Table<T>
                                        tableKey="customer_table" // TODO: make it unique and dynamic
                                        columns={
                                            showMoreColumns?.map((col) => {
                                                return {
                                                    ...col,
                                                    accessorFn: (row) =>
                                                        col.accessorKey
                                                            ? row[col.accessorKey as keyof typeof row]
                                                            : undefined,
                                                };
                                            }) ?? []
                                        }
                                        data={items as any}
                                        getRowId={(row) => {
                                            return getRowId(row.original);
                                        }}
                                        enableCheckbox={true}
                                        enableMultiSelect={true}
                                        // rowCheckboxSelectState={selectedItems.reduce((acc, val) => {
                                        //     acc[getRowId(val)] = true;
                                        //     return acc;
                                        // }, {} as MRT_RowSelectionState)}
                                        rowCheckboxSelectState={selectedItems.map((item) => getRowId(item))}
                                        setRowCheckboxSelect={(value) => {
                                            console.log(value);
                                            if (Object.keys(value).length > 2) {
                                                setSelectedItems([]);
                                                return;
                                            }
                                            const selectedId = Object.keys(value).at(-1);
                                            const newItems = items.filter((item) => item.id === selectedId);
                                            setSelectedItems(newItems);
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
                                        storageKey="customer_table"
                                        onChange={() => {}}
                                        isCollapsed={isFilterCollapsed}
                                        onToggleCollapse={handleToggleFilterPanel}
                                        table_key="customer_table"
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
                                        table_key="customer_table"
                                        modalTableColumns={[]}
                                    />
                                </div>
                            </div>
                        </TableConfigProvider>
                    </TableProvider>

                    {/* Footer */}
                    <DialogFooter>
                        {/* Cancel */}
                        <DialogClose asChild>
                            <S_Button
                                variant="outlined-10"
                                onClick={() => {
                                    setSelectedItems(value as T[]);
                                    setOpen(false);
                                }}
                            >
                                Cancel
                            </S_Button>
                        </DialogClose>

                        <S_Button
                            onClick={() => {
                                handleSelect(multiple ? selectedItems : (selectedItems[0] ?? null));
                                setOpen(false);
                            }}
                            variant="main-10"
                        >
                            Done
                        </S_Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <PanelDialog open={open} onOpenChange={setOpen}>
            <PanelDialogContent style={paperStyle}>
                {/* Body */}
                <TableProvider tableKey="customer_table">
                    <TableConfigProvider>
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
                                    tableKey="customer_table" // TODO: make it unique and dynamic
                                    columns={
                                        showMoreColumns?.map((col) => {
                                            return {
                                                ...col,
                                                accessorFn: (row) =>
                                                    col.accessorKey
                                                        ? row[col.accessorKey as keyof typeof row]
                                                        : undefined,
                                            };
                                        }) ?? []
                                    }
                                    data={items as any}
                                    getRowId={(row) => {
                                        return getRowId(row.original);
                                    }}
                                    enableCheckbox={true}
                                    enableMultiSelect={multiple}
                                    // rowCheckboxSelectState={selectedItems.reduce((acc, val) => {
                                    //     acc[getRowId(val)] = true;
                                    //     return acc;
                                    // }, {} as MRT_RowSelectionState)}
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
                                    storageKey="customer_table"
                                    onChange={() => {}}
                                    isCollapsed={isFilterCollapsed}
                                    onToggleCollapse={handleToggleFilterPanel}
                                    table_key="customer_table"
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
                                    table_key="customer_table"
                                    modalTableColumns={[]}
                                />
                            </div>
                        </div>
                    </TableConfigProvider>
                </TableProvider>
                {/* Footer */}
                <PanelDialogFooter>
                    <S_Button
                        variant="outlined-10"
                        onClick={() => {
                            setSelectedItems(value as T[]);
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </S_Button>

                    <S_Button
                        onClick={() => {
                            handleSelect(multiple ? selectedItems : (selectedItems[0] ?? null));
                            setOpen(false);
                        }}
                        variant="main-10"
                    >
                        Done
                    </S_Button>
                </PanelDialogFooter>
            </PanelDialogContent>
        </PanelDialog>
    );
}

export default CatalogViewAllDialog;
