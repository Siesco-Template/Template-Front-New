import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { permissionService } from '@/services/permission/permission.service';
import { ActionOption, PageActions, Permission, UserPermissions } from '@/services/permission/permission.service.types';

import { S_Checkbox } from '@/ui';

import styles from './style.module.css';

type Props = {
    tableData: UserPermissions[];
    setTableData: (data: UserPermissions[]) => void;
    currentPage: number;
    itemPerPage: number;
};

function PermissionTable({ tableData, setTableData, currentPage, itemPerPage }: Props) {
    const [pagesActionsData, setPagesActionsData] = useState<PageActions[]>([]);

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
    const [tooltipText, setTooltipText] = useState('');

    const handleMouseEnter = (e: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>, name: string) => {
        const timeout = setTimeout(() => {
            setTooltipText(name);
            setShowTooltip(true);
        }, 500);
        setTooltipTimeout(timeout);
    };

    const handleMouseLeave = () => {
        setTooltipText('');
        setShowTooltip(false);
        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
        }
    };

    useEffect(() => {
        return () => {
            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
            }
        };
    }, [tooltipTimeout]);

    useEffect(() => {
        const fetchTable = async () => {
            try {
                const data = await permissionService.getAllPagesAndActions();

                if (!data) {
                    toast.error('İcazə səhifələri və əməliyyatları alınmadı!');
                    return;
                }
                setPagesActionsData(data);
            } catch (error) {
                // @ts-expect-error
                toast.error(error?.data?.message || 'İcazə səhifələri və əməliyyatları alınmadı!');
                console.error('Error fetching table data:', error);
            }
        };

        fetchTable();
    }, []);

    const updateUserPermissions = async (
        userId: string,
        permissions: Permission[],
        newRows: { userId: string; fullName: string; permissions: Permission[] }[]
    ) => {
        try {
            await permissionService.updateUserPermissions([
                {
                    userId,
                    permissions: permissions.map((permission) => ({
                        key: permission.pageKey,
                        actions: permission.actionKeys,
                    })),
                },
            ]);
            toast.success('İcazələr uğurla yeniləndi!');
            setTableData(newRows);
        } catch (error) {
            console.error('Error updating user permissions:', error);
        }
    };

    const handleCheckboxChange = async (
        row: { userId: string; fullName: string; permissions: Permission[] },
        pageKey: string,
        actionKey: string,
        newValue: boolean
    ) => {
        const newRows = tableData.map((prevRow) => {
            if (prevRow.userId === row.userId) {
                const updatedPermissions = [...prevRow.permissions];
                const existingPermissionIndex = updatedPermissions.findIndex((perm) => perm.pageKey === pageKey);

                if (existingPermissionIndex > -1) {
                    const existingPermission = updatedPermissions[existingPermissionIndex];
                    if (newValue) {
                        // Add action key if it doesn't exist
                        if (!existingPermission.actionKeys.includes(actionKey)) {
                            existingPermission.actionKeys.push(actionKey);
                        }
                    } else {
                        // Remove action key if it exists
                        existingPermission.actionKeys = existingPermission.actionKeys.filter(
                            (key) => key !== actionKey
                        );
                    }
                } else if (newValue) {
                    // Create new permission if it doesn't exist and newValue is true
                    updatedPermissions.push({ pageKey, actionKeys: [actionKey] });
                }

                return { ...prevRow, permissions: updatedPermissions };
            }
            return prevRow;
        });

        const updatedRow = newRows.find((r) => r.userId === row.userId)!;
        await updateUserPermissions(updatedRow.userId, updatedRow?.permissions, newRows);
    };

    if (!pagesActionsData.length || !tableData.length) {
        return null;
    }

    const actions = pagesActionsData.reduce((acc: ActionOption[], item) => {
        item.actions.forEach((action) => {
            acc.push(action);
        });
        return acc;
    }, []);

    return (
        <table className={styles.table}>
            <thead>
                <tr className={styles.thead}>
                    <th rowSpan={2} className={styles.number} style={{ textAlign: 'center' }}>
                        №
                    </th>
                    <th rowSpan={2} className={styles.job} style={{ minWidth: 300 }}>
                        İstifadəçilər
                    </th>

                    {pagesActionsData?.map((item) => (
                        <th
                            key={item.key}
                            colSpan={item.actions.length}
                            onMouseEnter={(e) => handleMouseEnter(e, item.name)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className={styles.cellText}>{item.name}</div>
                            {showTooltip && item.name === tooltipText && (
                                <div className={styles.tooltip}>{tooltipText}</div>
                            )}
                        </th>
                    ))}
                </tr>
                <tr className={styles.subHeader}>
                    {actions.map((action, index) => (
                        <th key={action.key + index} className={styles.actionHeader}>
                            {action.name}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {tableData.map((row, index) => (
                    <tr key={row.userId}>
                        <td className={styles.number} style={{ textAlign: 'center' }}>
                            {(currentPage - 1) * itemPerPage + index + 1}
                        </td>
                        <td className={styles.job}>{row.fullName}</td>

                        {pagesActionsData.map((item) => {
                            return item.actions.map((action) => {
                                const hasPermission = row.permissions.some(
                                    (perm) => perm.pageKey === item.key && perm.actionKeys.includes(action.key)
                                );
                                return (
                                    <td key={action.key + row.userId} className={styles.actionCell}>
                                        <S_Checkbox
                                            checked={hasPermission}
                                            onChange={() =>
                                                handleCheckboxChange(row, item.key, action.key, !hasPermission)
                                            }
                                            size="16"
                                        />
                                    </td>
                                );
                            });
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default PermissionTable;
