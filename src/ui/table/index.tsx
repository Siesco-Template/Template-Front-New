import { useEffect, useState } from 'react';

import { DotActive, DotDeactive, DotSolidIcon, UserIcon3 } from '@/shared/icons';

import styles from './table.module.css';

interface Row {
    id?: string;
    company: string;
    voen: string;
    address: string;
    responsible: string;
    position: string;
    phone: string;
    email: string;
    logo: any;
    area: string;
    terminalID: number;
    workingHours: string;
    region: string;
    brand: string;
    collector: string;
    leadCollector: string;
    terminalCount: number;
    cashCount: number;
    amount: number;
    status: string;
    assignment: string;
}

interface Column {
    key: string;
    label: string;
}

interface TableProps {
    data: any[];
    columns: Column[];
    onContextMenu?: (id: string | null) => void;
    loading: boolean;
    currentPage: number;
    pageSize: number;
}

const Table = ({ data: initialData = [], columns, onContextMenu, loading, currentPage, pageSize }: TableProps) => {
    const [tableData, setTableData] = useState<Row[]>([]);
    useEffect(() => {
        if (!initialData || initialData.length === 0) {
            setTableData([]);
            return;
        }

        const formattedData = initialData?.map((item) => ({
            id: item?.id || '',
            company: item.name || '',
            logo: item.logo || '',
            voen: item.voen || '',
            address: item.address || '',
            responsible: item.responsible || '',
            position: item.responsiblePersonPosition || '',
            phone: item.responsiblePersonPhone || '',
            email: item.email || '',
            area: item.area || '',
            terminalID: item.terminalID || '',
            workingHours: item.workingHours || '',
            region: item.region || '',
            brand: item.brand || '',
            collector: item.collector || '',
            leadCollector: item.leadCollector || '',
            terminalCount: item.terminalCount || '',
            cashCount: item.cashCount || '',
            amount: item.amount || '',
            status: item.status || '',
            assignment: item.assignment || '',
        }));

        setTableData(formattedData);
    }, [initialData]);

    const cleanText = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };

    return (
        <div className={styles.container}>
            {loading ? (
                <table className={styles.customTable}>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <tr key={index}>
                                {columns.map((col) => (
                                    <td key={col.key}>{/* <Skeleton height={40} /> */}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table className={styles.customTable}>
                    <thead>
                        <tr>
                            <th></th>
                            {columns.map((col) => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1}>info</td>
                            </tr>
                        ) : (
                            tableData.map((row, index) => (
                                <tr
                                    key={row.id || index}
                                    onDoubleClick={() => onContextMenu && onContextMenu(row.id as string)}
                                >
                                    <td>
                                        <button onClick={() => onContextMenu && onContextMenu(row.id as string)}>
                                            <DotSolidIcon color="#28303F" />
                                        </button>
                                    </td>
                                    {columns.map((col) => (
                                        <td key={col.key} className={col.key === 'address' ? styles.blueText : ''}>
                                            {col.key === 'id' ? (
                                                <span>{index + 1 + (currentPage - 1) * pageSize}</span>
                                            ) : col.key === 'status' ? (
                                                <span className={styles.dot}>
                                                    {row.status === 'Aktiv' ? <DotActive /> : <DotDeactive />}
                                                    {row.status}
                                                </span>
                                            ) : col.key === 'company' ? (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {row.logo && (
                                                        <img
                                                            src={row.logo}
                                                            alt={row.company}
                                                            width="20px"
                                                            height="10px"
                                                            style={{ objectFit: 'contain', marginRight: '3px' }}
                                                        />
                                                    )}
                                                    <span>{row.company}</span>
                                                </div>
                                            ) : col.key === 'collector' || col.key === 'leadCollector' ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <div className={styles.user_icon}>
                                                        <UserIcon3 />
                                                    </div>
                                                    <span>{cleanText(row[col.key as keyof Row] ?? '')}</span>
                                                </div>
                                            ) : (
                                                <span>{cleanText(row[col.key as keyof Row] ?? '')}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Table;
