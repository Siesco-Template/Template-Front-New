import React, { useEffect, useRef } from 'react';

import { getNestedValue } from '@/lib/queryBuilder';
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
        // column.id → path array
        const parts = column.id.split('.');
        const keyPath = `columns.${parts.join('.')}.config.freeze`;

        // mövcud freeze dəyərini oxu
        let currentFreeze: any = config?.tables?.[tableKey];
        for (const p of ['columns', ...parts, 'config', 'freeze']) {
            currentFreeze = currentFreeze?.[p];
        }

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
                borderRadius: '8px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
            }}
        >
            <button onClick={() => handleSort(null)} className={styles.customColumnMenuItem}>
                <MobileDataIcon width={18} height={18} color="var(--content-tertiary)" />
                Sıralamanı sıfırla
            </button>

            <button onClick={() => handleSort(false)} className={styles.customColumnMenuItem}>
                <MobileDataIcon width={18} height={18} color="var(--content-tertiary)" />
                Sırala A–Z
            </button>

            <button onClick={() => handleSort(true)} className={styles.customColumnMenuItem}>
                <MobileDataIcon width={18} height={18} color="var(--content-tertiary)" />
                Sırala Z–A
            </button>

            <button className={styles.customColumnMenuItem} onClick={handleToggleFreezeColumn}>
                <PinIcon width={18} height={18} color="var(--content-tertiary)" />
                {getNestedValue(config?.tables?.[tableKey]?.columns, `${column.id}.config.freeze`)
                    ? 'Sabitləməni sil'
                    : 'Sabitlə'}
            </button>
        </div>
    );
};

export default CustomColumnMenu;
