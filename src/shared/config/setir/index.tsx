import { ColorPicker } from 'antd';
import { useEffect, useState } from 'react';

import { BoldIcon, DashedIcon, ItalicIcon, RowIcon1, RowIcon2, SolidIcon } from '@/shared/config/icons';
import { useTableConfig } from '@/shared/table/tableConfigContext';

import S_Select_Simple, { Item } from '@/ui/select/select-simple';

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
                        <RowIcon1 />
                    </button>
                    <button
                        onClick={() => updateConfig(tableKey, 'row.stripeStyle', 'striped')}
                        className={rowConfig.stripeStyle === 'striped' ? styles.isActiveBtn : ''}
                    >
                        <RowIcon2 />
                    </button>
                </div>
            </div>

            <label className={styles.sectionSubHeader}>Səhifədə göstər</label>
            <div className={`${styles.configRow} ${styles.bottomBorder}`}>
                <div className={styles.configRowItem}>
                    <div style={{ width: '60px' }}>
                        <S_Select_Simple
                            value={[selectedValue]}
                            items={[10, 20, 50, 100].map((val) => ({
                                label: val.toString(),
                                value: val.toString(),
                            }))}
                            setSelectedItems={handleSelectChange}
                            itemsContentMaxWidth={100}
                            itemsContentMinWidth={50}
                        />
                    </div>
                </div>
            </div>

            <label className={styles.sectionSubHeader}>Sətir</label>
            <div className={styles.configRow}>
                <label>Sətir məsafəsi</label>
                <input
                    type="number"
                    min={0}
                    value={cellConfig.padding !== undefined ? String(cellConfig.padding) : ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        const num = Number(val);
                        if (val === '') {
                            updateConfig(tableKey, `row.cell.padding`, undefined);
                        } else if (!isNaN(num) && num <= 50) {
                            updateConfig(tableKey, `row.cell.padding`, num);
                        }
                    }}
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
                        { value: 'solid', icon: <SolidIcon /> },
                        { value: 'dashed', icon: <DashedIcon /> },
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
                <input
                    type="number"
                    min={0}
                    value={borderConfig.thickness !== undefined ? String(borderConfig.thickness) : ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        const num = Number(val);
                        if (val === '') {
                            updateConfig(tableKey, `row.border.thickness`, undefined);
                        } else if (!isNaN(num) && num <= 10) {
                            updateConfig(tableKey, `row.border.thickness`, num);
                        }
                    }}
                />

                <span>px</span>
            </div>

            <div className={styles.sectionSubHeader}>Mətn</div>
            <div className={styles.configRow}>
                <label>Ölçüsü</label>
                <input
                    type="number"
                    min={8}
                    value={textConfig.fontSize !== undefined ? String(textConfig.fontSize) : ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        const num = Number(val);
                        if (val === '') {
                            updateConfig(tableKey, `row.text.fontSize`, undefined);
                        } else if (!isNaN(num) && num <= 24) {
                            updateConfig(tableKey, `row.text.fontSize`, num);
                        }
                    }}
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
                        <ItalicIcon width={18} height={18} color="#28303F" />
                    </button>
                    <button
                        onClick={() => updateConfig(tableKey, `row.text.bold`, !textConfig.bold)}
                        className={textConfig.bold ? styles.isActive : ''}
                    >
                        <BoldIcon width={18} height={18} color="#28303F" />
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
