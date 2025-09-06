import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

import { buildQueryParamsFromTableRequest } from '@/lib/queryBuilder';

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

    const allowFetchRef = useRef(false);

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);

    const { loadConfigFromApi, config } = useTableConfig();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BudceTableData[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

    const [isInfinite, setIsInfinite] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [filtersReady, setFiltersReady] = useState(false);

    const [catalogs, setCatalogs] = useState([]);

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
            accessorKey: 'Organization.ShortName',
            header: 'Short Name',
            filterVariant: 'text',
            placeholder: 'Short Name',
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

    const [filters, setFilters] = useState<FilterConfig[]>([]);

    useEffect(() => {
        const generated = generateFiltersFromColumns(filterColumns);
        setFilters(generated);
        setFiltersReady(true);
    }, []);

    // console.log(config, 'config in table');

    const fetchData = useCallback(
        (isLoadMore = false, reason: string = 'unknown') => {
            setLoading(true);

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
                            const items = res.items;
                            const newItems = items.map((item: any, index: number) => ({
                                ...item,
                                'Organization.ShortName': item['ShortName'],
                            }));
                            setData((prev) => [...prev, ...newItems]);
                            setCurrentPage(nextPage);
                        } else {
                            const items = res.items;
                            const newItems = items.map((item: any, index: number) => ({
                                ...item,
                                'Organization.ShortName': item['ShortName'],
                            }));
                            setData(newItems);
                            setCurrentPage(1);
                        }
                        console.log('[fetchData] infinite branch');
                    } else {
                        const newItems = res.items.map((item: any, index: number) => ({
                            ...item,
                            // 'Organization.ShortName': item['ShortName'],
                            Organization: {
                                ShortName: item['ShortName'],
                            },
                        }));
                        setData(newItems);
                    }
                    setTotalItems(res.totalCount);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        },
        [loading, isInfinite, currentPage, columnVisibility, location.search]
    );

    const handleLoadMore = useCallback(() => fetchData(true, 'table-loadMore'), [fetchData]);

    const [hashKey, setHashKey] = useState<string>(() => window.location.hash);

    useEffect(() => {
        const onHash = () => setHashKey(window.location.hash);
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    useEffect(() => {
        if (!didMountColVis.current) {
            didMountColVis.current = true;
            return;
        }

        fetchData(false, 'column-visibility-change');
    }, [colVisJson, filtersReady]);

    useEffect(() => {
        if (!allowFetchRef.current) return;
        if (!allowFetchRef.current) return;
        fetchData(false, 'url-change');
    }, [location.search, hashKey]);

    const isFilterApplied = filterDataState.filter && filterDataState.filter.length > 0;

    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>([]);

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

    const [searchParams] = useSearchParams();

    const [showCatalogView, setShowCatalogView] = useState(false);

    // Folder üçün state-lər
    const [items, setItems] = useState<FolderItem[]>([]);
    const [currentPath, setCurrentPath] = useState(searchParams.get('path') || '/Users');
    const [viewMode, setViewMode] = useState<ViewMode>('medium');

    // seçilən kataloqu tətbiq et
    const applyCatalog = (item: any) => {
        if (!item) return;
        setSelected(item);
        setCurrentPath(item.value);
        setShowCatalogView(true);
        setIsOpen(false);

        // URL-ə yaz
        const params = new URLSearchParams(window.location.search);
        params.set('path', item.value);
        navigate(`?${params.toString()}`);
    };

    // Folder data fetch
    const fetchItems = useCallback(async (path: string) => {
        try {
            const data = await folderService.getFoldersAndFiles(path);
            if (!data) return [];

            const itemsList = [
                ...data.folders.map((folder: any) => ({
                    id: crypto.randomUUID(),
                    name: folder.name,
                    type: 'folder' as FolderItem['type'],
                    path: folder.path,
                    icon: folder.icon,
                    permissions: {
                        canView: true,
                        canEdit: true,
                        canDelete: true,
                        canMove: true,
                        canCopy: true,
                        canDownload: true,
                        canComment: true,
                        canChangeIcon: true,
                    },
                    children: [],
                    createDate: folder.createDate,
                })),
                ...data.files.map((file: any) => ({
                    id: file.id,
                    name: file.fileName,
                    type: 'file' as FolderItem['type'],
                    path: path,
                    permissions: {
                        canView: true,
                        canEdit: true,
                        canDelete: true,
                        canMove: true,
                        canCopy: true,
                        canDownload: true,
                        canComment: true,
                        canChangeIcon: true,
                    },
                    createDate: file.createDate,
                })),
            ];
            return itemsList;
        } catch (err) {
            console.error('Fetch error:', err);
            return [];
        }
    }, []);

    const handleItemsChange = useCallback(
        async (path: string) => {
            const newItems = await fetchItems(path);
            setItems(newItems);
        },
        [fetchItems]
    );

    // currentPath dəyişəndə URL-ə yaz və data yüklə
    useEffect(() => {
        if (currentPath !== searchParams.get('path')) {
            const params = new URLSearchParams(window.location.search);
            params.set('path', currentPath);
            navigate(`?${params.toString()}`);
        }
        handleItemsChange(currentPath);
    }, [currentPath]);

    // searchParams dəyişəndə sync et
    useEffect(() => {
        if (searchParams.get('path') !== currentPath) {
            setCurrentPath(searchParams.get('path') || '/Users');
        }
    }, [searchParams]);
    return (
        <>
            <Table_Header
                columns={columns}
                data={data}
                title={'Demo'}
                onToggleFilter={onToggleCollapse}
                onToggleConfig={onToggleConfigCollapse}
                onRefresh={() => fetchData(false, 'header-refresh')}
                page="report"
                onClickCustomExport={handleCustomExport}
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
                        <Folder
                            items={items}
                            setItems={setItems}
                            currentPath={currentPath}
                            setCurrentPath={setCurrentPath}
                            onItemsChange={handleItemsChange}
                            className={styles.folder}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />
                    </div>
                ) : (
                    <>
                        <div
                            className={styles.tableArea}
                            style={{
                                marginRight: (isFilterCollapsed ? 0 : 290) + (isConfigCollapsed ? 0 : 290) + 'px',
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
