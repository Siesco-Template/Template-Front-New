import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

import { buildQueryParamsFromTableRequest } from '@/lib/queryBuilder';
import { inertProps } from '@/lib/useInert';

import { catalogService } from '@/services/catalog/catalog.service';
import { reportService } from '@/services/reports/reports.service';

import { Folder } from '@/modules/folder';
import { folderService } from '@/modules/folder/services/folder.service';
import { FolderItem, ViewMode } from '@/modules/folder/types';

import Catalog from '@/shared/catalog';
import ConfigPanel from '@/shared/config';
import { FilterConfig } from '@/shared/filter';
import FilterPanel from '@/shared/filter/FilterPanel';
import { generateFiltersFromColumns } from '@/shared/filter/config/generateColumns';
import { PencilIcon, PencilPaperIcon, TrashIcon } from '@/shared/icons';
import { CustomMRTColumn, Table } from '@/shared/table';
import TableActions from '@/shared/table/table-actions';
import { TableProvider, useTableContext } from '@/shared/table/table-context';
import Table_Footer from '@/shared/table/table-footer';
import Table_Header from '@/shared/table/table-header';
import { filterDataForFetch } from '@/shared/table/table-helpers';
import { useTableConfig } from '@/shared/table/tableConfigContext';

import { S_Button } from '@/ui';
import Modal from '@/ui/dialog';

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

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BudceTableData[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const [isInfinite, setIsInfinite] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [catalogs, setCatalogs] = useState([]);

    const [showCatalogView, setShowCatalogView] = useState(false);

    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>([]);

    const columns: CustomMRTColumn<BudceTableData>[] = [
        {
            accessorKey: 'Number',
            header: 'Unikal nömrə',
            filterVariant: 'text',
            placeholder: 'Unikal nömrə',
            enableSummary: true,
        },
        // {
        //     accessorKey: 'Organization.ShortName',
        //     header: 'Short Name',
        //     filterVariant: 'text',
        //     placeholder: 'Short Name',
        //     enableSummary: true,
        // },
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
                return (
                    <div
                        data-row-actions
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        <TableActions
                            edit={<PencilIcon width={14} height={14} />}
                            delete={<TrashIcon width={14} height={14} />}
                            onClickEdit={() => console.log('Edit', row.original)}
                            onClickDelete={() => console.log('Delete', row.original)}
                        />
                    </div>
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

    const [filters, setFilters] = useState<FilterConfig[]>(generateFiltersFromColumns(filterColumns));

    const allowedKeys = useMemo(
        () =>
            columns
                .filter((c) => typeof c.accessorKey === 'string' && c.accessorKey && c.accessorKey !== 'actions')
                .map((c) => c.accessorKey as string),
        [columns]
    );

    const fetchData = (isLoadMore = false) => {
        if (loading) return;
        setLoading(true);

        console.log('budayammm');
        const raw: any = filterDataForFetch();

        const nextPage = isLoadMore ? currentPage + 1 : 1;

        const queryParams = isInfinite
            ? buildQueryParamsFromTableRequest(raw, {
                  isInfiniteScroll: true,
                  page: nextPage,
              })
            : buildQueryParamsFromTableRequest(raw);

        const allowed = new Set(
            columns
                .filter(
                    (c) =>
                        typeof c.accessorKey === 'string' && c.accessorKey.trim() !== '' && c.accessorKey !== 'actions'
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
                } else {
                    setData(res.items);
                }
                setTotalItems(res.totalCount);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        catalogService
            .getCatalogsByTableId('reports')
            .then((res: any) => {
                console.log(res, 'response');
                setCatalogs(res ?? []);
            })
            .catch((err: any) => {
                console.error('Fetch error:', err);
            });
    }, [isOpen]);

    // seçilən kataloqu tətbiq et
    const applyCatalog = (item: any) => {
        if (!item) return;
        setSelected(item);
        setShowCatalogView(true);
        setIsOpen(false);

        // URL-ə yaz
        const params = new URLSearchParams(window.location.search);
        params.set('path', item.value);
        navigate(`?${params.toString()}`);
    };

    useEffect(() => {
        const generatedFilters = generateFiltersFromColumns(filterColumns);
        setFilters(generatedFilters);
    }, []);

    useEffect(() => {
        if (Object.keys(columnVisibility).length > 0) {
            fetchData();
        }
    }, [columnVisibility, location.search, isInfinite]);

    const isFilterApplied = filterDataState.filter && filterDataState.filter.length > 0;

    return (
        <>
            <Table_Header
                columns={columns}
                data={data}
                title={'Demo'}
                onToggleFilter={onToggleCollapse}
                onToggleConfig={onToggleConfigCollapse}
                // onRefresh={() => fetchData(false, 'header-refresh')}
                page="report"
                onClickCustomExport={() => {}}
                actions={['create', 'exportFile']}
                table_key="customer_table"
                notification={isFilterApplied}
                onClickRightBtn={() => {}}
                onClickShowAsFolder={() => setIsOpen(true)}
                isCatalogView={showCatalogView}
            />

            <div className={styles.wrapper}>
                {showCatalogView ? (
                    <div className={styles.tableArea}>
                        {/* <Folder
                            items={items}
                            setItems={setItems}
                            currentPath={currentPath}
                            setCurrentPath={setCurrentPath}
                            onItemsChange={handleItemsChange}
                            className={styles.folder}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        /> */}
                    </div>
                ) : (
                    <>
                        <div
                            className={styles.tableArea}
                            style={{
                                marginRight: (isFilterCollapsed ? 0 : 320) + (isConfigCollapsed ? 0 : 320) + 'px',
                            }}
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
                                    fetchh={fetchData.bind(null, true)}
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
                            />
                        </div>

                        <div
                            className={[
                                styles.panel,
                                styles.filterPanel,
                                isFilterCollapsed ? styles.collapsed : styles.expanded,
                            ].join(' ')}
                            {...inertProps(isFilterCollapsed)}
                        >
                            <FilterPanel
                                filters={filters}
                                storageKey="customer_table"
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
                            {...inertProps(isConfigCollapsed)}
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
                    </>
                )}
            </div>

            <Modal
                title="Kataloq seçin"
                open={isOpen}
                size="sm"
                onOpenChange={setIsOpen}
                footer={
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <S_Button
                            tabIndex={1}
                            type="button"
                            variant="primary"
                            color="secondary"
                            onClick={() => setIsOpen(false)}
                        >
                            Ləğv et
                        </S_Button>
                        <S_Button
                            tabIndex={2}
                            type="button"
                            variant="primary"
                            color="primary"
                            onClick={() => applyCatalog(selected)}
                        >
                            Təsdiqlə
                        </S_Button>
                    </div>
                }
            >
                <Catalog
                    items={catalogs.map((i: any) => ({
                        label: i.catalogId,
                        value: i.catalogPath,
                    }))}
                    getLabel={(i: any) => i?.label}
                    getRowId={(i: any) => String(i?.value)}
                    value={selected ? [selected] : []}
                    onChange={(sel) => {
                        const picked = Array.isArray(sel) ? sel[0] : sel;
                        if (picked) {
                            setSelected(picked);
                        }
                    }}
                    multiple={false}
                    enableModal={false}
                    sizePreset="md-lg"
                    totalItemCount={catalogs.length}
                    isLoading={loading}
                    showMoreColumns={[]}
                    searchItems
                />
            </Modal>
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
