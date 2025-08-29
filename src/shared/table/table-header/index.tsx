import React, { useEffect, useMemo, useRef, useState } from 'react';

import { PermissionGuard } from '@/modules/permission/PermissionGuard';

import { cls } from '@/shared/utils';

import { S_Button } from '@/ui';

import ExportColumnModal from '../exportColumnModal/exportColumnModal';
import {
    DownIcon,
    ExcelIconImport,
    FilterIcon,
    FilterIconn,
    NewItemIcon,
    QuestionIcon,
    RefreshIcon,
    XlsIcon,
} from '../icons';
import { TableVisibilityChangeMenu } from '../table-visibility-change-menu';
import styles from './style.module.css';

interface TableHeaderProps {
    onToggleFilter?: () => void;
    onToggleConfig?: () => void;
    columns: { accessorKey?: string; header: string }[];
    data: any[];
    onClickRightBtn?: () => void;
    title: string;
    onClickCancelBtn?: () => void;
    onClickSaveBtn?: () => void;
    onClickSaveandApplyBtn?: () => void;
    onRefresh?: () => void;
    importFromExcel?: () => void;
    page?: string;
    actions?: string[];
    onClickExport?: () => void;
    onClickCustomExport?: () => void;
    tableVisibiltyColumn?: boolean;
    table_key?: string;
    notification?: boolean;
    headerClassName?: string;
}

const Table_Header: React.FC<TableHeaderProps> = ({
    onToggleFilter,
    onToggleConfig,
    data,
    columns,
    onClickRightBtn,
    title,
    onClickCancelBtn,
    onClickSaveBtn,
    onClickSaveandApplyBtn,
    onRefresh,
    importFromExcel,
    onClickCustomExport,
    onClickExport,
    table_key,
    page,
    actions,
    notification,
    tableVisibiltyColumn = true,
    headerClassName,
}) => {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderTitle = (text: string) => {
        const [prefix, suffix] = text.split('№');
        if (!suffix) return text;
        return (
            <>
                {prefix}
                <span style={{ fontFamily: '"Segoe UI", "Noto Sans", Arial, sans-serif' }}>№</span>
                {suffix}
            </>
        );
    };

    return (
        <section className={cls(styles.table_header, headerClassName)}>
            <div className={styles.table_header_text}>
                <h1>{renderTitle(title)}</h1>
            </div>
            <div className={styles.table_header_btn}>
                <S_Button variant="primary" color="secondary" aria-label="Faq">
                    <QuestionIcon width={14} height={14} color="hsl(var(--clr-primary-900))" />
                </S_Button>
                {tableVisibiltyColumn && <TableVisibilityChangeMenu table_key={table_key} />}
                <S_Button variant="primary" color="secondary" aria-label="Yenilə" onClick={onRefresh}>
                    <RefreshIcon width={14} height={14} color="hsl(var(--clr-primary-900))" />
                </S_Button>
                {onToggleFilter && (
                    <S_Button
                        variant="primary"
                        color="secondary"
                        aria-label="Filter"
                        onClick={onToggleFilter}
                        notification={notification}
                    >
                        <FilterIcon width={14} height={14} color="hsl(var(--clr-primary-900))" />
                    </S_Button>
                )}

                {onToggleConfig && (
                    <S_Button variant="primary" color="secondary" aria-label="Konfiqurasiya" onClick={onToggleConfig}>
                        <FilterIconn width={14} height={14} color="hsl(var(--clr-primary-900))" />
                    </S_Button>
                )}

                <div className={styles.downloadButtonGroup} ref={dropdownRef}>
                    <button
                        className={styles.downloadMain}
                        onClick={() => {
                            setOpen(false);
                            onClickExport?.();
                        }}
                    >
                        <XlsIcon width={14} height={14} color="hsl(var(--clr-primary-900))" /> Endir
                    </button>

                    <button
                        className={styles.downloadArrow}
                        aria-haspopup="menu"
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                    >
                        <DownIcon width={14} height={14} color="hsl(var(--clr-primary-900))" />
                    </button>

                    {open && (
                        <div className={styles.dropdownMenu}>
                            <button
                                className={styles.dropdownItem}
                                onClick={() => {
                                    setOpen(false);
                                    onClickExport?.();
                                }}
                            >
                                Endir
                            </button>
                            <button
                                className={styles.dropdownItem}
                                onClick={() => {
                                    setOpen(false);
                                    onClickCustomExport?.();
                                }}
                            >
                                Özəlləşdir
                            </button>
                        </div>
                    )}
                </div>

                {importFromExcel ? (
                    page && actions?.includes('uploadFile') ? (
                        <PermissionGuard permissionKey={`${page}/uploadFile`}>
                            <S_Button variant="primary" color="secondary" onClick={importFromExcel}>
                                <ExcelIconImport width={14} height={14} color="hsl(var(--clr-primary-900))" /> Excel
                                şablondan yüklə
                            </S_Button>
                        </PermissionGuard>
                    ) : (
                        <S_Button variant="primary" color="secondary" onClick={importFromExcel}>
                            <ExcelIconImport width={14} height={14} color="hsl(var(--clr-primary-900))" /> Excel
                            şablondan yüklə
                        </S_Button>
                    )
                ) : null}

                <S_Button variant="primary" color="secondary">
                    Qovluq kimi göstər
                </S_Button>
                {onClickCancelBtn && (
                    <S_Button variant="primary" color="secondary" onClick={onClickCancelBtn}>
                        Ləğv et
                    </S_Button>
                )}
                {onClickSaveBtn && (
                    <S_Button variant="primary" color="secondary" onClick={onClickSaveBtn}>
                        Yadda saxla
                    </S_Button>
                )}
                {onClickRightBtn ? (
                    page && actions?.includes('create') ? (
                        <PermissionGuard permissionKey={`${page}/create`}>
                            <S_Button variant="primary" color="secondary" onClick={onClickRightBtn}>
                                <NewItemIcon color="#fff" /> Yeni
                            </S_Button>
                        </PermissionGuard>
                    ) : (
                        <S_Button variant="primary" color="secondary" onClick={onClickRightBtn}>
                            <NewItemIcon color="#fff" /> Yeni
                        </S_Button>
                    )
                ) : null}
                {onClickSaveandApplyBtn && (
                    <S_Button variant="primary" color="secondary" onClick={onClickSaveandApplyBtn}>
                        Yadda saxla və təsdiqlə
                    </S_Button>
                )}
            </div>
            <ExportColumnModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                columns={columns.filter((c) => !!c.accessorKey) as { accessorKey: string; header: string }[]}
                data={data}
            />
        </section>
    );
};

export default Table_Header;
