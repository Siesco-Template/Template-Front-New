import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { buildQueryParamsFromTableRequest } from '@/lib/queryBuilder';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';

import { IUser } from '@/services/auth/auth.service.types';
import { APP_URLS } from '@/services/config/url.config';
import { userService } from '@/services/user/user.service';

import { usePermission } from '@/modules/permission/PermissionContext';
import { hasPermission } from '@/modules/permission/PermissionGuard';

import ConfigPanel from '@/shared/config';
import { userRoleOptions } from '@/shared/constants/enums';
import { FilterConfig } from '@/shared/filter';
import FilterPanel from '@/shared/filter/FilterPanel';
import { generateFiltersFromColumns } from '@/shared/filter/config/generateColumns';
import { CustomMRTColumn, Table } from '@/shared/table';
import { TableProvider, useTableContext } from '@/shared/table/table-context';
import Table_Footer from '@/shared/table/table-footer';
import Table_Header from '@/shared/table/table-header';
import { FilterTypeEnum, filterDataForFetch } from '@/shared/table/table-helpers';
import { useTableConfig } from '@/shared/table/tableConfigContext';
import TableRowActions from '@/shared/table/tableRowActions';

import { BlockModal } from './BlockModal';
import { DeleteModal } from './DeleteModal';
import { ResetPasswordModal } from './ResetPasswordModal';
import { UserRecordDialog } from './UserRecordModal';
import styles from './style.module.css';

interface TablePageMainProps {
    isFilterCollapsed: boolean;
    onToggleCollapse: () => void;
    isConfigCollapsed: boolean;
    onToggleConfigCollapse: () => void;
}

type FilterItem = {
    id: string;
    value: string;
    type: FilterTypeEnum;
};

const UsersTableContent: React.FC<TablePageMainProps> = ({
    isFilterCollapsed,
    onToggleCollapse,
    isConfigCollapsed,
    onToggleConfigCollapse,
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { permissions } = usePermission();
    const [tableData, setTableData] = useState<IUser[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const { columnVisibility, filterDataState } = useTableContext();
    const { loadConfigFromApi } = useTableConfig();

    useEffect(() => {
        loadConfigFromApi();
    }, []);

    const columns: CustomMRTColumn<IUser>[] = [
        { accessorKey: 'firstName', header: 'Ad', filterVariant: 'text', placeholder: 'Ad ' },
        { accessorKey: 'lastName', header: 'Soyad', filterVariant: 'text', placeholder: 'Soyad ' },

        // { accessorKey: 'PhoneNumber', header: 'Əlaqə nömrəsi', filterVariant: 'text', placeholder: 'Əlaqə nömrəsi' },
        { accessorKey: 'email', header: 'E-mail', filterVariant: 'text', placeholder: 'E-mail' },
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
            Cell: ({ row }) => {
                const onClick = (action: 'edit' | 'delete' | 'block' | 'permissions' | 'resetPassword') => {
                    setSelectedUserId(row.id);
                    if (action === 'edit') setIsEditModalOpen(true);
                    else if (action === 'block') setIsBlockModalOpen(true);
                    else if (action === 'delete') setIsDeleteModalOpen(true);
                    else if (action === 'permissions') navigate(APP_URLS.huquqlar('', { userId: row.id }));
                    else if (action === 'resetPassword') setIsResetPasswordModalOpen(true);
                };
                return (
                    <TableRowActions
                        onDelete={() => onClick('delete')}
                        onBlock={() => onClick('block')}
                        onEdit={() => onClick('edit')}
                        onPermissions={
                            hasPermission(permissions || [], 'permission/getAll')
                                ? () => onClick('permissions')
                                : undefined
                        }
                        onResetPassword={() => onClick('resetPassword')}
                    />
                );
            },
        },
    ];

    const fetchUsers = async () => {
        setIsLoading(true);
        const filterData: any = filterDataForFetch();
        const queryParams: any = buildQueryParamsFromTableRequest(filterData);

        console.log(columnVisibility, 'cc');
        const allowed = new Set(
            columns.map((c) => c.accessorKey).filter((k): k is string => typeof k === 'string' && k.trim() !== '')
        );

        let visibleColumns = Object.entries(columnVisibility)
            .filter(([key, isVisible]) => Boolean(isVisible) && allowed.has(key) && key !== 'actions')
            .map(([key]) => key);

        console.log(visibleColumns, 'v');
        visibleColumns = Array.from(new Set(visibleColumns));

        if (visibleColumns.length > 0) {
            queryParams.columns = visibleColumns.join(',');
        } else {
            delete queryParams.columns;
        }

        try {
            const res = await userService.getAllUsers('appusers', queryParams);
            if (!res) {
                toast.error('Işçilər yüklənmədi. Xahiş edirik yenidən cəhd edin.');
                setTableData([]);
                return;
            }
            setTableData(res?.items || []);
            setTotalCount(res?.totalCount || 0);
        } catch (error) {
            // @ts-expect-error
            if (error?.status === 403) {
                toast.error('Bu səhifəyə giriş icazəniz yoxdur.');
                return;
            }
            // @ts-expect-error
            toast.error(error?.data?.message || 'İşçilər yüklənmədi. Xahiş edirik yenidən cəhd edin.');
            setTableData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (Object.keys(columnVisibility).length > 0) fetchUsers();
    }, [searchParams, columnVisibility]);

    const filterColumns = [
        { accessorKey: 'firstName', header: 'Ad', filterVariant: 'text' },
        { accessorKey: 'lastName', header: 'Soyad', filterVariant: 'text' },
        // { accessorKey: 'phoneNumber', header: 'Əlaqə nömrəsi', filterVariant: 'text' },
        { accessorKey: 'email', header: 'E-mail', filterVariant: 'text' },
    ];

    const [filters, setFilters] = useState<FilterConfig[]>([]);
    useEffect(() => {
        const generated = generateFiltersFromColumns(filterColumns);
        setFilters(generated);
    }, []);

    const handleCreate = async () => {
        setIsCreateModalOpen(false);
        await fetchUsers();
    };
    const handleEdit = async () => {
        setIsEditModalOpen(false);
        setSelectedUserId(null);
        await fetchUsers();
    };
    const handleBlock = async () => {
        setIsBlockModalOpen(false);
        setSelectedUserId(null);
        await fetchUsers();
    };
    const handleDelete = async () => {
        setIsDeleteModalOpen(false);
        setSelectedUserId(null);
        await fetchUsers();
    };
    const handleResetPassword = () => {
        setIsDeleteModalOpen(false);
        setSelectedUserId(null);
    };

    const isFilterApplied = !!(filterDataState.filter && filterDataState.filter.length > 0);

    return (
        <>
            <Table_Header
                columns={columns}
                data={tableData}
                title="İstifadəçilər"
                onToggleFilter={onToggleCollapse}
                onToggleConfig={onToggleConfigCollapse}
                onClickRightBtn={() => setIsCreateModalOpen(true)}
                onRefresh={fetchUsers}
                page="user"
                actions={['create']}
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
                        <Table<IUser>
                            columns={columns}
                            data={tableData}
                            enableColumnResizing={false}
                            enableMultiSelect={false}
                            enableColumnOrdering={false}
                            isLoading={isLoading}
                            isConfigCollapsed={isConfigCollapsed}
                            tableKey="customer_table"
                        />
                    </div>
                    <Table_Footer totalItems={totalCount} table_key="customer_table" />
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
                        onToggleCollapse={onToggleConfigCollapse}
                        modalTableData={tableData}
                        table_key="customer_table"
                        modalTableColumns={columns}
                        isRowSum={false}
                    />
                </div>
            </div>

            <>
                {isCreateModalOpen && (
                    <UserRecordDialog
                        open={isCreateModalOpen}
                        onOpenChange={(open) => setIsCreateModalOpen(open)}
                        onSubmit={handleCreate}
                        mode="create"
                    />
                )}
                {isEditModalOpen && selectedUserId && (
                    <UserRecordDialog
                        open={isEditModalOpen}
                        onOpenChange={(open) => setIsEditModalOpen(open)}
                        onSubmit={handleEdit}
                        selectedUserId={selectedUserId}
                        mode="edit"
                    />
                )}
                {isBlockModalOpen && selectedUserId && (
                    <BlockModal
                        open={isBlockModalOpen}
                        onOpenChange={(open) => setIsBlockModalOpen(open)}
                        onSubmit={handleBlock}
                        selectedUserId={selectedUserId}
                    />
                )}
                {isDeleteModalOpen && selectedUserId && (
                    <DeleteModal
                        open={isDeleteModalOpen}
                        onOpenChange={(open) => setIsDeleteModalOpen(open)}
                        onSubmit={handleDelete}
                        selectedUserId={selectedUserId}
                    />
                )}
                {isResetPasswordModalOpen && selectedUserId && (
                    <ResetPasswordModal
                        open={isResetPasswordModalOpen}
                        onOpenChange={(open) => setIsResetPasswordModalOpen(open)}
                        onSubmit={handleResetPassword}
                        selectedUserId={selectedUserId}
                    />
                )}
            </>
        </>
    );
};

export default function UsersPage() {
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
            <UsersTableContent
                isFilterCollapsed={isFilterCollapsed}
                onToggleCollapse={handleToggleFilterPanel}
                isConfigCollapsed={isConfigCollapsed}
                onToggleConfigCollapse={handleToggleConfigPanel}
            />
        </TableProvider>
    );
}
