import React, { useState } from 'react';

import { configService } from '@/services/configuration/configuration.service';

import { S_Button } from '@/ui';
import Modal from '@/ui/dialog';
import { showToast } from '@/ui/toast/showToast';

import { FloppyDiskIcon, PlusIcon, RedoIcon } from '../icons';
import { useTableConfig } from '../table/tableConfigContext';
import HeaderConfigSection from './basliq';
import RowConfigSection from './setir';
import styles from './style.module.css';
import ColumnConfigSection from './sutun';

interface ConfigPanelProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    modalTableData?: any[];
    table_key: string;
    modalTableColumns?: any[];
    isRowSum?: boolean;
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

            showToast({
                label: 'Konfiqurasiya uğurla tətbiq olundu',
                type: 'success',
            });
            await loadConfigFromApi();
        } catch (error) {
            console.error('Config göndərilərkən xəta:', error);
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
                        <PlusIcon width={18} height={18} color="var(--content-primary)" />
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

            showToast({
                label: 'Konfiqurasiya uğurla sıfırlandı',
                type: 'success',
            });
            await loadConfigFromApi();
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
                            variant="primary"
                            color="secondary"
                            aria-label="Sıfırla"
                            isLoading={isResetting}
                            onClick={() => setIsConfirmResetOpen(true)}
                        >
                            {isResetting ? (
                                <span className={styles.spinner} />
                            ) : (
                                <RedoIcon color="var(--clr-content-secondary-bold)" width={16} height={16} />
                            )}
                        </S_Button>
                        <S_Button
                            variant="primary"
                            color="primary"
                            aria-label="Təsdiqlə"
                            isLoading={isSaving}
                            onClick={handleSave}
                        >
                            {isSaving ? (
                                <span className={styles.spinner} />
                            ) : (
                                <FloppyDiskIcon color="var(--clr-content-brand-light)" width={16} height={16} />
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

            <Modal
                open={isConfirmResetOpen}
                onOpenChange={setIsConfirmResetOpen}
                size="xs"
                title="Xəbərdarlıq"
                footer={
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <S_Button
                            tabIndex={1}
                            type="button"
                            variant="primary"
                            color="secondary"
                            onClick={() => setIsConfirmResetOpen(false)}
                        >
                            Ləğv et
                        </S_Button>
                        <S_Button tabIndex={2} type="button" variant="primary" color="primary" onClick={doResetConfig}>
                            Təsdiqlə
                        </S_Button>
                    </div>
                }
            >
                <h1 className={styles.title}>Konfiqurasiyanı sıfırlamaq istədiyinizdən əminsiniz mi?</h1>
            </Modal>
        </div>
    );
};

export default ConfigPanel;
