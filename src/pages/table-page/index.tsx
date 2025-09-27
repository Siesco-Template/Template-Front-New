import { Tooltip } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { buildQueryParamsFromTableRequest } from '@/lib/queryBuilder';
import { inertProps } from '@/lib/useInert';
import dayjs from 'dayjs';

import { CreateReportPayload, reportService } from '@/services/reports/reports.service';

import { Folder } from '@/modules/folder';
import { folderService } from '@/modules/folder/services/folder.service';
import { FolderItem, ViewMode } from '@/modules/folder/types';

import Catalog from '@/shared/catalog';
import { mockCatalogs } from '@/shared/catalog/mockCatalogs';
import ConfigPanel from '@/shared/config';
import FilterPanel from '@/shared/filter/FilterPanel';
import { FilterConfig } from '@/shared/filter/types';
import { generateFiltersFromColumns } from '@/shared/filter/utils/generateColumns';
import { PencilIcon, TrashIcon } from '@/shared/icons';
import { CustomMRTColumn, Table } from '@/shared/table';
import TableActions from '@/shared/table/table-actions';
import { TableProvider, useTableContext } from '@/shared/table/table-context';
import Table_Footer from '@/shared/table/table-footer';
import Table_Header from '@/shared/table/table-header';
import { filterDataForFetch } from '@/shared/table/table-helpers';

import { S_Button, S_Input, S_Tooltip } from '@/ui';
import CustomDatePicker from '@/ui/datepicker/date-picker';
import Modal from '@/ui/dialog';
import { showToast } from '@/ui/toast/showToast';

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
    [ReportStatus.Compiled]: { bg: 'var(--background-info-subtle, #D6E6F4)', text: 'var(--content-link, #3183C8)' },
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
    // table context-dən lazim olan stateler (columnların görünürlüyü və filter dataları)
    const { columnVisibility, filterDataState } = useTableContext();

    // catalog modal ucun stateler
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);

    // detail modal ucun state
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailRow, setDetailRow] = useState<any | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // yeni report ucun modal stateler
    const [newReportOpen, setNewReportOpen] = useState(false);
    const [isNewReportLoading, setIsNewReportLoading] = useState(false);

    // report silmek ucun modal stateler
    const [reportDeleteOpen, setReportDeleteOpen] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<any | null>(null);

    const navigate = useNavigate();

    // main table ucun lazim olan stateler
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BudceTableData[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const [defaultFilterReady, setDefaultFilterReady] = useState(false);

    // infinite scroll ucun lazim olan stateler
    const [isInfinite, setIsInfinite] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // infinite scroll ucun sentinel
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // folder view ucun state-lər
    const [showCatalogView, setShowCatalogView] = useState(false);
    const catalogs = mockCatalogs['reports'];

    // eger table da row secmek lazimdirsa bu stateler istifade olunacaq
    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>([]);

    // filter panelin tetbiq etdiyi filtrlere esasen table-i yeniden fetch edir
    const [isResetting, setIsResetting] = useState(false);

    // main table ucun mutleq gonderilmeli sutunlar
    const columns: CustomMRTColumn<BudceTableData>[] = [
        {
            accessorKey: 'Number',
            header: 'Unikal nömrə',
            filterVariant: 'text',
            placeholder: 'Unikal nömrə',
            enableSummary: true,
        },
        {
            accessorKey: 'Organization.Id',
            header: 'Təşkilat',
            filterVariant: 'select',
            placeholder: 'Təşkilat',
            enableSummary: true,
            endpoint: '/GetCatalog',
            accessorFn: (row: any) => row.Organization?.Name,
            Cell: ({ cell }) => {
                const rawValue = cell.getValue();
                const value = rawValue != null ? String(rawValue) : '';
                return (
                    <Tooltip title={value} placement="right">
                        <span
                            style={{
                                display: 'inline-block',
                                maxWidth: 500,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                verticalAlign: 'middle',
                            }}
                        >
                            {value}
                        </span>
                    </Tooltip>
                );
            },
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
                console.log(row, 'rowwwwww');
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
                            onClickDelete={() => {
                                setSelectedReport(row.original);
                                setReportDeleteOpen(true);
                            }}
                        />
                    </div>
                );
            },
        },
    ];

    // filter panele mutleq gonderilmeli sutunlar
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
            accessorKey: 'Organization.Id',
            header: 'Təşkilat',
            filterVariant: 'select',
            endpoint: '/GetCatalog',
            columns: 'Name',
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
            accessorKey: 'CompileDate',
            header: 'Tərtib tarixi',
            filterVariant: 'date-interval',
        },
    ];

    const [filters, setFilters] = useState<FilterConfig[]>(generateFiltersFromColumns(filterColumns));

    // main table ucun fetch funksiyasi
    const fetchData = (isLoadMore = false, options?: { initialFilter?: boolean }) => {
        if (loading) return;
        setLoading(true);

        console.log('budayammm');
        const raw: any = filterDataForFetch();
        const nextPage = isLoadMore ? currentPage + 1 : 1;
        console.log(raw, 'raw', filterDataState, 'filterDataState');

        const queryParams = buildQueryParamsFromTableRequest(raw, {
            isInfiniteScroll: isInfinite,
            page: nextPage,
            initialFilter: options?.initialFilter ?? false,
        });

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

        const expandedColumns = visibleColumns.flatMap((col) => {
            if (col === 'Organization.Id') return ['Organization.Id', 'Organization.Name'];
            return col;
        });

        queryParams.Columns =
            expandedColumns.length > 0
                ? [...new Set([...expandedColumns, ...mandatoryHidden])].join(',')
                : mandatoryHidden.join(',');

        reportService
            .getAllReports('reports', queryParams)
            .then((res: any) => {
                if (isInfinite) {
                    if (isLoadMore) {
                        setData((prev) => [
                            ...prev,
                            ...res.items.map((item: any) => ({
                                ...item,
                                Organization: {
                                    Name: item.Name,
                                },
                            })),
                        ]);
                        setCurrentPage(nextPage);
                    } else {
                        setData(
                            res.items.map((item: any) => ({
                                ...item,
                                Organization: {
                                    Name: item.Name,
                                },
                            }))
                        );
                        setCurrentPage(1);
                    }
                } else {
                    setData(
                        res.items.map((item: any) => ({
                            ...item,
                            Organization: {
                                Name: item.Name,
                            },
                        }))
                    );
                }
                setTotalItems(res.totalCount);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    // ilk mount zamani hersey okeydise fetch edir
    useEffect(() => {
        const hasFilters =
            filterDataState && Array.isArray(filterDataState.filter) && filterDataState.filter.length > 0;

        const shouldFetch =
            Object.keys(columnVisibility).length > 0 && !isResetting && (defaultFilterReady || hasFilters);

        if (shouldFetch) {
            fetchData();
        }
    }, [defaultFilterReady, columnVisibility, isInfinite, filterDataState, isResetting]);

    // hansisa bir filter apply olunsa bunu table headerde bildirim kimi gosteririk
    const isFilterApplied = filterDataState.filter && filterDataState.filter.length > 0;

    // folder view ucun lazim olan funksionalliq ve stateler
    const [searchParams] = useSearchParams();
    const [items, setItems] = useState<FolderItem[]>([]);
    const [currentPath, setCurrentPath] = useState(searchParams.get('path') || '/Reports');
    const [viewMode, setViewMode] = useState<ViewMode>('medium');

    // seçilən kataloqu tetbiq edir, table folder inteqrasiyasi ucundu
    const applyCatalog = (item: any) => {
        if (!item) return;
        setSelected(item);
        setShowCatalogView(true);
        setIsOpen(false);

        const params = new URLSearchParams(window.location.search);
        params.set('path', item.value);
        console.log(item.value, 'item');
        navigate(`?${params.toString()}`, { replace: true });
    };

    // uygun path-ə uyğun olaraq folder və faylları gətirir
    const fetchItems = useCallback(
        async (path: string) => {
            try {
                const data = await folderService.getFoldersAndFiles(path);
                if (!data) {
                    return [];
                }

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
            } catch (error: any) {
                // showToast({ label: error?.data?.message || 'Xəta baş verdi, yenidən cəhd edin', type: 'error' });
                return [];
            }
        },
        [currentPath]
    );

    const updateItemChildren = useCallback(
        (items: FolderItem[], targetPath: string, isAppend: boolean, newChildren?: FolderItem[]): FolderItem[] => {
            return items.map((item) => {
                if (item.path === targetPath) {
                    if (!isAppend) {
                        return {
                            ...item,
                            children: [...(item.children || [])],
                            isExpanded: !item.isExpanded,
                        };
                    }
                    return {
                        ...item,
                        children: newChildren,
                        isExpanded: true,
                    };
                } else if (item.children && item.children.length > 0) {
                    return {
                        ...item,
                        children: updateItemChildren(item.children, targetPath, isAppend, newChildren),
                    };
                }
                return item;
            });
        },
        []
    );

    const handleItemsChange = useCallback(
        async (path: string, isAppend: boolean = false) => {
            if (viewMode === 'tree' && path !== currentPath) {
                if (!isAppend) {
                    setItems((prevItems) => {
                        const updatedItems = updateItemChildren(prevItems, path, isAppend);
                        return updatedItems;
                    });
                    return;
                }
                const newItems = await fetchItems(path);

                setItems((prevItems) => {
                    const updatedItems = updateItemChildren(prevItems, path, isAppend, newItems);
                    return updatedItems;
                });
            } else {
                const newItems = await fetchItems(path);
                setItems(newItems);
            }
        },
        [fetchItems, updateItemChildren, viewMode]
    );

    const pathParam = searchParams.get('path');

    useEffect(() => {
        if (!showCatalogView) return;

        if (pathParam && pathParam !== currentPath) {
            setCurrentPath(pathParam);
            handleItemsChange(pathParam);
        } else {
            handleItemsChange(currentPath || '');
        }
    }, [showCatalogView, pathParam, currentPath]);

    // yeni report yaratmaq ucun lazimlilar
    const [formData, setFormData] = useState<any>({
        number: '',
        compileDate: '',
        term: '',
        organizationId: '',
    });

    const [errors, setErrors] = useState({
        number: '',
        compileDate: '',
        term: '',
        organizationId: '',
    });

    const handleChange = (field: keyof CreateReportPayload, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const newErrors: any = {};
        if (!formData.number) newErrors.number = 'Nömrə daxil edilməlidir';
        if (!formData.compileDate) newErrors.compileDate = 'Tərtib tarixi seçilməlidir';
        if (!formData.term) newErrors.term = 'Rüb boş ola bilməz';
        if (!formData.organizationId) newErrors.organizationId = 'Organizasiya seçilməlidir';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({ number: '', compileDate: '', term: '', organizationId: '' });

        try {
            await reportService.createReport(formData);
            showToast({ label: 'Report uğurla yaradıldı', type: 'success' });
            setNewReportOpen(false);
            fetchData(false, { initialFilter: true });
            setFormData({ number: '', compileDate: '', term: '', organizationId: '' });
        } catch (e) {
            showToast({ label: 'Report yaradılarkən xəta baş verdi', type: 'error' });
        }
    };

    const staticOrganizations = [
        {
            Name: 'Maliyyə Nazirliyi',
            Id: '897c751b-1d79-40d1-eff9-08dda8f40f88',
        },
        {
            Name: 'Təhsil Nazirliyi',
            Id: 'fed0e862-33c6-49d5-4af6-08dda9e6656d',
        },
        {
            Name: 'Ədliyyə Nazirliyi',
            Id: 'bc0602b1-564f-44bc-9852-14d6b4e1af76',
        },
        {
            Name: 'Nəqliyyatı İntellektual İdarəetmə Mərkəzi',
            Id: 'dd30bdee-c4d2-4448-83af-2eb43685efbe',
        },
    ];

    console.log(selectedReport, 'detailRow');
    return (
        <>
            <Table_Header
                columns={columns}
                data={data}
                title={'Demo'}
                onToggleFilter={onToggleCollapse}
                onToggleConfig={onToggleConfigCollapse}
                onRefresh={() => fetchData(false)}
                page="report"
                onClickCustomExport={() => {}}
                actions={['create', 'exportFile']}
                table_key="reports"
                notification={isFilterApplied}
                onOpenModal={() => setNewReportOpen(true)}
                onClickShowAsFolder={() => setIsOpen(true)}
                onClickShowAsTable={() => setShowCatalogView(false)}
                isCatalogView={showCatalogView}
            />

            <div className={styles.wrapper}>
                {showCatalogView ? (
                    <div className={styles.tableArea}>
                        <Folder
                            items={items}
                            setItems={setItems}
                            currentPath={currentPath || ''}
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
                                    tableKey="reports"
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
                                    onRowDoubleClick={async (row: any) => {
                                        console.log(row, 'row');
                                        try {
                                            setLoadingDetail(true);
                                            const response = await reportService.getReportById(row.Id);
                                            setDetailRow(response);
                                            setDetailOpen(true);
                                        } catch (err) {
                                            console.error('GetReportById error:', err);
                                        } finally {
                                            setLoadingDetail(false);
                                        }
                                    }}
                                />
                                <div ref={sentinelRef} style={{ height: 1 }} />
                            </div>
                            <Table_Footer
                                totalItems={totalItems}
                                table_key="reports"
                                isInfiniteScroll={isInfinite}
                                onInfiniteChange={setIsInfinite}
                                filtersReady={defaultFilterReady}
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
                                isCollapsed={isFilterCollapsed}
                                onToggleCollapse={onToggleCollapse}
                                table_key="reports"
                                onReady={() => setDefaultFilterReady(true)}
                                onResetFilters={() => {
                                    setIsResetting(true);
                                    fetchData(false, { initialFilter: true });
                                    setIsResetting(false);
                                }}
                                isResetting={isResetting}
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
                                table_key="reports"
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
                    items={catalogs?.map((i) => ({
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
                    totalItemCount={catalogs?.length}
                    isLoading={loading}
                    showMoreColumns={[]}
                    searchItems
                />
            </Modal>

            <Modal
                title="Report Details"
                open={detailOpen}
                size="xs"
                onOpenChange={setDetailOpen}
                footer={
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <S_Button type="button" variant="primary" color="primary" onClick={() => setDetailOpen(false)}>
                            Ok
                        </S_Button>
                    </div>
                }
            >
                {loadingDetail ? (
                    <p>Loading...</p>
                ) : detailRow ? (
                    <div>
                        <p>
                            <strong>Report nömrəsi:</strong> {''} {detailRow.number}
                        </p>
                        <p>
                            <strong>Tərtib tarixi:</strong> {''}
                            {detailRow.compileDate ? dayjs(detailRow.compileDate).format('DD.MM.YYYY') : '-'}
                        </p>
                        <p>
                            <strong>Rüb:</strong> {''}
                            {detailRow.term}
                        </p>
                        <p>
                            <strong>Rüb:</strong>
                            {''} {detailRow.organizationName}
                        </p>
                    </div>
                ) : (
                    <p>No data found</p>
                )}
            </Modal>

            <Modal
                title="Reportun silinməsi"
                open={reportDeleteOpen}
                size="xs"
                onOpenChange={setReportDeleteOpen}
                footer={
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <S_Button
                            type="button"
                            variant="primary"
                            color="secondary"
                            onClick={() => setReportDeleteOpen(false)}
                        >
                            Ləğv et
                        </S_Button>
                        <S_Button
                            type="button"
                            variant="primary"
                            color="primary"
                            onClick={async () => {
                                if (!selectedReport) return;
                                try {
                                    await reportService.deleteReport(selectedReport.Id);
                                    console.log(selectedReport, 'report');
                                    setData((prev: any[]) => prev.filter((r) => r.Id !== selectedReport.Id));
                                    showToast({ label: 'Report uğurla silindi', type: 'success' });
                                } catch (err) {
                                    console.error('Report silinərkən xəta baş verdi:', err);
                                    showToast({ label: 'Xəta baş verdi', type: 'error' });
                                } finally {
                                    setReportDeleteOpen(false);
                                    setSelectedReport(null);
                                }
                            }}
                        >
                            Təsdiqlə
                        </S_Button>
                    </div>
                }
            >
                <p>
                    <strong> {selectedReport?.Number}</strong> nömrəli reportu silmək istədiyinizə əminsinizmi?
                    <br />
                </p>
            </Modal>

            <Modal
                title="Yeni report"
                open={newReportOpen}
                size="sm"
                onOpenChange={setNewReportOpen}
                footer={
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <S_Button
                            tabIndex={1}
                            type="button"
                            variant="primary"
                            color="secondary"
                            onClick={() => {
                                setNewReportOpen(false);
                                setFormData({
                                    number: '',
                                    compileDate: '',
                                    term: '',
                                    organizationId: '',
                                });
                                setErrors({ number: '', compileDate: '', term: '', organizationId: '' });
                            }}
                        >
                            Ləğv et
                        </S_Button>
                        <S_Button
                            tabIndex={2}
                            type="button"
                            variant="primary"
                            color="primary"
                            onClick={handleSubmit}
                            isLoading={isNewReportLoading}
                        >
                            Yadda saxla
                        </S_Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <S_Input
                        label="Nömrə"
                        value={formData.number}
                        onChange={(e) => handleChange('number', e.target.value)}
                        placeholder="Unikal nömrə"
                        state={errors.number ? 'error' : undefined}
                        description={errors.number}
                    />
                    <div id="datepicker-container" style={{ width: '100%', height:"auto" }}>
                        <CustomDatePicker
                            label="Tərtib tarixi"
                            value={formData.compileDate ? new Date(formData.compileDate) : null}
                            onChange={(date) => handleChange('compileDate', date?.toISOString() || '')}
                            placement="leftStart"
                            container={() => document.getElementById('datepicker-container')!}
                        />
                    </div>

                    <S_Input
                        label="Rüb"
                        placeholder="Rüb"
                        type="number"
                        min={1}
                        max={4}
                        value={formData.term}
                        onChange={(e) => handleChange('term', Number(e.target.value))}
                        state={errors.term ? 'error' : undefined}
                        description={errors.term}
                    />

                    <Catalog
                        items={staticOrganizations?.map((o) => ({
                            label: o?.Name,
                            value: o?.Id,
                        }))}
                        getLabel={(i) => i.label}
                        getRowId={(i) => i.value}
                        value={
                            formData.organizationId
                                ? [
                                      {
                                          label:
                                              staticOrganizations.find((o) => o.Id === formData.organizationId)?.Name ||
                                              '',
                                          value: formData.organizationId,
                                      },
                                  ]
                                : []
                        }
                        onChange={(sel) => {
                            const picked = Array.isArray(sel) ? sel[0] : sel;
                            if (picked) {
                                handleChange('organizationId', picked.value);
                            }
                        }}
                        multiple={false}
                        enableModal={false}
                        sizePreset="md-lg"
                        label="Organization"
                        totalItemCount={staticOrganizations.length}
                        searchItems
                        selectProps={{
                            state: errors.organizationId ? 'error' : 'default',
                            description: errors.organizationId,
                        }}
                    />
                </div>
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
        <TableProvider tableKey="reports">
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
