import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import toast from 'react-hot-toast';

import { configService } from '@/services/configuration/configuration.service';

import { S_Button } from '@/ui';

import { FloppyDiskIcon, PlusIcon, RedoIcon } from '../icons';
import { useTableConfig } from '../table/tableConfigContext';
import HeaderConfigSection from './basliq';
import { RefreshIcon, TickIcon } from './icons';
import { ConfirmModal } from './modal/confirm/ConfirmModal';
import RowConfigSection from './setir';
import styles from './style.module.css';
import ColumnConfigSection from './sutun';

interface ConfigPanelProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    modalTableData?: any[];
    table_key: string;
    modalTableColumns?: any[];
    isRowSum: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
    isCollapsed,
    modalTableData,
    modalTableColumns,
    table_key,
    isRowSum,
}) => {
    const [openSections, setOpenSections] = React.useState({
        header: false,
        row: false,
        column: false,
    });

    const [pendingTake, setPendingTake] = useState('');

    const { saveConfigToApi, updateConfig, updateConfigSync, config } = useTableConfig();
    const [isSaving, setIsSaving] = React.useState(false);
    const [isResetting, setIsResetting] = React.useState(false);

    const toggleSection = (section: 'header' | 'row' | 'column') => {
        setOpenSections((prev) => {
            const isCurrentlyOpen = prev[section];
            return {
                header: false,
                row: false,
                column: false,
                [section]: !isCurrentlyOpen,
            };
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        const start = Date.now();
        const initialTake = config.tables?.[table_key]?.row?.paginationTakeCount?.toString() ?? '';

        const diff: Record<string, any> = {};
        if (pendingTake !== '' && pendingTake !== initialTake) {
            diff[`tables.${table_key}.row.paginationTakeCount`] = Number(pendingTake);
        }

        try {
            await saveConfigToApi(diff);

            const elapsed = Date.now() - start;
            const delay = Math.max(0, 1000 - elapsed);
            if (delay > 0) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            }

            toast.success('Konfiqurasiya uğurla tətbiq olundu');
        } catch (error) {
            console.error('Config göndərilərkən xəta:', error);
            toast.error('Xəta baş verdi!');
        } finally {
            setIsSaving(false);
        }
    };

    const renderSection = (label: string, key: keyof typeof openSections, content: React.ReactNode) => {
        const isOpen = openSections[key];

        return (
            <>
                <div
                    className={`${styles.sectionHeader} ${isOpen ? styles.sectionHeaderActive : ''}`}
                    onClick={() => toggleSection(key)}
                >
                    <span>{label}</span>
                    <button className={isOpen ? styles.rotate : ''}>
                        <PlusIcon width={18} height={18} color="#3D4C5E" />
                    </button>
                </div>
                <div className={`${styles.sectionBody} ${!isOpen ? styles.hidden : ''}`}>
                    {isOpen && <div className={styles.sectionContent}>{content}</div>}
                </div>
            </>
        );
    };

    const [isConfirmResetOpen, setIsConfirmResetOpen] = React.useState(false);

    const { loadConfigFromApi } = useTableConfig();

    const doResetConfig = async () => {
        try {
            setIsResetting(true);
            await configService.resetConfig(table_key);

            toast.success('Konfiqurasiya uğurla sıfırlandı');
            loadConfigFromApi();
        } catch (error) {
            console.error('Sıfırlama zamanı xəta:', error);
        } finally {
            setIsResetting(false);
            setIsConfirmResetOpen(false);
        }
    };

    return (
        <div className={`${styles.panelWrapper} ${isCollapsed ? styles.hidden : styles.visible}`}>
            <div className={styles.configPanel}>
                <div className={styles.configPanelHeader}>
                    <h1>Konfiqurasiya</h1>
                    <div className={styles.btns}>
                        <S_Button
                            variant="outlined-10"
                            iconBtnSize="15"
                            aria-label="Sıfırla"
                            isIcon
                            onClick={() => setIsConfirmResetOpen(true)}
                        >
                            {isResetting ? (
                                <span className={styles.spinner} />
                            ) : (
                                <RedoIcon color="hsl(var(--clr-primary-500))" width={16} height={16} />
                            )}
                        </S_Button>
                        <S_Button variant="main-10" iconBtnSize="15" aria-label="Təsdiqlə" isIcon onClick={handleSave}>
                            {isSaving ? (
                                <span className={styles.spinner} />
                            ) : (
                                <FloppyDiskIcon color="#fff" width={16} height={16} />
                            )}
                        </S_Button>
                    </div>
                </div>

                {renderSection('Başlıq', 'header', <HeaderConfigSection tableKey={table_key} />)}
                {renderSection(
                    'Sətir',
                    'row',
                    <RowConfigSection tableKey={table_key} setPendingTake={setPendingTake} pendingTake={pendingTake} />
                )}
                {renderSection(
                    'Sütun',
                    'column',
                    <ColumnConfigSection
                        tableKey={table_key}
                        modalTableData={modalTableData}
                        initialModalTableColumns={modalTableColumns}
                        onSave={handleSave}
                        isRowSum={isRowSum}
                    />
                )}
            </div>

            <ConfirmModal
                open={isConfirmResetOpen}
                onOpenChange={setIsConfirmResetOpen}
                onSubmit={doResetConfig}
                email=""
                isLoading={isResetting}
            />
        </div>
    );
};

export default ConfigPanel;
