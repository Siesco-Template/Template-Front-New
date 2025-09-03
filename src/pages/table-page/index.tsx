import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

import { buildQueryParamsFromTableRequest } from '@/lib/queryBuilder';

import { reportService } from '@/services/reports/reports.service';

import ConfigPanel from '@/shared/config';
import { FilterConfig } from '@/shared/filter';
import FilterPanel from '@/shared/filter/FilterPanel';
import { generateFiltersFromColumns } from '@/shared/filter/config/generateColumns';
import { CustomMRTColumn, Table } from '@/shared/table';
import { TableProvider, useTableContext } from '@/shared/table/table-context';
import Table_Footer from '@/shared/table/table-footer';
import Table_Header from '@/shared/table/table-header';
import { filterDataForFetch } from '@/shared/table/table-helpers';
import { useTableConfig } from '@/shared/table/tableConfigContext';

import styles from './style.module.css';

export enum ReportStatus {
    Compiled = 1,
    Seen = 2,
    Sent = 3,
}

export const ReportStatusLabels: Record<ReportStatus, string> = {
    [ReportStatus.Compiled]: 'Tərtib edildi',
    [ReportStatus.Seen]: 'Baxıldı',
    [ReportStatus.Sent]: 'Göndərildi',
};

export const ReportStatusColors: Record<ReportStatus, { bg: string; text: string }> = {
    [ReportStatus.Compiled]: { bg: 'rgba(0, 102, 255, 0.1)', text: '#0066FF' },
    [ReportStatus.Seen]: { bg: 'rgba(0, 204, 102, 0.1)', text: '#00CC66' },
    [ReportStatus.Sent]: { bg: 'rgba(255, 153, 0, 0.1)', text: '#FF9900' },
};

interface TablePageMainProps {
    isFilterCollapsed: boolean;
    onToggleCollapse: () => void;
    isConfigCollapsed: boolean;
    onToggleConfigCollapse: () => void;
}

type BudceTableData = {
    rowNumber: number;
    uniqueNumber: string;
    documentNumber: string;
    orderDate: string;
    organization: string;
    fileName: string;
    status: string;
    organizationCode: string;
    year: string;
    quarter: string;
    condition: string;
};

const Table_PageContent: React.FC<TablePageMainProps> = ({
    isFilterCollapsed,
    onToggleCollapse,
    isConfigCollapsed,
    onToggleConfigCollapse,
}) => {
    const { columnVisibility, filterDataState, onColumnFiltersChange } = useTableContext();

    const location = useLocation();
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const allowFetchRef = useRef(false);

    const { loadConfigFromApi, config } = useTableConfig();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BudceTableData[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

    const [isInfinite, setIsInfinite] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [filtersReady, setFiltersReady] = useState(false);

    const handleCustomExport = () => setIsExcelModalOpen(true);

    const didMountColVis = useRef(false);
    const colVisJson = JSON.stringify(columnVisibility);

    const handleFilterPanelChange = useCallback(
        (key: string, value: any) => {
            const isEmpty =
                value === '' ||
                value == null ||
                (Array.isArray(value) && value.length === 0) ||
                (typeof value === 'object' && 'min' in value && 'max' in value && value.min === '' && value.max === '');

            const next = [
                ...(filterDataState?.filter ?? []).filter((f: any) => f.id !== key),
                ...(!isEmpty ? [{ id: key, value }] : []),
            ];

            onColumnFiltersChange?.(next);
        },
        [filterDataState?.filter, onColumnFiltersChange]
    );

    const columns: CustomMRTColumn<BudceTableData>[] = [
        {
            accessorKey: 'Number',
            header: 'Unikal nömrə',
            filterVariant: 'text',
            placeholder: 'Unikal nömrə',
            enableSummary: true,
        },
        {
            accessorKey: 'CompileDate',
            header: 'Tərtib tarixi',
            // @ts-expect-error
            filterVariant: 'date-interval',
            placeholder: 'Tərtib tarixi',
            Cell: ({ cell }: any) => {
                const rawValue = cell.getValue();
                const date = rawValue ? new Date(rawValue) : null;
                const formatted =
                    date && !isNaN(date.getTime())
                        ? `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
                        : '';
                return <div>{formatted}</div>;
            },
        },
        {
            accessorKey: 'Term',
            header: 'Rüb',
            filterVariant: 'select',
            filterSelectOptions: [
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 },
                { label: '4', value: 4 },
            ],
            placeholder: 'Rüb',
        },
        {
            accessorKey: 'ReportStatus',
            header: 'Status',
            filterVariant: 'select',
            filterSelectOptions: [
                { label: 'Tərtib edildi', value: ReportStatus.Compiled },
                { label: 'Baxıldı', value: ReportStatus.Seen },
                { label: 'Göndərildi', value: ReportStatus.Sent },
            ],
            placeholder: 'Status',
            Cell: ({ cell }) => {
                const status = cell.getValue<ReportStatus | null>();
                const label = status != null ? ReportStatusLabels[status] : undefined;
                if (!label) return null;
                const { bg, text } = ReportStatusColors[status!] ?? { bg: '#eee', text: '#333' };
                return (
                    <span
                        style={{
                            padding: '4px 12px',
                            borderRadius: '16px',
                            backgroundColor: bg,
                            color: text,
                            fontWeight: 500,
                            fontSize: '14px',
                            display: 'inline-block',
                        }}
                    >
                        {label}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: '',
            accessorKey: 'actions',
            enableColumnFilter: false,
            enableColumnDragging: false,
            enableColumnActions: false,
            enableResizing: false,
            enableSorting: false,
            maxSize: 36,
            Cell: ({ row }: any) => {
                if (row.original?.isSummaryRow) return null;
                const onClick = (action: 'edit' | 'delete' | 'block' | 'permissions' | 'resetPassword') => {
                    // ...
                };
                return (
                    <div
                        data-row-actions
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                    ></div>
                );
            },
        },
    ];

    const filterColumns = [
        { accessorKey: 'Number', header: 'Unikal nömrə', filterVariant: 'text' },
        {
            accessorKey: 'ReportStatus',
            header: 'Status',
            filterVariant: 'select',
            filterSelectOptions: [
                { label: 'Tərtib edildi', value: ReportStatus.Compiled },
                { label: 'Baxıldı', value: ReportStatus.Seen },
                { label: 'Göndərildi', value: ReportStatus.Sent },
            ],
        },
        {
            accessorKey: 'Term',
            header: 'Rüb',
            filterVariant: 'select',
            filterSelectOptions: [
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 },
                { label: '4', value: 4 },
            ],
            showMoreColumns: [
                { accessorKey: 'Number', header: 'Unikal nömrə', filterVariant: 'text', placeholder: 'Unikal nömrə' },
            ],
        },
        {
            accessorKey: 'Test',
            header: 'Test',
            filterVariant: 'number-interval',
        },
        {
            accessorKey: 'CompileDate',
            header: 'Tərtib tarixi',
            filterVariant: 'date-interval',
        },
    ];

    const [filters, setFilters] = useState<FilterConfig[]>([]);

    useEffect(() => {
        const generated = generateFiltersFromColumns(filterColumns);
        setFilters(generated);

        // loadConfigFromApi();
    }, []);

    console.log(config, 'config in table');

    const fetchData = useCallback(
        (isLoadMore = false, reason: string = 'unknown') => {
            if (!allowFetchRef.current) {
                console.log('[fetchData] BLOCKED (allowFetchRef=false). reason=', reason);
                return;
            }
            if (loading) return;

            setLoading(true);
            console.log('[fetchData] GO. isLoadMore=', isLoadMore, 'reason=', reason);

            const raw: any = filterDataForFetch();
            const nextPage = isLoadMore ? currentPage + 1 : 1;

            const queryParams = isInfinite
                ? buildQueryParamsFromTableRequest(raw, { isInfiniteScroll: true, page: nextPage })
                : buildQueryParamsFromTableRequest(raw);

            const allowed = new Set(
                columns
                    .filter(
                        (c) =>
                            typeof c.accessorKey === 'string' &&
                            c.accessorKey.trim() !== '' &&
                            c.accessorKey !== 'actions'
                    )
                    .map((c) => c.accessorKey as string)
            );

            let visibleColumns = Object.entries(columnVisibility)
                .filter(([key, isVisible]) => Boolean(isVisible) && allowed.has(key))
                .map(([key]) => key);

            visibleColumns = Array.from(new Set(visibleColumns));
            const mandatoryHidden = ['Id'];

            if (visibleColumns.length > 0) {
                queryParams.columns = [...new Set([...visibleColumns, ...mandatoryHidden])].join(',');
            } else {
                queryParams.columns = mandatoryHidden.join(',');
            }

            reportService
                .getAllReports('reports', queryParams)
                .then((res: any) => {
                    if (isInfinite) {
                        if (isLoadMore) {
                            setData((prev) => [...prev, ...res.items]);
                            setCurrentPage(nextPage);
                        } else {
                            setData(res.items);
                            setCurrentPage(1);
                        }
                        console.log('[fetchData] infinite branch');
                    } else {
                        setData(res.items);
                    }
                    setTotalItems(res.totalCount);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        },
        [loading, isInfinite, currentPage, columnVisibility]
    );

    const handleLoadMore = useCallback(() => fetchData(true, 'table-loadMore'), [fetchData]);

    const [hashKey, setHashKey] = useState<string>(() => window.location.hash);

    useEffect(() => {
        const onHash = () => setHashKey(window.location.hash);
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    useEffect(() => {
        if (!filtersReady) return;
        fetchData(false, 'deps-change');
    }, [filtersReady, location.search, isInfinite]);

    useEffect(() => {
        if (!filtersReady) return;

        if (!didMountColVis.current) {
            didMountColVis.current = true;
            return;
        }

        fetchData(false, 'column-visibility-change');
    }, [colVisJson, filtersReady]);

    const isFilterApplied = filterDataState.filter && filterDataState.filter.length > 0;

    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>([]);

    return (
        <>
            <Table_Header
                columns={columns}
                data={data}
                title={'Table Demo'}
                onToggleFilter={onToggleCollapse}
                onToggleConfig={onToggleConfigCollapse}
                onRefresh={() => fetchData(false, 'header-refresh')}
                page="report"
                onClickCustomExport={handleCustomExport}
                actions={['create', 'exportFile']}
                table_key="customer_table"
                notification={isFilterApplied}
                onClickRightBtn={()=>{}}
            />

            <div className={styles.wrapper}>
                <div
                    className={styles.tableArea}
                    style={{ marginRight: (isFilterCollapsed ? 0 : 290) + (isConfigCollapsed ? 0 : 290) + 'px' }}
                >
                    <div className={styles.tableScrollWrapper}>
                        <Table
                            columns={columns}
                            data={data}
                            enableColumnResizing={false}
                            enableMultiSelect={true}
                            enableColumnOrdering={false}
                            isLoading={loading}
                            isConfigCollapsed={isConfigCollapsed}
                            selectedRowIds={selectedRowIds}
                            tableKey="customer_table"
                            onSelectedRowsChange={(ids, rows) => {
                                setSelectedRowIds(ids);
                                setSelectedRows(rows);
                            }}
                            enableCheckbox
                            getRowId={(r) => String((r as any).Id)}
                            totalDBRowCount={totalItems}
                            fetchh={handleLoadMore}
                            totalFetched={data?.length}
                            isInfinite={isInfinite}
                        />
                        <div ref={sentinelRef} style={{ height: 1 }} />
                    </div>
                    <Table_Footer
                        totalItems={totalItems}
                        table_key="customer_table"
                        isInfiniteScroll={isInfinite}
                        onInfiniteChange={setIsInfinite}
                        filtersReady={filtersReady}
                    />
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
                        onChange={handleFilterPanelChange}
                        isCollapsed={isFilterCollapsed}
                        onToggleCollapse={onToggleCollapse}
                        table_key="reports"
                        onReady={() => {
                            allowFetchRef.current = true;
                            setFiltersReady(true);
                        }}
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
                        onToggleCollapse={onToggleConfigCollapse}
                        modalTableData={data}
                        table_key="customer_table"
                        modalTableColumns={columns}
                        isRowSum={true}
                    />
                </div>
            </div>
        </>
    );
};

const Table_Page = () => {
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
    return (
        <TableProvider tableKey="customer_table">
            <Table_PageContent
                isConfigCollapsed={isConfigCollapsed}
                isFilterCollapsed={isFilterCollapsed}
                onToggleCollapse={handleToggleFilterPanel}
                onToggleConfigCollapse={handleToggleConfigPanel}
            />
        </TableProvider>
    );
};

export default Table_Page;
