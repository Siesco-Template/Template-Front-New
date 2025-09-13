import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

import {
    MRT_ColumnDef,
    MRT_Row,
    MRT_RowData,
    MRT_RowSelectionState,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_AZ } from 'material-react-table/locales/az';

import { CircularProgress } from '@mui/material';

import { S_Checkbox, S_Input } from '@/ui';

import Catalog from '../catalog';
import DateIntervalFilter from '../filter/filters/DateIntervalFilter';
import NumberIntervalFilter from '../filter/filters/NumberIntervalFilter';
import { FilterKey } from '../filter/utils/filterTypeEnum';
import { ArrowDownIcon, MoreVerticalIcon } from '../icons';
import { toCssColor } from '../utils/color.utils';
import CustomColumnMenu from './customColumnMenu';
import { FilterIcon, FilterSolidIcon } from './icons';
import { useTableContext } from './table-context';
import TableTheme from './table-theme';
import './table.css';
import styles from './table.module.css';
import { useTableConfig } from './tableConfigContext';

export type CustomMRTColumn<T extends MRT_RowData> = MRT_ColumnDef<T> & {
    enableSummary?: boolean;
    placeholder?: string;
    filterVariant?: string;
    filterSelectOptions?: { label: string; value: any }[];
};

type TableProps<T extends Record<string, any>> = {
    state?: 'pending' | 'success' | 'error' | 'idle';
    columns: CustomMRTColumn<T>[];
    data: T[];
    showColumnFilters?: boolean;
    workWithLink?: boolean;
    isLoading?: boolean;
    enableCheckbox?: boolean;
    rowCheckboxSelectState?: string[];
    setRowCheckboxSelect?: Dispatch<SetStateAction<string[]>>;
    getRowId?: (originalRow: T, index?: number, parentRow?: MRT_Row<T>) => string;
    getRowProps?: (row: MRT_Row<T>) => React.HTMLAttributes<HTMLTableRowElement>;
    enableRowNumbers?: boolean;
    onRowDoubleClick?: (row: T) => void;
    enableMultiSelect?: boolean;
    enableColumnOrdering?: boolean;
    onColumnOrderChange?: (newOrder: string[]) => void;
    columnOrderState?: string[];
    enableColumnResizing?: boolean;
    onColumnSizingChange?: (columnSizing: Record<string, number>) => void;
    enableColumnActions?: boolean;
    tableKey: string;
    enableColumnActionsCustom?: boolean;
    enableColumnFilter?: boolean;
    highlightedRowIds?: string[];
    isConfigCollapsed?: boolean;
    onSelectedRowsChange?: (ids: string[], rows: T[]) => void;
    selectedRowIds?: string[];
    fetchh: any;
    totalFetched: any;
    isInfinite: any;
    totalDBRowCount: any;
};

const customLocalization = {
    ...MRT_Localization_AZ,
    noRecordsToDisplay: 'Məlumat tapılmadı',
    rowNumber: '№',
};

type RowSel = MRT_RowSelectionState;

const idsToRowSel = (ids: string[]): RowSel =>
    ids.reduce((acc, id) => {
        acc[id] = true;
        return acc;
    }, {} as RowSel);

const rowSelToIds = (sel: RowSel): string[] => Object.keys(sel).filter((k) => !!sel[k]);

function Table<T extends Record<string, any>>({
    state,
    columns,
    data,
    workWithLink = false,
    enableCheckbox,
    rowCheckboxSelectState = [],
    setRowCheckboxSelect,
    getRowId,
    getRowProps,
    isInfinite = false,
    columnOrderState,
    onRowDoubleClick,
    enableRowNumbers = true,
    enableMultiSelect = false,
    enableColumnOrdering = false,
    fetchh,
    enableColumnResizing = false,
    enableColumnActions = false,
    enableColumnActionsCustom = true,
    totalDBRowCount,
    totalFetched,
    isConfigCollapsed = false,
    enableColumnFilter = true,
    onColumnSizingChange,
    tableKey,
    onSelectedRowsChange,
    onColumnOrderChange,
    selectedRowIds,
    ...props
}: TableProps<T>) {
    const [onMount, setOnMount] = useState(false);
    const [activeMenuColumn, setActiveMenuColumn] = useState<any>(null);
    const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

    const [selectedIds, setSelectedIds] = useState<string[]>(selectedRowIds ?? []);

    const tableContainerRef = useRef(null);

    const { config, updateConfig } = useTableConfig();

    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
                if (
                    !props.isLoading &&
                    isInfinite &&
                    totalFetched < totalDBRowCount &&
                    scrollHeight - scrollTop - clientHeight < 10
                ) {
                    fetchh();
                }
            }
        },
        [fetchh, totalFetched, totalDBRowCount, isInfinite, props.isLoading]
    );

    const isLoadingOverall = state === 'pending' || props.isLoading;

    useEffect(() => {
        if (selectedRowIds) setSelectedIds(selectedRowIds);
    }, [selectedRowIds]);

    const getRowById = (id: string) => {
        const r = table.getRow(id);
        return r?.original as T | undefined;
    };

    const applySelection = (nextIds: string[]) => {
        setSelectedIds(nextIds);
        if (onSelectedRowsChange) {
            const rows = nextIds.map((id) => getRowById(id)).filter(Boolean) as T[];
            onSelectedRowsChange(nextIds, rows);
        }
    };

    const handleRowClick = (rowId: string) => {
        const next = enableMultiSelect
            ? selectedIds.includes(rowId)
                ? selectedIds.filter((id) => id !== rowId)
                : [...selectedIds, rowId]
            : selectedIds.includes(rowId)
              ? []
              : [rowId];

        applySelection(next);
    };

    const {
        onColumnFiltersChange,
        filterDataState,
        onSortChange,
        columnSizing,
        setColumnSizing,
        initializeOrdering,
        setTableOrdering,
        tableOrdering,
        // getColumnSizingOnLocal,
        showColumnFilters,
        setShowColumnFilters,
        columnVisibility,
        setColumnVisibility,
        initializeVisibility,
        selectedColumnKey,
        setSelectedColumnKey,
    } = useTableContext();

    useEffect(() => {
        if (isConfigCollapsed) {
            setSelectedColumnKey(null);
            setShowColumnFilters(false);
        }
    }, [isConfigCollapsed, setSelectedColumnKey, setShowColumnFilters]);

    useEffect(() => {
        initializeVisibility(columns);
        const o = setTimeout(() => {
            setOnMount(true);
            initializeOrdering(columns);
        });
        return () => {
            clearTimeout(o);
        };
    }, []);

    const configOrderObj = config.tables?.[tableKey]?.columnsOrder || {};
    const configColumnOrder = Object.keys(configOrderObj).sort((a, b) => configOrderObj[a] - configOrderObj[b]);

    const fullColumnOrder = [
        'mrt-row-numbers',
        ...(enableCheckbox ? ['mrt-row-select'] : []),
        ...(columnOrderState?.length
            ? columnOrderState.filter((col) => col !== 'mrt-row-numbers' && col !== 'mrt-row-select')
            : configColumnOrder.filter((col) => col !== 'mrt-row-numbers' && col !== 'mrt-row-select')),
    ];

    const effectiveColumnOrder = fullColumnOrder.length ? fullColumnOrder : undefined;

    const FilterKeyMap: Record<string, FilterKey> = {
        text: FilterKey.Text,
        number: FilterKey.Number,
        'number-interval': FilterKey.NumberInterval,
        select: FilterKey.Select,
        'multi-select': FilterKey.MultiSelect,
        date: FilterKey.Date,
        'date-interval': FilterKey.DateInterval,
    };

    const handleUpdateFilter = (key: string, value: any) => {
        const isValueEmpty =
            value === '' ||
            value === null ||
            value === undefined ||
            (typeof value === 'object' && value.min === '' && value.max === '');

        const updatedFilters = [
            ...filterDataState?.filter?.filter((f) => f.id !== key),
            ...(!isValueEmpty ? [{ id: key, value }] : []),
        ];

        onColumnFiltersChange?.(updatedFilters);
    };

    const renderFilter = (filter: any) => {
        const _onChange = (key: string, value: any) => handleUpdateFilter(key, value);

        let filterType: FilterKey | undefined = filter.type;

        if (typeof filterType === 'string') {
            filterType = FilterKeyMap[filterType];
        }

        // console.log(filterType, filter, 'filterType');
        switch (filterType) {
            case FilterKey.Text:
                return (
                    <div style={{ width: '160px' }}>
                        <S_Input
                            key={filter.key || filter.column}
                            value={filter.value ?? ''}
                            placeholder={filter.placeholder || filter.column}
                            onChange={(e) => _onChange(filter.key, e.target.value)}
                            readOnly={filter.readOnly}
                            size="36"
                            style={{ width: '100%' }}
                        />
                    </div>
                );
            case FilterKey.NumberInterval:
                return (
                    <NumberIntervalFilter
                        key={filter.key || filter.column}
                        value={
                            typeof filter.value === 'object' && filter.value !== null
                                ? filter.value
                                : typeof filter.value === 'number'
                                  ? { min: filter.value, max: filter.value }
                                  : { min: '', max: '' }
                        }
                        onChange={(val) => _onChange(filter.key, val)}
                        readOnly={filter.readOnly}
                        inline
                        placeholder={filter.placeholder || filter.column}
                    />
                );
            case FilterKey.Select:
                const items = (filter.options || []).map((opt: any) => ({
                    value: opt.value,
                    label: opt.label,
                    disabled: !!opt.disabled,
                }));

                // console.log(items, 'i');

                const selectedObj =
                    filter.value != null && filter.value !== ''
                        ? (items.find((i: any) => i.value == filter.value) ?? null)
                        : null;

                // console.log(selectedObj, filter, 'onj');
                return (
                    <div style={{ width: '160px' }}>
                        <Catalog
                            key={filter.key}
                            items={items}
                            getLabel={(i: any) => i?.label}
                            getRowId={(i: any) => String(i?.value)}
                            value={selectedObj ? [selectedObj] : []}
                            onChange={(sel) => {
                                const picked = Array.isArray(sel) ? sel[0] : sel;
                                const newVal = picked ? (picked as any).value : '';
                                _onChange(filter.key, newVal);
                            }}
                            multiple={false}
                            enableModal={false}
                            sizePreset="md-lg"
                            totalItemCount={items.length}
                            onRefetch={undefined}
                            onClickNew={undefined}
                            isLoading={false}
                            showMoreColumns={filter.showMoreColumns || []}
                            searchItems
                        />
                    </div>
                );
            case FilterKey.DateInterval:
                return (
                    <div style={{ width: '190px' }}>
                        <DateIntervalFilter
                            key={filter.key}
                            inline
                            value={filter.value}
                            onChange={(val) => _onChange(filter.key, val)}
                            singlePlaceholder={filter.placeholder}
                            rangePlaceholders={'Aralıq seçin'}
                            errorMsg={false}
                            placement={'leftStart'}
                            oneTap={true}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const columnsWithFilter: any = columns.map((col) => {
        const headerConfig = config?.tables?.[tableKey]?.header || {};
        if (col.accessorKey === 'actions') {
            return {
                ...col,
                header: (
                    <div
                        style={{
                            textAlign: 'center',
                            width: '100%',
                            height: headerConfig?.cell?.padding ? `${headerConfig?.cell?.padding}px` : '30px',
                            lineHeight: headerConfig?.cell?.padding ? `${headerConfig?.cell?.padding}px` : '30px',
                        }}
                    >
                        {col.header}
                    </div>
                ),
            };
        }

        if (!col.accessorKey) return col;

        const customFilterType = col.filterVariant;
        const headerTextStyle = config?.tables?.[tableKey]?.header?.text || {};

        const isSelected = selectedColumnKey === col.accessorKey;

        const isFilterActive = filterDataState?.filter?.some(
            (f) => f.id === col.accessorKey && f.value !== '' && f.value !== null && f.value !== undefined
        );

        return {
            ...col,
            id: col.accessorKey,
            accessorKey: col.accessorKey,
            filterFn: 'custom',
            Filter: ({ column }: any) => {
                const existingFilter = filterDataState?.filter?.find((f) => f.id === column.id);
                const filter = {
                    key: column.id,
                    column: column.id,
                    label: column.columnDef.header,
                    value: existingFilter?.value ?? '',
                    type: customFilterType,
                    onChange: column.setFilterValue,
                    options: column.columnDef.filterSelectOptions || [],
                    placeholder: col?.placeholder,
                };

                return renderFilter(filter);
            },
            header: (
                <div
                    title=""
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: isSelected ? 'var(--background-brand)' : toCssColor(headerTextStyle.color),
                        cursor: 'pointer',
                        height: headerConfig?.cell?.padding ? `${headerConfig?.cell?.padding}px` : '100%',
                        lineHeight: headerConfig?.cell?.padding ? `${headerConfig?.cell?.padding}px` : 'normal',
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isConfigCollapsed) {
                            setSelectedColumnKey((prev: any) => (prev === col.accessorKey ? null : col.accessorKey));
                        }
                    }}
                >
                    {/* <S_Tooltip content={col.header?.toString()} position="right-start"> */}
                    <span
                        style={{
                            fontSize: headerTextStyle.fontSize,
                            fontStyle: headerTextStyle.italic ? 'italic' : undefined,
                            fontWeight: headerTextStyle.bold ? 'bold' : undefined,
                            height: headerConfig?.cell?.padding ? `${headerConfig?.cell?.padding}px` : '100%',
                            lineHeight: headerConfig?.cell?.padding ? `${headerConfig?.cell?.padding}px` : 'normal',
                            justifyContent: headerTextStyle.alignment,
                            maxWidth: '90%',
                        }}
                    >
                        {col.header}
                    </span>
                    {/* </S_Tooltip> */}

                    {enableColumnActionsCustom && (
                        <button
                            className={styles.customMenuToggleBtn}
                            onClick={(e: any) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setActiveMenuColumn({
                                    key: col.accessorKey,
                                    position: {
                                        top: rect.bottom + window.scrollY,
                                        left: rect.left + window.scrollX,
                                    },
                                });
                            }}
                        >
                            <MoreVerticalIcon width={22} height={22} />
                        </button>
                    )}

                    {!enableColumnOrdering &&
                        !enableColumnResizing &&
                        enableColumnFilter &&
                        (isFilterActive ? (
                            <FilterSolidIcon
                                className={styles.filterToggleGlobal}
                                width={16}
                                height={16}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowColumnFilters?.((prev) => !prev);
                                }}
                            />
                        ) : (
                            <FilterIcon
                                className={styles.filterToggleGlobal}
                                width={16}
                                height={16}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowColumnFilters?.((prev) => !prev);
                                }}
                            />
                        ))}
                </div>
            ),
            renderColumnActionsMenuItems: undefined,
        };
    });

    const getNestedValue = (obj: any, path: string): any => path.split('.').reduce((acc, key) => acc?.[key], obj);

    const tableConfig = config.tables?.[tableKey] || {};
    const summaryRowConfig = tableConfig.columns?.summaryRow || {};
    const summaryMode = summaryRowConfig.mode;

    const summaryTopRow: Record<string, any> = { id: '__summary_top__', isSummaryRow: true, position: 'top' };
    const summaryBottomRow: Record<string, any> = { id: '__summary_bottom__', isSummaryRow: true, position: 'bottom' };

    let hasTopSummary = false;
    let hasBottomSummary = false;

    if (!isLoadingOverall && Array.isArray(data) && data.length > 0) {
        columns
            .filter((col) => !!col.accessorKey && (col as any).enableSummary === true)
            .forEach((col) => {
                const key = col.accessorKey as string;

                const sum = data.reduce((acc, row) => {
                    const val = getNestedValue(row, key);
                    return acc + (typeof val === 'number' ? val : !isNaN(Number(val)) ? Number(val) : 0);
                }, 0);

                if (summaryMode === 'top') {
                    summaryTopRow[key] = sum;
                    hasTopSummary = true;
                } else if (summaryMode === 'bottom') {
                    summaryBottomRow[key] = sum;
                    hasBottomSummary = true;
                }
            });
    }

    const finalData: any = [
        ...(hasTopSummary ? [summaryTopRow] : []),
        ...(Array.isArray(data) ? data : []),
        ...(hasBottomSummary ? [summaryBottomRow] : []),
    ];

    const pinnedLeftColumns = [
        'mrt-row-select',
        'mrt-row-numbers',
        ...Object.entries(config.tables?.[tableKey]?.columns || {})
            .filter(([_, val]: any) => val?.config?.freeze === true)
            .map(([key]) => key),
    ];

    const table = useMaterialReactTable<T>({
        columns: columnsWithFilter,
        data: finalData,
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        enableColumnActions: enableColumnActions,
        enableColumnFilters: true,
        enableColumnOrdering: enableColumnOrdering,
        enableSorting: false,
        enableColumnResizing: enableColumnResizing,
        muiTableContainerProps: {
            className: styles.tableContainer,
            ref: tableContainerRef,
            onScroll: (event: any) => isInfinite && fetchMoreOnBottomReached(event.target as HTMLDivElement),
        },

        onColumnOrderChange: onColumnOrderChange
            ? (updaterOrValue) => {
                  const newOrder =
                      typeof updaterOrValue === 'function'
                          ? updaterOrValue(table.getState().columnOrder)
                          : updaterOrValue;

                  onColumnOrderChange(newOrder);
              }
            : undefined,
        enableRowNumbers: enableRowNumbers,
        displayColumnDefOptions: {
            'mrt-row-numbers': { enableColumnOrdering: false },
            'mrt-row-select': {
                size: 36,
                enableColumnOrdering: false,
                enableResizing: false,

                Header: ({ table }) => {
                    const selectable = table.getRowModel().rows.filter((r) => r.getCanSelect?.());
                    const all = selectable.length > 0 && selectable.every((r) => r.getIsSelected());
                    const some = selectable.some((r) => r.getIsSelected()) && !all;

                    return (
                        <div
                            data-mrt-row-select
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <S_Checkbox
                                label=""
                                color="primary"
                                size="16"
                                checked={all || some}
                                onCheckedChange={({ checked }) => {
                                    table.toggleAllRowsSelected(!!checked);
                                }}
                            />
                        </div>
                    );
                },

                Cell: ({ row }) => {
                    if (row.original?.isSummaryRow || !row.getCanSelect?.()) {
                        return <div style={{ width: 24, height: 24 }} />;
                    }

                    const checked = row.getIsSelected();
                    return (
                        <div data-mrt-row-select onClick={(e) => e.stopPropagation()}>
                            <S_Checkbox
                                label=""
                                color="primary"
                                size="16"
                                checked={checked}
                                onCheckedChange={({ checked }) => {
                                    row.toggleSelected(!!checked);
                                }}
                            />
                        </div>
                    );
                },
            },
        },

        layoutMode: 'grid',
        enableTopToolbar: false,
        enableMultiRowSelection: enableMultiSelect,
        getRowProps: true,
        enableStickyHeader: config.tables?.[tableKey]?.header?.pinned ?? false,
        enablePagination: true,
        enableBottomToolbar: false,
        paginationDisplayMode: 'pages',
        onSelectedRowsChange,
        selectedRowIds,
        muiTableHeadProps: {
            className: styles.thead,
            sx: {
                display: 'table-header-group',
            },
        },
        muiTableBodyProps: {
            className: styles.tbody,
        },
        muiTablePaperProps: {
            className: styles.tableWrapper,
        },
        muiTableBodyCellProps: ({ cell, row, column }) => {
            const columnId = cell.column.columnDef.accessorKey || cell.column.id;
            const isSummaryRow = row.original?.isSummaryRow;
            const isColSelected = selectedColumnKey === column?.id;

            const isRowSelected = selectedIds.includes(row.id);
            const allLeaf = table.getAllLeafColumns();
            const colIdx = allLeaf.findIndex((c) => c.id === column.id);
            const isFirst = colIdx === -1;
            const isLast = colIdx === allLeaf.length - 1;

            const tableColumnConfig = config.tables?.[tableKey]?.columns?.[columnId];
            const styleConfig = tableColumnConfig?.config?.style || {};

            const rowCfg = config.tables?.[tableKey]?.row || {};
            const stripeStyle = rowCfg?.stripeStyle ?? 'plain';

            const mergedText = rowCfg.text || {};
            const mergedCell = rowCfg.cell || {};
            const mergedBorder = rowCfg.border || {};

            const selectedBg = 'var(--background-selected)';

            const getBackgroundColor = () => {
                // console.log(isRowSelected, 'isRowSelected');
                if (isRowSelected) return selectedBg;

                const baseColor = toCssColor(mergedCell.backgroundColor) ?? '#ffffff';
                const altColor = 'var(--background-secondary, #F3F3F3)';

                if (hoveredRowId === row.id) {
                    // if (stripeStyle === 'plain') return altColor;
                    // const isOdd = row.index % 2 === 1;
                    // return isOdd ? altColor : baseColor;
                    return 'var(--background-selected)';
                }

                if (styleConfig.backgroundColor) return styleConfig.backgroundColor;
                if (stripeStyle === 'striped') return row.index % 2 === 1 ? baseColor : altColor;

                return baseColor;
            };

            getBackgroundColor();

            const style: React.CSSProperties = {
                backgroundColor: getBackgroundColor(),
                color: toCssColor(styleConfig.color) ?? toCssColor(mergedText.color) ?? '#000',
                fontSize: styleConfig.fontSize ?? mergedText.fontSize,
                fontStyle: (styleConfig.italic ?? rowCfg?.text?.italic) ? 'italic' : undefined,
                fontWeight: (styleConfig.bold ?? rowCfg?.text?.bold) ? 'bold' : undefined,
                textAlign: styleConfig.alignment ?? mergedText.alignment ?? 'left',
                borderBottomStyle: mergedBorder.style || 'solid',
                borderBottomColor: toCssColor(mergedBorder.color) || 'transparent',
                borderBottomWidth: mergedBorder.thickness ? `${mergedBorder.thickness}px` : '1px',
                transform: isColSelected ? 'scale(1.05)' : 'scale(1)',
                opacity: selectedColumnKey ? (isColSelected ? 1 : 0.5) : 1,
                transition: 'all 0.2s ease-in-out',
                justifyContent: styleConfig.alignment,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',

                ...(isRowSelected && {
                    borderLeftColor: 'var(--background-selected)',
                    ...(isFirst && { borderLeft: '2px solid "var(--background-selected)"' }),
                    ...(isLast && { borderRight: '2px solid "var(--background-selected)"' }),
                    zIndex: 1,
                }),
            };

            if (columnId === 'mrt-row-numbers') {
                if (isSummaryRow) return { children: 'CƏM', style };
                const base = isInfinite ? 0 : (filterDataState?.skip || 0) * (filterDataState?.take || 0);
                const displayIndex = row.index + 1 + base - (hasTopSummary ? 1 : 0);
                return { children: displayIndex, style };
            }

            return { style };
        },

        muiTableHeadCellProps: ({ column }) => {
            const isPinned =
                column.id === 'mrt-row-numbers' || column.id === 'mrt-row-select' || column.getIsPinned?.() === 'left';

            const index = table.getAllLeafColumns().findIndex((c) => c.id === column.id);

            const headerConfig = config?.tables?.[tableKey]?.header || {};
            const styleConfig = config.tables?.[tableKey]?.columns?.[column.id]?.config?.style || {};
            const isSelected = selectedColumnKey === column.id;

            const columnStyle = config.tables?.[tableKey]?.columns?.[column.id]?.config?.style;
            const textStyle = columnStyle || headerConfig.text || {};

            return {
                className: styles.tableHeadCell,
                title: '',
                sx: {
                    '& .MuiTableSortLabel-icon': {
                        display: 'none',
                    },
                    '& [data-testid="FilterAltIcon"]': {
                        display: 'none',
                    },
                    ...(index === 0 && {
                        paddingBottom: '12px',
                    }),
                    ...(index === 1 && {
                        paddingBottom: '12px',
                    }),

                    ...(isPinned && {
                        position: 'sticky',
                        left: column.getStart('left'),
                        top: 0,
                        zIndex: 111,
                    }),
                    zIndex: isPinned ? 101 : 100,
                    backgroundColor: toCssColor(headerConfig?.cell?.backgroundColor),
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    opacity: selectedColumnKey ? (isSelected ? 1 : 0.5) : 1,
                    transition: 'all 0.2s ease-in-out',
                    justifyContent: textStyle?.alignment,

                    borderBottom: `${headerConfig?.border?.thickness ?? 1}px ${headerConfig?.border?.style} ${headerConfig?.border?.color ?? 'transparent'}`,
                    color: textStyle?.color,
                    fontSize: styleConfig?.fontSize,
                    position: 'relative',

                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
            };
        },
        defaultColumn: {
            minSize: 80,
            maxSize: 400,
            size: 190,
        },
        localization: customLocalization,
        onColumnFiltersChange: onColumnFiltersChange,
        // onGlobalFilterChange: setGlobalFilter,
        // onPaginationChange,
        onSortingChange: onSortChange,
        onShowColumnFiltersChange: setShowColumnFilters,
        enableRowSelection: enableCheckbox ? (row) => !row.original?.isSummaryRow : false,
        enableRowPinning: true,
        rowPinningDisplayMode: 'select-sticky',
        // @ts-ignore
        onRowSelectionChange: (updater) => {
            const current = idsToRowSel(selectedIds);
            const nextSel = typeof updater === 'function' ? updater(current) : updater;
            let nextIds = rowSelToIds(nextSel);

            if (!enableMultiSelect && nextIds.length > 1) {
                nextIds = [nextIds[nextIds.length - 1]];
            }
            applySelection(nextIds);
        },
        // rowCount: tableCount?.rowCount,
        positionPagination: 'bottom',
        // rowCount,
        // onColumnOrderChange: setTableOrdering,
        // @ts-ignore
        onColumnSizingChange: (columnSizing) => {
            const sizing =
                typeof columnSizing === 'function' ? columnSizing(table.getState().columnSizing) : columnSizing;
            if (onColumnSizingChange) {
                onColumnSizingChange(sizing);
            } else {
                Object.entries(sizing).forEach(([key, val]: any) => {
                    updateConfig(tableKey, `columns.${key}.config.size`, {
                        width: val,
                        minWidth: 100,
                        maxWidth: 600,
                    });
                });
                setColumnSizing(sizing);
            }
        },
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnVisibility: columnVisibility,
            columnFilters: filterDataState?.filter,
            // @ts-ignore
            columnSizing: columnSizing,
            columnOrder: effectiveColumnOrder ?? tableOrdering,
            // globalFilter,
            rowSelection: idsToRowSel(selectedIds),
            pagination: {
                pageIndex: Math.floor(filterDataState.skip / filterDataState.take),
                pageSize: filterDataState.take,
            },
            // showAlertBanner: isError,
            // showProgressBars: isRefetching,
            sorting: filterDataState?.sort ?? [],
            isLoading: state === 'pending' || props.isLoading,
            showProgressBars: isInfinite && (state === 'pending' || props.isLoading),
            showSkeletons: !isInfinite && (state === 'pending' || props.isLoading),
            showAlertBanner: state === 'error',
            columnPinning: {
                left: pinnedLeftColumns,
            },
            showColumnFilters: showColumnFilters,
        },
        muiLinearProgressProps: {
            color: 'primary',
            sx: { height: 2 },
        },
        renderBottomToolbarCustom: () =>
            isInfinite && props.isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
                    <CircularProgress size={28} />
                </div>
            ) : null,
        muiTableBodyRowProps: ({ row }: any) => {
            const rowId = row.id;
            const rowConfig = config.tables?.[tableKey]?.row || {};
            const rowHeight = rowConfig?.cell?.padding;
            const defaultProps = {
                onClick: (e: React.MouseEvent) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('input[type="checkbox"]') || target.closest('[data-mrt-row-select]')) return;

                    if (row.original?.isSummaryRow) return;

                    handleRowClick(rowId);
                },
                onDoubleClick: () => {
                    onRowDoubleClick?.(row.original);
                },
                onMouseEnter: () => setHoveredRowId(rowId),
                onMouseLeave: () => setHoveredRowId(null),
                style: {
                    cursor: 'pointer',
                    height: rowHeight ? `${rowHeight}px` : '45px',
                },
            };

            const externalProps = getRowProps?.(row) ?? {};

            return {
                ...defaultProps,
                ...externalProps,
                style: {
                    ...defaultProps.style,
                    ...externalProps.style,
                },
            };
        },

        renderTopToolbarCustom: () => (
            <div className={styles.filterRowLikeTable}>
                {columns.map((col) => {
                    if (!col.accessorKey) return <div key={Math.random()} style={{ flex: 1 }} />;

                    const filter = {
                        key: col.accessorKey,
                        column: col.accessorKey,
                        label: col.header,
                        value: filterDataState?.filter?.find((f) => f.id === col.accessorKey)?.value ?? '',
                        type: col.filterVariant,
                        onChange: (key: string, val: any) => {
                            const updated = [
                                ...(filterDataState?.filter ?? []).filter((f) => f.id !== key),
                                { id: key, value: val },
                            ];
                            onColumnFiltersChange?.(updated);
                        },
                        options: col.filterSelectOptions || [],
                    };

                    return (
                        <div key={col.accessorKey} style={{ flex: 1, padding: '4px' }}>
                            {renderFilter(filter)}
                        </div>
                    );
                })}
            </div>
        ),
        icons: {
            SortIcon: (props: any) => <ArrowDownIcon {...props} />,
        },
        // mrtTheme: {
        //     baseBackgroundColor: `hsl(var(--clr-background))`,
        //     draggingBorderColor: `hsl(var(--clr-secondary-500))`,
        // },
        getRowId: (originalRow, index, parentRow) => {
            if ((originalRow as any)?.isSummaryRow) {
                return (originalRow as any)?.position === 'top' ? '__summary_top__' : '__summary_bottom__';
            }
            if (typeof getRowId === 'function') {
                return getRowId(originalRow as T, index, parentRow as any);
            }
            const r: any = originalRow;
            return String(r?.id ?? r?.Number ?? r?.uniqueNumber ?? index);
        },
        ...props,
    });

    return (
        <TableTheme>
            <MaterialReactTable table={table} />
            {activeMenuColumn && (
                <CustomColumnMenu
                    column={table.getColumn(activeMenuColumn.key)}
                    table={table}
                    tableKey={tableKey}
                    position={activeMenuColumn.position}
                    onClose={() => setActiveMenuColumn(null)}
                />
            )}
        </TableTheme>
    );
}

export { Table };
