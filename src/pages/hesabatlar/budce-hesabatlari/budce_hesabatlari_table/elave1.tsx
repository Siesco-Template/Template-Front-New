import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { buildQueryParamsFromTableRequest } from '@/lib/queryBuilder';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';

import { excelService } from '@/services/import/export/excel.service';
import { reportService } from '@/services/report/report.service';

import { usePermission } from '@/modules/permission/PermissionContext';
import { hasPermission } from '@/modules/permission/PermissionGuard';

import ConfigPanel from '@/shared/config';
import BottomModal from '@/shared/config/modal/bottomModal';
import { FilterConfig } from '@/shared/filter';
import FilterPanel from '@/shared/filter/FilterPanel';
import { generateFiltersFromColumns } from '@/shared/filter/config/generateColumns';
import { Table } from '@/shared/table';
import { InformationIcon } from '@/shared/table/icons';
import { useTableContext } from '@/shared/table/table-context';
import Table_Footer from '@/shared/table/table-footer';
import Table_Header from '@/shared/table/table-header';
import { filterDataForFetch } from '@/shared/table/table-helpers';
import { useTableConfig } from '@/shared/table/tableConfigContext';

import { S_Button } from '@/ui';

import { ExcelTableModal } from '../ExcelTableModal';
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
    [ReportStatus.Compiled]: {
        bg: 'rgba(0, 102, 255, 0.1)',
        text: '#0066FF',
    },
    [ReportStatus.Seen]: {
        bg: 'rgba(0, 204, 102, 0.1)',
        text: '#00CC66',
    },
    [ReportStatus.Sent]: {
        bg: 'rgba(255, 153, 0, 0.1)',
        text: '#FF9900',
    },
};

const slugToLabel: Record<string, string> = {
    'elave-1': 'Əlavə №1',
    'elave-2': 'Əlavə №2',
    'elave-3': 'Əlavə №3',
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

type CustomMRTColumn<T extends MRT_RowData> = MRT_ColumnDef<T> & {
    enableSummary?: boolean;
    placeholder?: string;
    filterVariant?: string;
    filterSelectOptions?: { label: string; value: any }[];
};

const Elave1: React.FC<TablePageMainProps> = ({
    isFilterCollapsed,
    onToggleCollapse,
    isConfigCollapsed,
    onToggleConfigCollapse,
}) => {
    const { permissions } = usePermission();
    const { id } = useParams();

    const label = slugToLabel[id ?? ''] || 'Naməlum hesabat';
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState<BudceTableData[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleCloseModal = () => {
        setIsExcelModalOpen(false);
    };

    const handleCustomExport = () => {
        setIsExcelModalOpen(true);
    };
    const location = useLocation();

    useEffect(() => {
        loadConfigFromApi();
    }, []);

    const navigate = useNavigate();
    const { columnVisibility, filterDataState } = useTableContext();
    const { loadConfigFromApi, config } = useTableConfig();

    const backendColumnMap: Record<string, string> = {
        Number: 'Number',
        CompileDate: 'CompileDate',
        ShortName: 'Organization.ShortName',
        StructuralUnit: 'Organization.StructuralUnit',
        ReportStatus: 'ReportStatus',
        Code: 'Organization.Code',
        Term: 'Term',
    };

    const fetchData = (isLoadMore = false) => {
        if (loading) return;

        setLoading(true);

        // const take = filterDataState.take;

        const raw: any = filterDataForFetch();

        const queryParams = buildQueryParamsFromTableRequest(raw);

        const columns = Object.entries(columnVisibility)
            .filter(([_, isVisible]) => isVisible)
            .map(([colKey]) => backendColumnMap[colKey])
            .filter(Boolean)
            .join(',');

        reportService
            .getAllReports('reports', columns, queryParams)
            .then((res: any) => {
                console.log(res.datas, 'clg')
                setData(res?.datas);
                setTotalItems(res.totalCount);
            })
            .catch(console.error)
            .finally(() => {
                setLoading(false);
            });
    };

    const buildQueryParams = (data: any): Record<string, any> => {
        const params: Record<string, any> = {};

        const hardcodedColumnMap: Record<string, string> = {
            organizationCode: 'Organization.Code',
            organizationName: 'Organization.ShortName',
        };

        if (data.filter && Array.isArray(data.filter)) {
            data.filter.forEach((f: any, i: number) => {
                const columnKey = hardcodedColumnMap[f.id] ?? f.id;

                params[`Filters[${i}].column`] = columnKey;
                params[`Filters[${i}].filterOperation`] = f.type;

                if (f.type === 11 && Array.isArray(f.value)) {
                    const [start, end] = f.value;
                    if (start && end) {
                        params[`Filters[${i}].value`] = `${start},${end}`;
                    }
                } else {
                    params[`Filters[${i}].value`] = f.value;
                }
            });
        }

        if (data.sort && Array.isArray(data.sort)) {
            data.sort.forEach((sortItem: any, i: number) => {
                const sortKey = hardcodedColumnMap[sortItem.id] ?? sortItem.id;

                params[`Sort[${i}].SortBy`] = sortKey;
                params[`Sort[${i}].SortDirection`] = sortItem.desc;
            });
        } else if (data.sortBy && data.sortDirection !== undefined) {
            const sortKey = hardcodedColumnMap[data.sortBy] ?? data.sortBy;
            params['SortBy'] = sortKey;
            params['SortDirection'] = data.sortDirection;
        }

        return params;
    };

    const columns: CustomMRTColumn<BudceTableData>[] = [
        {
            accessorKey: 'number',
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
            accessorKey: 'StructuralUnit',
            header: 'Struktur vahidi',
            filterVariant: 'text',
            placeholder: 'Təşkilatın struktur vahidi  ',
        },
        {
            accessorKey: 'ShortName',
            header: 'Təşkilat adı',
            filterVariant: 'text',
            placeholder: 'Təşkilat adı',
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

        {
            accessorKey: 'Code',
            header: 'Təşkilat kodu',
            filterVariant: 'text',
            placeholder: 'Təşkilat kodu',
        },
    ];

    if (permissions && hasPermission(permissions, 'report/getById')) {
        columns.push({
            id: 'actions',
            header: '',
            size: 50,
            enableSorting: false,
            enableColumnFilter: false,
            enableResizing: false,
            Cell: ({ row }: any) => {
                return (
                    <button
                        onClick={() => navigate(`/hesabatlar/budce-hesabatlari/${id}/info/${row.original.reportId}`)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                        }}
                    >
                        <InformationIcon width={16} height={16} color="#909DAD" />
                    </button>
                );
            },
        });
    }

    const filterColumns = [
        {
            accessorKey: 'number',
            header: 'Unikal nömrə',
            filterVariant: 'text',
        },
        {
            accessorKey: 'compileDate',
            header: 'Tərtib tarixi',
            filterVariant: 'date-interval',
        },
        {
            accessorKey: 'structuralUnit',
            header: 'Struktur vahidi',
            filterVariant: 'text',
        },
        {
            accessorKey: 'organizationName',
            header: 'Təşkilat adı',
            filterVariant: 'text',
        },
        {
            accessorKey: 'reportStatus',
            header: 'Status',
            filterVariant: 'select',
            filterSelectOptions: [
                { label: 'Tərtib edildi', value: ReportStatus.Compiled },
                { label: 'Baxıldı', value: ReportStatus.Seen },
                { label: 'Göndərildi', value: ReportStatus.Sent },
            ],
        },
        {
            accessorKey: 'term',
            header: 'Rüb',
            filterVariant: 'select',
            filterSelectOptions: [
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 },
                { label: '4', value: 4 },
            ],
        },
        {
            accessorKey: 'organizationCode',
            header: 'Təşkilat kodu',
            filterVariant: 'text',
        },
    ];

    const [filters, setFilters] = useState<FilterConfig[]>([]);

    useEffect(() => {
        const generatedFilters = generateFiltersFromColumns(filterColumns);
        setFilters(generatedFilters);
    }, []);

    const handleRightBtnClick = () => {
        navigate(`/hesabatlar/budce-hesabatlari/${id}/yeni`);
    };

    useEffect(() => {
        if (Object.keys(columnVisibility).length > 0) {
            fetchData();
        }
    }, [columnVisibility, location.search]);

    const [exportConfig, setExportConfig] = useState<any>({
        visibleColumns: [],
        orderedColumns: [],
    });

    const handleSimpleExport = async () => {
        try {
            // if (!connectionId) {
            //     return false;
            // }

            const filterData = filterDataForFetch();
            const queryParams = buildQueryParams(filterData);

            const exportPayload = {
                // connectionId,
                tableRequest: {
                    tableId: 'reports',
                    columns:
                        'Id,Number,CompileDate,Organization.ShortName,Organization.StructuralUnit,ReportStatus,Organization.Code,Term',
                    filters: Object.entries(queryParams)
                        .filter(([key]) => key.startsWith('Filters'))
                        .reduce((acc, [key, value]) => {
                            const match = key.match(/Filters\[(\d+)]\.(\w+)/);
                            if (!match) return acc;
                            const index = +match[1];
                            const field = match[2];
                            acc[index] = { ...acc[index], [field]: value };
                            return acc;
                        }, [] as any[]),
                    pagination: {
                        page: 1,
                        take: 1000,
                        isInfiniteScroll: true,
                    },
                    sortBy: queryParams.SortBy || '',
                    sortDirection: queryParams.SortDirection || '',
                },
                columns: [
                    { propertyName: 'Number', header: 'Unikal nömrə' },
                    { propertyName: 'CompileDate', header: 'Tərtib tarixi' },
                    { propertyName: 'ShortName', header: 'Təşkilat adı' },
                    { propertyName: 'StructuralUnit', header: 'Struktur vahidi' },
                    { propertyName: 'ReportStatus', header: 'Status' },
                    { propertyName: 'Code', header: 'Təşkilat kodu' },
                    { propertyName: 'Term', header: 'Rüb' },
                ],
            };

            await excelService.startExportManual(exportPayload);
            toast.success('Fayl uğurla yükləndi');
        } catch (error: any) {
            console.error('Export error:', error);
            // toast.error(`Xəta baş verdi: ${error?.message}`);
        }
    };

    const handleCustomExportConfirm = async () => {
        try {
            // if (!connectionId) {
            //     toast.error('Bağlantı tapılmadı');
            //     return;
            // }

            const visibleCols = exportConfig.orderedColumns.filter((key: any) =>
                exportConfig.visibleColumns.includes(key)
            );

            const fullColumnMap: Record<string, string> = {
                number: 'Number',
                compileDate: 'CompileDate',
                organizationName: 'Organization.ShortName',
                structuralUnit: 'Organization.StructuralUnit',
                reportStatus: 'ReportStatus',
                organizationCode: 'Organization.Code',
                term: 'Term',
            };

            const propertyNameMap: Record<string, string> = {
                number: 'Number',
                compileDate: 'CompileDate',
                organizationName: 'ShortName',
                structuralUnit: 'StructuralUnit',
                reportStatus: 'ReportStatus',
                organizationCode: 'Code',
                term: 'Term',
            };

            const headerMap: Record<string, string> = {
                number: 'Unikal nömrə',
                compileDate: 'Tərtib tarixi',
                organizationName: 'Təşkilat adı',
                structuralUnit: 'Struktur vahidi',
                reportStatus: 'Status',
                organizationCode: 'Təşkilat kodu',
                term: 'Rüb',
            };

            const filterData = filterDataForFetch();
            const queryParams = buildQueryParams(filterData);
            const exportPayload = {
                // connectionId,
                tableRequest: {
                    tableId: 'reports',
                    columns: visibleCols.map((k: any) => fullColumnMap[k]).join(','),
                    filters: Object.entries(queryParams)
                        .filter(([key]) => key.startsWith('Filters'))
                        .reduce((acc, [key, value]) => {
                            const match = key.match(/Filters\[(\d+)]\.(\w+)/);
                            if (!match) return acc;
                            const index = +match[1];
                            const field = match[2];
                            acc[index] = { ...acc[index], [field]: value };
                            return acc;
                        }, [] as any[]),
                    pagination: {
                        page: 1,
                        take: 1000,
                        isInfiniteScroll: true,
                    },
                    sortBy: queryParams.SortBy || '',
                    sortDirection: queryParams.SortDirection || '',
                },
                columns: visibleCols.map((k: any) => ({
                    propertyName: propertyNameMap[k], // Düzgün backend field adı
                    header: exportConfig.headerOverrides?.[k] || headerMap[k], // İnsan oxuya biləcəyi başlıq
                })),
            };

            await excelService.startExportManual(exportPayload);
            // toast.success('Export istəyi göndərildi!');
            handleCloseModal();
            toast.success('Fayl uğurla yükləndi');
        } catch (error: any) {
            console.error('Export error:', error);
            // toast.error(`Xəta baş verdi: ${error?.message}`);
        }
    };

    const isFilterApplied = filterDataState.filter && filterDataState.filter.length > 0;
    return (
        <>
            <Table_Header
                columns={columns}
                data={data}
                title={label}
                onToggleFilter={onToggleCollapse}
                onToggleConfig={onToggleConfigCollapse}
                onClickRightBtn={handleRightBtnClick}
                onClickExport={handleSimpleExport}
                onRefresh={fetchData}
                page="report"
                onClickCustomExport={handleCustomExport}
                actions={['create', 'exportFile']}
                table_key="customer_table"
                notification={isFilterApplied}
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
                    />
                </div>
            </div>

            <BottomModal isOpen={isExcelModalOpen} onClose={handleCloseModal} title="Məlumatları seç və endir">
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
            </BottomModal>
        </>
    );
};
export default Elave1;
