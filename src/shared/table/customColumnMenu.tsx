import React, { useEffect, useRef } from 'react';

import { MRT_Column, MRT_TableInstance } from 'material-react-table';

import { getUserDiffFromConfig, setNestedValue } from '../utils/queryBuilder';
import { DragIcon, MobileDataIcon, PinIcon } from './icons';
import styles from './table.module.css';
import { useTableConfig } from './tableConfigContext';

interface Props<T extends Record<string, any>> {
    column: MRT_Column<T>;
    table: MRT_TableInstance<T>;
    tableKey: string;
    onClose: () => void;
    position: any;
}

const CustomColumnMenu = <T extends Record<string, any>>({ column, table, tableKey, onClose, position }: Props<T>) => {
    const { updateConfig, defaultConfig, config, saveConfigToApi, updateConfigSync } = useTableConfig();

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const handleToggleFreezeColumn = async () => {
        const keyPath = `columns.${column.id}.config.freeze`;
        const currentFreeze = config?.tables?.[tableKey]?.columns?.[column.id]?.config?.freeze;
        const newValue = !currentFreeze;

        const nextConfig = updateConfigSync(tableKey, keyPath, newValue);
        const diff = getUserDiffFromConfig(defaultConfig, nextConfig);
        await saveConfigToApi(diff);

        onClose();
    };

    const handleSort = (desc: boolean | null) => {
        if (desc === null) {
            table.setSorting([]);
        } else {
            table.setSorting([{ id: column.id, desc }]);
        }

        setTimeout(() => {
            onClose();
        }, 0);
    };

    return (
        <div
            className={styles.customColumnMenu}
            ref={menuRef}
            style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                zIndex: 1000,
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
            }}
        >
            <button onClick={() => handleSort(null)} className={styles.customColumnMenuItem}>
                <MobileDataIcon width={18} height={18} color="#28303F" />
                Sıralamanı sıfırla
            </button>

            <button onClick={() => handleSort(false)} className={styles.customColumnMenuItem}>
                <MobileDataIcon width={18} height={18} color="#28303F" />
                Sırala A–Z
            </button>

            <button onClick={() => handleSort(true)} className={styles.customColumnMenuItem}>
                <MobileDataIcon width={18} height={18} color="#28303F" />
                Sırala Z–A
            </button>

            <button className={styles.customColumnMenuItem} onClick={handleToggleFreezeColumn}>
                <PinIcon width={18} height={18} color="#28303F" />
                {config?.tables?.[tableKey]?.columns?.[column.id]?.config?.freeze ? 'Dondurmanı sil' : 'Dondur'}
            </button>
        </div>
    );
};

export default CustomColumnMenu;
