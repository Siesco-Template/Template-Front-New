import { ColorPicker } from 'antd';
import { useEffect, useState } from 'react';

import { PRESET_SIZES } from '@/shared/catalog';
import { Dialog, DialogContent } from '@/shared/catalog/shared/dialog/dialog';
import { PanelDialog, PanelDialogContent } from '@/shared/catalog/shared/dialog/panel-dialog';
import {
    AlignBottomIcon,
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    AlignTopIcon,
    BoldIcon,
    ItalicIcon,
    TextIcon,
    ViewOffIcon,
} from '@/shared/config/icons';
import { Table } from '@/shared/table';
import { useTableContext } from '@/shared/table/table-context';
import { useTableOrdering } from '@/shared/table/table-ordering';
import { useTableConfig } from '@/shared/table/tableConfigContext';

import { S_Button } from '@/ui';

import BottomModal from '../modal/bottomModal';
import styles from '../style.module.css';

const ColumnConfigSection = ({ tableKey, modalTableData, initialModalTableColumns, onSave, isRowSum }: any) => {
    const { config, updateConfig } = useTableConfig();
    const { selectedColumnKey }: any = useTableContext();

    const columnConfig = config.tables?.[tableKey]?.columns?.[selectedColumnKey]?.config || {};
    const styleConfig = columnConfig.style || {};

    const [textColor, setTextColor] = useState(styleConfig.color || '#D9D9D9');

    const [isSaving, setIsSaving] = useState(false);

    const currentSummary = config.tables?.[tableKey]?.columns?.summaryRow?.mode ?? 'hidden';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'resize' | 'order' | null>(null);

    const [modalTableColumns, setModalTableColumns] = useState(initialModalTableColumns);

    const { setTableOrdering, initializeOrdering, tableOrdering } = useTableOrdering(tableKey);

    useEffect(() => {
        if (initialModalTableColumns.length > 0) {
            const ordered = initializeOrdering(initialModalTableColumns);
            setModalTableColumns(ordered);
        }
    }, [initialModalTableColumns]);

    const specialKeys = ['mrt-row-select', 'mrt-row-numbers'];
    const tableConfig = config.tables?.[tableKey]?.columns?.[selectedColumnKey]?.config?.style || {};

    const isDisabled = !selectedColumnKey;

    const modalTypeConfigs = {
        order: {
            tableProps: {
                enableColumnActions: false,
                enableColumnOrdering: true,
                enableColumnActionsCustom: false,
                columnOrderState: tableOrdering,
                onColumnOrderChange: (newOrder: string[]) => {
                    setTableOrdering(newOrder);
                    const orderMap: Record<string, number> = {};
                    newOrder.forEach((colKey, index) => {
                        orderMap[colKey] = index;
                    });
                    updateConfig(tableKey, `columnsOrder`, orderMap);
                },
            },
            onSave: () => {
                const orderMap: Record<string, number> = {};
                tableOrdering.forEach((colKey, index) => {
                    if (!specialKeys.includes(colKey)) {
                        orderMap[colKey] = index;
                    }
                });
                updateConfig(tableKey, `tables.${tableKey}.columnsOrder`, orderMap);
                if (onSave) onSave();
            },
        },
        resize: {
            tableProps: {
                enableColumnResizing: true,
                enableColumnActions: false,
                enableColumnActionsCustom: false,
                columnResizeMode: 'onEnd',
                onColumnResizeEnd: (columnSizing: any) => {
                    Object.entries(columnSizing).forEach(([key, val]: any) => {
                        updateConfig(tableKey, `columns.${key}.config.size`, {
                            width: val.width,
                            minWidth: 100,
                            maxWidth: 600,
                        });
                    });
                    if (onSave) onSave();
                    setIsModalOpen(false);
                },
            },
            onSave: () => {
                if (onSave) onSave();
                setIsModalOpen(false);
            },
        },
    };

    useEffect(() => {
        if (selectedColumnKey) {
            const currentBg = config.tables?.[tableKey]?.columns?.[selectedColumnKey]?.config?.style?.backgroundColor;
            setTextColor(currentBg || '#D9D9D9');
        } else {
            setTextColor('#D9D9D9');
        }
    }, [selectedColumnKey, config, tableKey]);

    const sizePreset = 'xxl';

    const paperStyle = PRESET_SIZES[sizePreset];

    return (
        <>
            <label className={styles.sectionSubHeader}>Mətn</label>
            <div className={styles.configRow}>
                <label>Stil</label>
                <div className={styles.buttonGroup}>
                    <button
                        onClick={() => {
                            if (isDisabled) return;
                            updateConfig(
                                tableKey,
                                `columns.${selectedColumnKey}.config.style.italic`,
                                !styleConfig.italic
                            );
                            if (styleConfig.normal) {
                                updateConfig(tableKey, `columns.${selectedColumnKey}.config.style.normal`, false);
                            }
                        }}
                        className={tableConfig.italic ? styles.isActive : ''}
                        disabled={isDisabled}
                    >
                        <ItalicIcon width={18} height={18} color="var(--content-secondary)" />
                    </button>

                    <button
                        onClick={() => {
                            if (isDisabled) return;
                            updateConfig(tableKey, `columns.${selectedColumnKey}.config.style.bold`, !styleConfig.bold);
                            if (styleConfig.normal) {
                                updateConfig(tableKey, `columns.${selectedColumnKey}.config.style.normal`, false);
                            }
                        }}
                        className={styleConfig.bold ? styles.isActive : ''}
                        disabled={isDisabled}
                    >
                        <BoldIcon width={18} height={18} color="var(--content-secondary)" />
                    </button>
                </div>
            </div>

            <div className={styles.configRow}>
                <label>Düzləndirmə</label>
                <div className={styles.buttonGroup}>
                    <button
                        onClick={() => {
                            if (isDisabled) return;
                            const current = styleConfig.alignment;
                            updateConfig(
                                tableKey,
                                `columns.${selectedColumnKey}.config.style.alignment`,
                                current === 'left' ? null : 'left'
                            );
                        }}
                        className={styleConfig.alignment === 'left' ? styles.isActive : ''}
                        disabled={isDisabled}
                    >
                        <AlignLeftIcon width={18} height={18} color="var(--content-secondary)" />
                    </button>
                    <button
                        onClick={() => {
                            if (isDisabled) return;
                            const current = styleConfig.alignment;
                            updateConfig(
                                tableKey,
                                `columns.${selectedColumnKey}.config.style.alignment`,
                                current === 'center' ? null : 'center'
                            );
                        }}
                        className={styleConfig.alignment === 'center' ? styles.isActive : ''}
                        disabled={isDisabled}
                    >
                        <AlignCenterIcon width={18} height={18} color="var(--content-secondary)" />
                    </button>
                    <button
                        onClick={() => {
                            if (isDisabled) return;
                            const current = styleConfig.alignment;
                            updateConfig(
                                tableKey,
                                `columns.${selectedColumnKey}.config.style.alignment`,
                                current === 'right' ? null : 'right'
                            );
                        }}
                        className={styleConfig.alignment === 'right' ? styles.isActive : ''}
                        disabled={isDisabled}
                    >
                        <AlignRightIcon width={18} height={18} color="var(--content-secondary)" />
                    </button>
                </div>
            </div>

            <div className={`${styles.configRow} ${styles.bottomBorder}`}>
                <label>Rəng</label>
                <ColorPicker
                    disabled={isDisabled}
                    value={textColor}
                    onChangeComplete={(color) => {
                        if (isDisabled) return;
                        const hex = color.toHexString();
                        setTextColor(hex);
                        updateConfig(tableKey, `columns.${selectedColumnKey}.config.style.backgroundColor`, hex);
                    }}
                    className={styles.colorPickerWrapper}
                />
            </div>

            <div className={styles.sectionSubHeader}>Sütunlar</div>

            <div className={styles.configRow}>
                <label>Sıralamanı dəyiş</label>
                <S_Button
                    color="secondary"
                    variant="primary"
                    onClick={() => {
                        setModalType('order');
                        setIsModalOpen(true);
                    }}
                >
                    Tənzimlə
                </S_Button>
            </div>

            <div className={`${styles.configRow} ${styles.bottomBorder}`}>
                <label>Ölçüləri dəyiş</label>
                <S_Button
                    color="secondary"
                    variant="primary"
                    onClick={() => {
                        setModalType('resize');
                        setIsModalOpen(true);
                    }}
                >
                    Tənzimlə
                </S_Button>
            </div>

            {isRowSum && <div className={styles.sectionSubHeader}>Cəmləmə sətri</div>}

            {isRowSum && (
                <div className={styles.configRow}>
                    <label>Cəmləmə sətri</label>
                    <div className={styles.buttonGroup}>
                        <button
                            onClick={() => updateConfig(tableKey, `columns.summaryRow.mode`, 'hidden')}
                            className={currentSummary === 'hidden' ? styles.isActive : ''}
                        >
                            <ViewOffIcon width={18} height={18} color="var(--content-secondary)" />
                        </button>
                        <button
                            onClick={() => updateConfig(tableKey, `columns.summaryRow.mode`, 'bottom')}
                            className={currentSummary === 'bottom' ? styles.isActive : ''}
                        >
                            <AlignBottomIcon width={18} height={18} color="var(--content-secondary)" />
                        </button>
                        <button
                            onClick={() => updateConfig(tableKey, `columns.summaryRow.mode`, 'top')}
                            className={currentSummary === 'top' ? styles.isActive : ''}
                        >
                            <AlignTopIcon width={18} height={18} color="var(--content-secondary)" />
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <PanelDialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
                    <PanelDialogContent style={paperStyle}>
                        {modalType && (
                            <>
                                <div className={styles.header}>
                                    <h3 className={styles.title}>Ümumi reyestr</h3>

                                    <div className={styles.modalBtnGroup}>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    setIsSaving(true);
                                                    await modalTypeConfigs[modalType].onSave();
                                                } finally {
                                                    setIsSaving(false);
                                                    setIsModalOpen(false);
                                                }
                                            }}
                                            className={styles.saveBtn}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? <span className={styles.spinner} /> : 'Yadda saxla'}
                                        </button>
                                        <button onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                                            Ləğv et
                                        </button>
                                    </div>
                                </div>
                                <div style={{ height: '90vh', paddingBottom: '20px' }}>
                                    <Table
                                        columns={modalTableColumns}
                                        data={modalTableData}
                                        tableKey={tableKey}
                                        {...modalTypeConfigs[modalType].tableProps}
                                    />
                                </div>
                            </>
                        )}
                    </PanelDialogContent>
                </PanelDialog>
            </div>
        </>
    );
};

export default ColumnConfigSection;
