import { useEffect, useRef, useState } from 'react';

import { MRT_ColumnDef } from 'material-react-table';

import { Table } from '@/shared/table';
import { TableProvider } from '@/shared/table/table-context';
import Table_Header from '@/shared/table/table-header';

import BlockUserModal from '../../modals/BlockUserModal';
import EditUserModal from '../../modals/EditUserModal';
import ResetUserPasswordModal from '../../modals/ResetUserPasswordModal';
import MoreIcon from '../../shared/icons/more - vertical.svg?react';
import './Admin.css';

type EmanatTableData = {
    terminalId: number;
    brand: string;
    company: string;
    region: string;
    workingHours: string;
    area: string;
    saleDate: string;
    collector: string;
    status: 0 | 1 | 2;
};

interface IUserData {
    id: string;
    appUserRole: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isBlock: boolean;
}

const AdminAuth = () => {
    const [data, setData] = useState<any>([]);
    const [totalCount, setTotalCount] = useState<number>();
    const [loading, setLoading] = useState(false);

    const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [optionID, setOptionID] = useState<string | null>(null);
    const [optionPosition, setOptionPosition] = useState({
        top: 0,
        left: 0,
    });

    const [deleteDataID, setDeleteDataID] = useState<string | null>(null);
    const [editDataID, setEditDataID] = useState<string | null>(null); // "0" -> create
    const [editData, setEditData] = useState<any | null>(null); // null -> create
    const [blockDataID, setBlockDataID] = useState<string | null>(null);
    const [resetPasswordDataID, setResetPasswordDataID] = useState<string | null>(null);

    function handleEditData(id: string) {
        if (id == '0' || !id) {
            setEditData(null);
        } else {
            const { options, appUserRole, ...findData } = data.find((item: IUserData) => item.id == id);
            setEditData({
                ...findData,
                userRole: appUserRole,
            });
        }
        setOptionID(null);
        setEditDataID(id);
    }

    // useEffect(() => {
    //   if (editDataID == "0" || !editDataID) {
    //     setEditData(null)
    //   } else {
    //     const { options, appUserRole, ...findData} = data.find((item:IUserData) => item.id == editDataID)
    //     setEditData({
    //       ...findData,
    //       userRole: appUserRole,
    //     })
    //   }
    // }, [editDataID])

    const handleCloseOptions = () => {
        setOptionID(null);
    };

    const handleClickOptions = (id: string) => {
        if (optionID != id) {
            const button = buttonRefs?.current[id as any];

            if (button) {
                const rect = button.getBoundingClientRect();
                const rect1 = containerRef?.current?.getBoundingClientRect();

                setOptionPosition({
                    top: rect?.top + (rect1?.top || 0) * -1,
                    left: rect?.left + (rect1?.left || 0) * -1,
                });
                setOptionID(id);
            }
        } else {
            setOptionID(null);
        }
    };

    const columns: MRT_ColumnDef<EmanatTableData>[] = [
        {
            accessorKey: 'firstName',
            header: 'İstifadəçinin adı',
            filterVariant: 'text',
        },
        {
            accessorKey: 'lastName',
            header: 'İstifadəçinin soyadı',
            filterVariant: 'text',
        },
        {
            accessorKey: 'phoneNumber',
            header: 'Əlaqə nömrəsi',
            filterVariant: 'text',
        },
        {
            accessorKey: 'appUserRole',
            header: 'İstifadəçinin vəzifəsi',
            filterVariant: 'text',
        },
        {
            accessorKey: 'email',
            header: 'Email',
            filterVariant: 'text',
        },
        {
            accessorKey: 'options',
            header: '#',
            enableSorting: false,
            enableColumnActions: false,
            size: 80,
            enableResizing: false,
            enablePinning: true,
        },
    ];

    async function getAllUsers() {
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/Auth/GetAllUsers?skip=1&take=100`);

            if (!res.ok) {
                throw new Error('Giriş uğursuz oldu');
            }
            const resData = await res.json();
            setData(
                resData.datas.map((data: any) => ({
                    ...data,
                    options: (
                        <button
                            className="mx-auto !px-[6px]"
                            ref={(el) => {
                                buttonRefs.current[data.id] = el;
                            }}
                            onClick={() => handleClickOptions(data.id)}
                        >
                            <MoreIcon />
                        </button>
                    ),
                }))
            );
            setTotalCount(resData.totalCount);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <>
            <TableProvider tableKey="İstifadəçilər_table">
                <Table_Header columns={columns} data={data} onClickRightBtn={() => handleEditData('0')} />
                <Table columns={columns} data={data} isLoading={loading} />
            </TableProvider>

            <div className="admin__users--auth">
                {/* <TableOptions
                    id={optionID}
                    top={Math.floor(optionPosition.top)}
                    left={Math.floor(optionPosition.left)}
                    closeOptions={handleCloseOptions}
                    handleClickEdit={(id) => handleEditData(id)}
                    handleClickDelete={(id) => {
                        setDeleteDataID(id);
                        setOptionID(null);
                    }}
                    handleClickBlock={(id) => {
                        setBlockDataID(id);
                        setOptionID(null);
                    }}
                    handleClickResetPassword={(id) => {
                        setResetPasswordDataID(id);
                        setOptionID(null);
                    }}
                    isBlock={data?.find((item: any) => item?.id == optionID)?.isBlock}
                /> */}

                <BlockUserModal
                    blockDataID={blockDataID}
                    closeBlockModal={() => setBlockDataID(null)}
                    refreshData={() => getAllUsers()}
                    isBlock={data?.find((item: any) => item?.id == blockDataID)?.isBlock}
                />

                <EditUserModal
                    editDataID={editDataID}
                    closeEditModal={() => {
                        setEditData(null);
                        setEditDataID(null);
                    }}
                    refreshData={() => getAllUsers()}
                    userData={editData}
                />

                <ResetUserPasswordModal
                    resetPasswordDataID={resetPasswordDataID}
                    closeModal={() => {
                        setResetPasswordDataID(null);
                    }}
                    refreshData={() => getAllUsers()}
                />
            </div>
        </>
    );
};

export default AdminAuth;
