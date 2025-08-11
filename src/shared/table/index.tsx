import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import {
    MRT_ColumnDef,
    MRT_Row,
    MRT_RowData,
    MRT_RowSelectionState,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_AZ } from 'material-react-table/locales/az';

import { FilterKey } from '../filter/config/filterTypeEnum';
import CatalogSimple from '../filter/filters/CatalogSimple';
import DropdownMultiSelect from '../filter/filters/CatalogWithMultiSelect';
import DateIntervalFilter from '../filter/filters/DateIntervalFilter';
import NumberIntervalFilter from '../filter/filters/NumberIntervalFilter';
import TextFilter from '../filter/filters/TextFilter';
import { ArrowDownIcon, MoreVerticalIcon } from '../icons';
import { arrayToObject, objectToArray } from '../utils';
import CustomColumnMenu from './customColumnMenu';
import { FilterIcon, FilterSolidIcon } from './icons';
import { useTableContext } from './table-context';
import TableTheme from './table-theme';
import './table.css';
import styles from './table.module.css';
import { useTableConfig } from './tableConfigContext';

type CustomMRTColumn<T extends MRT_RowData> = MRT_ColumnDef<T> & {
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
};

const customLocalization = {
    ...MRT_Localization_AZ,
    noRecordsToDisplay: 'Məlumat tapılmadı',
    rowNumber: '№',
};

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
    columnOrderState,
    onRowDoubleClick,
    enableRowNumbers = true,
    enableMultiSelect = false,
    enableColumnOrdering = false,
    enableColumnResizing = false,
    enableColumnActions = false,
    enableColumnActionsCustom = true,
    isConfigCollapsed = false,
    enableColumnFilter = true,
    onColumnSizingChange,
    tableKey,
    onColumnOrderChange,
    ...props
}: TableProps<T>) {
    const [onMount, setOnMount] = useState(false);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [activeMenuColumn, setActiveMenuColumn] = useState<any>(null);
    const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

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

    const { config, updateConfig } = useTableConfig();

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

    const changeSelect = (changeSelect: Dispatch<SetStateAction<MRT_RowSelectionState>>) => {
        if (rowCheckboxSelectState && setRowCheckboxSelect && typeof changeSelect === 'function') {
            const data = arrayToObject(rowCheckboxSelectState);
            const changedDatas = changeSelect(data);
            setRowCheckboxSelect(
                // @ts-ignore
                objectToArray(changedDatas)
            );
        }
    };

    const configOrderObj = config.tables?.[tableKey]?.columnsOrder || {};
    const configColumnOrder = Object.keys(configOrderObj).sort((a, b) => configOrderObj[a] - configOrderObj[b]);

    const fullColumnOrder = [
        'mrt-row-numbers',
        ...(columnOrderState?.length
            ? columnOrderState.filter((col) => col !== 'mrt-row-numbers')
            : configColumnOrder.filter((col) => col !== 'mrt-row-numbers')),
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

        switch (filterType) {
            case FilterKey.Text:
                return (
                    <TextFilter
                        key={filter.key || filter.column}
                        value={filter.value}
                        placeholder={filter.placeholder || filter.column}
                        onChange={(val) => _onChange(filter.key, val)}
                        readOnly={filter.readOnly}
                        compact={true}
                    />
                );
            case FilterKey.NumberInterval:
                return (
                    <NumberIntervalFilter
                        key={filter.key || filter.column}
                        // label={filter.label || filter.column}
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
            case FilterKey.MultiSelect:
                return (
                    <DropdownMultiSelect
                        key={filter.key}
                        // label={filter.label}
                        filterKey={filter.key}
                        options={filter.options || []}
                        value={filter.value || []}
                        onChange={(key, values) => _onChange(key, values)}
                        disabled={filter.readOnly}
                    />
                );
            case FilterKey.Select:
                return (
                    <CatalogSimple
                        key={filter.key}
                        // label={filter.label}
                        options={filter.options || []}
                        value={filter.value || ''}
                        onChange={(value) => _onChange(filter.key, value)}
                        disabled={filter.readOnly}
                    />
                );
            case FilterKey.DateInterval:
                return (
                    <DateIntervalFilter
                        key={filter.key}
                        inline
                        // label={filter.label}
                        value={filter.value || ['', '']}
                        onChange={(val) => _onChange(filter.key, val)}
                        readOnly={filter.readOnly}
                        singlePlaceholder={filter.placeholder}
                        rangePlaceholders={filter.rangePlaceholders}
                    />
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
                            background: 'red',
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
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: isSelected ? '#0068F7' : headerTextStyle.color,
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
                        title={col.header?.toString()}
                    >
                        {col.header}
                    </span>

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

    function lightenColor(hex: string, percent: number): string {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = ((num >> 8) & 0x00ff) + amt;
        const B = (num & 0x0000ff) + amt;

        return (
            '#' +
            (
                0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255)
            )
                .toString(16)
                .slice(1)
        );
    }

    const getNestedValue = (obj: any, path: string): any => path.split('.').reduce((acc, key) => acc?.[key], obj);

    const tableConfig = config.tables?.[tableKey] || {};
    const summaryRowConfig = tableConfig.columns?.summaryRow || {};
    const summaryMode = summaryRowConfig.mode;

    const summaryTopRow: Record<string, any> = { id: '__summary_top__', isSummaryRow: true, position: 'top' };
    const summaryBottomRow: Record<string, any> = { id: '__summary_bottom__', isSummaryRow: true, position: 'bottom' };

    let hasTopSummary = false;
    let hasBottomSummary = false;

    const pinnedLeftColumns = [
        'mrt-row-numbers',
        ...Object.entries(config.tables?.[tableKey]?.columns || {})
            .filter(([_, val]: any) => val?.config?.freeze === true)
            .map(([key]) => key),
    ];

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

    const finalData: any = props.isLoading
        ? []
        : [
              ...(hasTopSummary ? [summaryTopRow] : []),
              ...(Array.isArray(data) ? data : []),
              ...(hasBottomSummary ? [summaryBottomRow] : []),
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
            'mrt-row-numbers': {
                enableColumnOrdering: false,
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
        muiTableContainerProps: {
            className: styles.tableContainer,
        },
        muiTableBodyCellProps: ({ cell, row, column }) => {
            const columnId = cell.column.columnDef.accessorKey || cell.column.id;
            const isSummaryRow = row.original?.isSummaryRow;
            const isSelected = selectedColumnKey === column?.id;

            const rowId = row.id;
            const isHighlighted = props.highlightedRowIds?.includes?.(rowId);

            const tableColumnConfig = config.tables?.[tableKey]?.columns?.[columnId];
            const styleConfig = tableColumnConfig?.config?.style || {};

            const rowConfig = config.tables?.[tableKey]?.row || {};
            const stripeStyle = rowConfig?.stripeStyle ?? 'plain';

            const mergedText = rowConfig.text || {};
            const mergedCell = rowConfig.cell || {};
            const mergedBorder = rowConfig.border || {};

            const getBackgroundColor = () => {
                if (props.highlightedRowIds?.includes(row.id)) {
                    return '#E6F0FF';
                }

                const baseColor = mergedCell.backgroundColor ?? '#ffffff';
                const altColor = mergedCell.alternateBackgroundColor ?? lightenColor(baseColor, 20);

                if (hoveredRowId === row.id) {
                    if (stripeStyle === 'plain') {
                        return altColor;
                    } else if (stripeStyle === 'striped') {
                        const isOdd = row.index % 2 === 1;
                        return isOdd ? altColor : baseColor;
                    }
                }

                if (styleConfig.backgroundColor) return styleConfig.backgroundColor;

                if (stripeStyle === 'striped') {
                    return row.index % 2 === 1 ? baseColor : altColor;
                }

                return baseColor;
            };

            const getTextColor = () => {
                if (props.highlightedRowIds?.includes(row.id)) {
                    return styleConfig.color ?? mergedText.highlightedColor ?? '#003366'; // xüsusi rəng
                }

                return styleConfig.color ?? mergedText.color ?? '#000';
            };

            const style: React.CSSProperties = {
                backgroundColor: getBackgroundColor(),

                color: getTextColor(),
                fontSize: styleConfig.fontSize ?? mergedText.fontSize,
                fontStyle: (styleConfig.italic ?? rowConfig?.text?.italic) ? 'italic' : undefined,
                fontWeight: (styleConfig.bold ?? rowConfig?.text?.bold) ? 'bold' : undefined,

                textAlign: styleConfig.alignment ?? mergedText.alignment ?? 'left',
                borderBottomStyle: mergedBorder.style || 'solid',
                borderBottomColor: mergedBorder.color || 'transparent',
                borderBottomWidth: mergedBorder.thickness ? `${mergedBorder.thickness}px` : '1px',

                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                opacity: selectedColumnKey ? (isSelected ? 1 : 0.5) : 1,
                transition: 'all 0.2s ease-in-out',
                justifyContent: styleConfig.alignment,

                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            };

            if (columnId === 'mrt-row-numbers') {
                if (isSummaryRow) return { children: 'CƏM', style };
                const displayIndex =
                    row.index + 1 + filterDataState?.skip * filterDataState?.take - (hasTopSummary ? 1 : 0);
                return { children: displayIndex, style };
            }

            return { style };
        },
        muiTableHeadCellProps: ({ column }) => {
            const isPinned = column.id === 'mrt-row-numbers' || column.getIsPinned?.() === 'left';

            const index = table.getAllLeafColumns().findIndex((c) => c.id === column.id);

            const headerConfig = config?.tables?.[tableKey]?.header || {};
            const styleConfig = config.tables?.[tableKey]?.columns?.[column.id]?.config?.style || {};
            const isSelected = selectedColumnKey === column.id;

            const columnStyle = config.tables?.[tableKey]?.columns?.[column.id]?.config?.style;
            const textStyle = columnStyle || headerConfig.text || {};

            return {
                className: styles.tableHeadCell,
                title: column.columnDef.header?.toString(),
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

                    ...(isPinned && {
                        position: 'sticky',
                        left: column.getStart('left'),
                        top: 0,
                        zIndex: 111,
                    }),
                    zIndex: isPinned ? 101 : 100,
                    backgroundColor: headerConfig?.cell?.backgroundColor || 'hsl(var(--clr-grey-50))',
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
        enableRowSelection: enableCheckbox,
        enableRowPinning: true,
        rowPinningDisplayMode: 'select-sticky',
        // @ts-ignore
        onRowSelectionChange: changeSelect,
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
            rowSelection: arrayToObject(rowCheckboxSelectState),
            pagination: {
                pageIndex: Math.floor(filterDataState.skip / filterDataState.take),
                pageSize: filterDataState.take,
            },
            // showAlertBanner: isError,
            // showProgressBars: isRefetching,
            sorting: filterDataState?.sort ?? [],
            isLoading: state === 'pending' || props.isLoading,
            showSkeletons: state === 'pending' || props.isLoading,
            showProgressBars: state === 'pending' || props.isLoading,
            showAlertBanner: state === 'error',
            columnPinning: {
                left: pinnedLeftColumns,
            },
            showColumnFilters: showColumnFilters,
        },
        muiTableBodyRowProps: ({ row }: any) => {
            const rowId = row.id;

            const isSelected = selectedRows.includes(rowId);
            const rowConfig = config.tables?.[tableKey]?.row || {};
            const rowHeight = rowConfig?.cell?.padding;

            const isHighlighted = props.highlightedRowIds?.includes?.(rowId);

            const handleClick = () => {
                if (enableMultiSelect) {
                    setSelectedRows((prev) =>
                        prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
                    );
                } else {
                    setSelectedRows((prev) => (prev.includes(rowId) ? [] : [rowId]));
                }
            };

            const defaultProps = {
                onClick: handleClick,
                onDoubleClick: () => {
                    onRowDoubleClick?.(row.original);
                },
                onMouseEnter: () => setHoveredRowId(rowId),
                onMouseLeave: () => setHoveredRowId(null),
                style: {
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 0 2px #0068F7 inset' : 'none',
                    backgroundColor: isHighlighted ? '#E6F0FF' : undefined,
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
        mrtTheme: {
            baseBackgroundColor: `hsl(var(--clr-background))`,
            draggingBorderColor: `hsl(var(--clr-secondary-500))`,
        },
        getRowId: (row) => {
            if (row.id) return row.id;
            if (row.isSummaryRow && row.position === 'top') return '__summary_top__';
            if (row.isSummaryRow && row.position === 'bottom') return '__summary_bottom__';
            return row.id;
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
