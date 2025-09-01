import { ColorPicker } from 'antd';
import { useEffect, useState } from 'react';

import Catalog from '@/shared/catalog';
import { BoldIcon, DashedIcon, ItalicIcon, RowIcon1, RowIcon2, SolidIcon } from '@/shared/config/icons';
import { useTableConfig } from '@/shared/table/tableConfigContext';

import S_Select_Simple, { Item } from '@/ui/select/select-simple';

import ValidatedNumberInput from '../components/input/ValidatedNumberInput';
import styles from '../style.module.css';

const RowConfigSection = ({ tableKey, setPendingTake }: any) => {
    const { config, updateConfig } = useTableConfig();

    const rowConfig = config.tables?.[tableKey]?.row || {};
    const cellConfig = rowConfig.cell || {};
    const borderConfig = rowConfig.border || {};
    const textConfig = rowConfig.text || {};

    const [textColor, setTextColor] = useState('#D9D9D9');
    const [backgroundColor, setBackgroundColor] = useState('#D9D9D9');
    const [borderColor, setBorderColor] = useState('#D9D9D9');

    useEffect(() => {
        if (backgroundColor) setBackgroundColor(cellConfig.backgroundColor);
        if (borderColor) setBorderColor(borderConfig.color);
        if (textColor) setTextColor(textConfig.color);
    }, [cellConfig.backgroundColor, borderConfig.color, textConfig.color]);

    const [selectedValue, setSelectedValue] = useState<string>('20');

    useEffect(() => {
        if (rowConfig?.paginationTakeCount) {
            setSelectedValue(rowConfig.paginationTakeCount.toString());
        }
    }, [rowConfig.paginationTakeCount]);

    const handleSelectChange = (items: Item[]) => {
        const value = items[0]?.value || '20';
        setSelectedValue(value);
        setPendingTake(value);
    };

    return (
        <>
            <label className={styles.sectionSubHeader}>Sətirlər</label>
            <div className={`${styles.configRow} ${styles.bottomBorder}`}>
                <div className={styles.configRowItem}>
                    <button
                        onClick={() => updateConfig(tableKey, 'row.stripeStyle', 'plain')}
                        className={rowConfig.stripeStyle === 'plain' ? styles.isActiveBtn : ''}
                    >
                        <RowIcon1 color="var(--content-secondary)" />
                    </button>
                    <button
                        onClick={() => updateConfig(tableKey, 'row.stripeStyle', 'striped')}
                        className={rowConfig.stripeStyle === 'striped' ? styles.isActiveBtn : ''}
                    >
                        <RowIcon2 color="var(--content-secondary)" />
                    </button>
                </div>
            </div>

            <label className={styles.sectionSubHeader}>Səhifədə göstər</label>
            <div className={`${styles.configRow} ${styles.bottomBorder}`}>
                <div className={styles.configRowItem}>
                    <div style={{ width: '90px' }}>
                        <Catalog
                            items={[10, 20, 50, 100].map((val) => ({
                                label: val.toString(),
                                value: val.toString(),
                            }))}
                            getLabel={(i: any) => i?.label}
                            getRowId={(i: any) => String(i?.value)}
                            value={
                                selectedValue
                                    ? [{ label: selectedValue.toString(), value: selectedValue.toString() }]
                                    : []
                            }
                            onChange={(sel) => {
                                const picked: any = Array.isArray(sel) ? sel[0] : sel;
                                const newVal = picked ? picked : '';
                                handleSelectChange([newVal]);
                            }}
                            multiple={false}
                            enableModal={false}
                            sizePreset="md-lg"
                            totalItemCount={6}
                            onRefetch={undefined}
                            onClickNew={undefined}
                            isLoading={false}
                            searchItems={false}
                        />
                    </div>
                </div>
            </div>

            <label className={styles.sectionSubHeader}>Sətir</label>
            <div className={styles.configRow}>
                <label>Sətir məsafəsi</label>
                <ValidatedNumberInput
                    value={cellConfig.padding}
                    min={34}
                    max={50}
                    step={1}
                    defaultValue={34}
                    className={styles.numberInput}
                    invalidClass={styles.invalid}
                    shakeClass={styles.shake}
                    tooltipText="34–50 px aralığında olmalıdır"
                    onValidChange={(v) => updateConfig(tableKey, 'row.cell.padding', v)}
                />
                <span>px</span>
            </div>

            <div className={`${styles.configRow} ${styles.bottomBorder}`}>
                <label>Arxa fon</label>
                <ColorPicker
                    value={backgroundColor}
                    onChangeComplete={(color) => {
                        const hex = color.toHexString();
                        setBackgroundColor(hex);
                        updateConfig(tableKey, `row.cell.backgroundColor`, hex);
                    }}
                    className={styles.colorPickerWrapper}
                />
            </div>

            <div className={styles.sectionSubHeader}>Sərhəd xətləri</div>
            <div className={styles.configRow}>
                <label>Stil</label>
                <div className={styles.buttonGroup}>
                    {[
                        { value: 'solid', icon: <SolidIcon color="var(--content-secondary)" /> },
                        { value: 'dashed', icon: <DashedIcon color="var(--content-secondary)" /> },
                    ].map((item) => (
                        <button
                            key={item.value}
                            onClick={() => updateConfig(tableKey, `row.border.style`, item.value)}
                            className={borderConfig.style === item.value ? styles.isActive : ''}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.configRow}>
                <label>Rəng</label>
                <ColorPicker
                    value={borderColor}
                    onChangeComplete={(color) => {
                        const hex = color.toHexString();
                        setBorderColor(hex);
                        updateConfig(tableKey, `row.border.color`, hex);
                    }}
                    className={styles.colorPickerWrapper}
                />
            </div>
            <div className={`${styles.configRow} ${styles.bottomBorder}`}>
                <label>Qalınlığı</label>
                <ValidatedNumberInput
                    value={borderConfig.thickness}
                    min={0}
                    max={10}
                    step={1}
                    defaultValue={1}
                    className={styles.numberInput}
                    invalidClass={styles.invalid}
                    shakeClass={styles.shake}
                    tooltipText="0–10 px aralığında olmalıdır"
                    onValidChange={(v) => updateConfig(tableKey, 'row.border.thickness', v)}
                />
                <span>px</span>
            </div>

            <div className={styles.sectionSubHeader}>Mətn</div>
            <div className={styles.configRow}>
                <label>Ölçüsü</label>
                <ValidatedNumberInput
                    value={textConfig.fontSize}
                    min={10}
                    max={20}
                    step={1}
                    defaultValue={14}
                    className={styles.numberInput}
                    invalidClass={styles.invalid}
                    shakeClass={styles.shake}
                    tooltipText="10-20 px aralığında olmalıdır"
                    onValidChange={(v) => updateConfig(tableKey, 'row.text.fontSize', v)}
                />
                <span>px</span>
            </div>

            <div className={styles.configRow}>
                <label>Stil</label>
                <div className={styles.buttonGroup}>
                    <button
                        onClick={() => updateConfig(tableKey, `row.text.italic`, !textConfig.italic)}
                        className={textConfig.italic ? styles.isActive : ''}
                    >
                        <ItalicIcon width={18} height={18} color="var(--content-secondary)" />
                    </button>
                    <button
                        onClick={() => updateConfig(tableKey, `row.text.bold`, !textConfig.bold)}
                        className={textConfig.bold ? styles.isActive : ''}
                    >
                        <BoldIcon width={18} height={18} color="var(--content-secondary)" />
                    </button>
                </div>
            </div>

            <div className={styles.configRow}>
                <label>Rəng</label>
                <ColorPicker
                    value={textColor}
                    onChangeComplete={(color) => {
                        const hex = color.toHexString();
                        setTextColor(hex);
                        updateConfig(tableKey, `row.text.color`, hex);
                    }}
                    className={styles.colorPickerWrapper}
                />
            </div>
        </>
    );
};

export default RowConfigSection;
