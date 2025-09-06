import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router';

import { permissionService } from '@/services/permission/permission.service';
import { UserPermissions } from '@/services/permission/permission.service.types';

import S_Pagination from '@/ui/pagination';
import S_Select_Simple from '@/ui/select/select-simple';
import { showToast } from '@/ui/toast/showToast';

import PermissionTable from './PermissionTable';
import styles from './style.module.css';

const ITEMS_PER_PAGE = 10;

const pageSizeOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
];

function PermissionsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [itemPerPage, setItemPerPage] = useState(Number(searchParams.get('take')) || ITEMS_PER_PAGE);

    const [tableData, setTableData] = useState<UserPermissions[]>([]);

    const userId = searchParams.get('userId');

    useEffect(() => {
        const fetchTableRows = async () => {
            try {
                let res = null;

                if (userId) {
                    res = await permissionService.getUserPermissionsById(userId);
                } else {
                    res = await permissionService.getAllUserPermissions({ skip: currentPage - 1, take: itemPerPage });
                }

                if (!res) {
                    showToast({ label: 'Xəta baş verdi, yenidən cəhd edin', type: 'error' });
                    return;
                }

                if ('userId' in res) {
                    setTableData([res]);
                    setTotalCount(1);
                } else if (Array.isArray(res?.datas)) {
                    setTableData(res.datas);
                    setTotalCount(res.totalCount);
                } else {
                    setTableData([]);
                    showToast({ label: 'Xəta baş verdi, yenidən cəhd edin', type: 'error' });
                    return;
                }
            } catch (error: any) {
                if (error.status === 403) {
                    showToast({ label: error?.data?.message || 'Bu səhifəyə giriş icazəniz yoxdur.', type: 'error' });
                    return;
                }
                showToast({ label: error?.data?.message || 'Xəta baş verdi, yenidən cəhd edin', type: 'error' });
            }
        };
        fetchTableRows();
    }, [currentPage, itemPerPage]);

    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                <PermissionTable
                    tableData={tableData}
                    setTableData={setTableData}
                    currentPage={currentPage}
                    itemPerPage={itemPerPage}
                />
            </div>

            {/* {!userId && (
                <div className={styles.paginationContainer}>
                    <div className={styles.paginationControls}>
                        <span>Səhifədə göstər:</span>
                        <S_Select_Simple
                            value={[itemPerPage.toString()]}
                            items={pageSizeOptions}
                            setSelectedItems={(items) => {
                                const newItemsPerPage = parseInt(items[0].value, 10);
                                setItemPerPage(newItemsPerPage);
                                searchParams.set('take', newItemsPerPage.toString());
                                searchParams.set('page', '1');
                                setSearchParams(searchParams.toString());
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className={styles.paginationInfo}>
                        <p>
                            {(currentPage - 1) * itemPerPage + 1}-
                            {currentPage * itemPerPage > totalCount ? totalCount : currentPage * itemPerPage} /{' '}
                            {totalCount}
                        </p>
                        {Math.ceil(totalCount / itemPerPage) > 1 && (
                            <S_Pagination
                                take={itemPerPage}
                                currentPage={currentPage}
                                setCurrentPage={(page) => {
                                    searchParams.set('page', page.toString());
                                    setSearchParams(searchParams.toString());
                                    setCurrentPage(page);
                                }}
                                totalCount={totalCount}
                                showPageNumbers={false}
                                noPadding
                            />
                        )}
                    </div>
                </div>
            )} */}
        </div>
    );
}

export default PermissionsPage;
