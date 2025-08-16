import { useEffect, useState } from 'react';
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
    const { columnVisibility, filterDataState } = useTableContext();
    const { loadConfigFromApi } = useTableConfig();

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState<BudceTableData[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

    const handleCustomExport = () => {
        setIsExcelModalOpen(true);
    };
    const location = useLocation();

    useEffect(() => {
        loadConfigFromApi();
    }, []);

    const fetchData = (isLoadMore = false) => {
        if (loading) return;
        setLoading(true);

        const raw: any = filterDataForFetch();
        const queryParams: any = buildQueryParamsFromTableRequest(raw);

        const allowed = new Set(
            columns.map((c) => c.accessorKey).filter((k): k is string => typeof k === 'string' && k.trim() !== '')
        );

        let visibleColumns = Object.entries(columnVisibility)
            .filter(([key, isVisible]) => Boolean(isVisible) && allowed.has(key))
            .map(([key]) => key);

        visibleColumns = Array.from(new Set(visibleColumns));

        if (visibleColumns.length > 0) {
            queryParams.columns = visibleColumns.join(',');
        } else {
            delete queryParams.columns;
        }

        reportService
            .getAllReports('reports', queryParams)
            .then((res: any) => {
                setData(res.items);
                setTotalItems(res.totalCount);
            })
            .catch(console.error)
            .finally(() => {
                setLoading(false);
            });
    };

    const columns: CustomMRTColumn<BudceTableData>[] = [
        {
            accessorKey: 'Number',
            header: 'Unikal nömrə',
            filterVariant: 'text',
            placeholder: 'Unikal nömrə',
        },
        {
            accessorKey: 'CompileDate',
            header: 'Tərtib tarixi',
            filterVariant: 'text',
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
                const status = cell.getValue<ReportStatus>();
                const label = ReportStatusLabels[status] || 'Naməlum';
                const { bg, text } = ReportStatusColors[status] || {
                    bg: '#eee',
                    text: '#333',
                };

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
    ];

    const filterColumns = [
        {
            accessorKey: 'Number',
            header: 'Unikal nömrə',
            filterVariant: 'text',
        },
        // {
        //     accessorKey: 'CompileDate',
        //     header: 'Tərtib tarixi',
        //     filterVariant: 'date-interval',
        // },

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
        },
    ];

    const [filters, setFilters] = useState<FilterConfig[]>([]);

    useEffect(() => {
        const generatedFilters = generateFiltersFromColumns(filterColumns);
        setFilters(generatedFilters);
    }, []);

    useEffect(() => {
        if (Object.keys(columnVisibility).length > 0) {
            fetchData();
        }
    }, [columnVisibility, location.search]);

    const isFilterApplied = filterDataState.filter && filterDataState.filter.length > 0;

    return (
        <>
            <Table_Header
                columns={columns}
                data={data}
                title={'Table Demo'}
                onToggleFilter={onToggleCollapse}
                onToggleConfig={onToggleConfigCollapse}
                onRefresh={fetchData}
                page="report"
                onClickCustomExport={handleCustomExport}
                actions={['create', 'exportFile']}
                table_key="customer_table"
                notification={isFilterApplied}
                // onClickExport={handleSimpleExport}
            />

            <div className={styles.wrapper}>
                <div
                    className={styles.tableArea}
                    style={{
                        marginRight: (isFilterCollapsed ? 0 : 280) + (isConfigCollapsed ? 0 : 280) + 'px',
                    }}
                >
                    <div className={styles.tableScrollWrapper}>
                        <Table
                            columns={columns}
                            data={data}
                            enableColumnResizing={false}
                            enableMultiSelect={false}
                            enableColumnOrdering={false}
                            isLoading={loading}
                            isConfigCollapsed={isConfigCollapsed}
                            tableKey="customer_table"
                        />
                    </div>
                    <Table_Footer totalItems={totalItems} table_key="customer_table" />
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
                        onToggleCollapse={onToggleCollapse}
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
                        onToggleCollapse={onToggleConfigCollapse}
                        modalTableData={data}
                        table_key="customer_table"
                        modalTableColumns={columns}
                        isRowSum={false}
                    />
                </div>
            </div>

            {/* <BottomModal isOpen={isExcelModalOpen} onClose={handleCloseModal} title="Məlumatları seç və endir">
                <div className={styles.modalContent}>
                    <h1>Sənəd.xlsx</h1>
                    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        <ExcelTableModal columns={columns} data={data} onExportConfigChange={setExportConfig} />
                    </div>
                    <div className={styles.btnGroup}>
                        <S_Button variant="outlined-20" onClick={handleCloseModal}>
                            Ləğv et
                        </S_Button>
                        <S_Button variant="main-20" onClick={handleCustomExportConfirm}>
                            {isUploading ? <span className={styles.spinner} /> : 'Təsdiqlə'}
                        </S_Button>
                    </div>
                </div>
            </BottomModal> */}
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
