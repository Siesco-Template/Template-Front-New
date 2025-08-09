import { Checkbox, ColorPicker } from 'antd';
import React, { useEffect, useState } from 'react';

import {
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BoldIcon,
    DashedIcon,
    ItalicIcon,
    SolidIcon,
    TextIcon,
} from '@/shared/config/icons';
import { useTableConfig } from '@/shared/table/tableConfigContext';

import styles from '../style.module.css';

const HeaderConfigSection: React.FC<{ tableKey: string }> = ({ tableKey }) => {
    const { config, updateConfig } = useTableConfig();

    const header = config.tables?.[tableKey]?.header || {};
    const cell = header.cell || {};
    const text = header.text || {};
    const border = header.border || {};

    const [textColor, setTextColor] = useState('#D9D9D9');
    const [borderColor, setBorderColor] = useState('#D9D9D9');
    const [backgroundColor, setBackgroundColor] = useState('#D9D9D9');

    useEffect(() => {
        if (text.color) setTextColor(text.color);
        if (border.color) setBorderColor(border.color);
        if (cell.backgroundColor) setBackgroundColor(cell.backgroundColor);
    }, [text.color, border.color, cell.backgroundColor]);

    return (
        <>
            <div className={styles.configRow}>
                <label>Sabitlə</label>
                <Checkbox
                    checked={header.pinned ?? false}
                    className={styles.checkbox}
                    onChange={(e) => updateConfig(tableKey, 'header.pinned', e.target.checked)}
                />
            </div>

            <div className={styles.sectionSubHeader}>Xana</div>
            <div className={styles.configRow}>
                <label>Xana hündürlüyü</label>
                <input
                    type="number"
                    min={0}
                    value={cell.padding !== undefined ? String(cell.padding) : ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        const parsed = Number(val);
                        if (val === '') {
                            updateConfig(tableKey, 'header.cell.padding', undefined);
                        } else if (!isNaN(parsed) && parsed <= 40) {
                            updateConfig(tableKey, 'header.cell.padding', parsed);
                        }
                    }}
                />
                <span>px</span>
            </div>
            <div className={`${styles.configRow} ${styles.bottomBorder}`}>
                <label>Rəng</label>
                <ColorPicker
                    value={backgroundColor}
                    onChangeComplete={(color) => {
                        const hex = color.toHexString();
                        setBackgroundColor(hex);
                        updateConfig(tableKey, 'header.cell.backgroundColor', hex);
                    }}
                    className={styles.colorPickerWrapper}
                />
            </div>

            <div className={styles.sectionSubHeader}>Mətn</div>
            <div className={styles.configRow}>
                <label>Ölçüsü</label>
                <input
                    type="number"
                    className={styles.numberInput}
                    min={1}
                    max={24}
                    value={text.fontSize !== undefined ? text.fontSize : ''}
                    onChange={(e) => {
                        const val = e.target.value;

                        if (val === '') {
                            updateConfig(tableKey, 'header.text.fontSize', undefined);
                            return;
                        }

                        const parsed = parseInt(val);
                        if (!isNaN(parsed) && parsed >= 1 && parsed <= 24) {
                            updateConfig(tableKey, 'header.text.fontSize', parsed);
                        }
                    }}
                />
                <span>px</span>
            </div>
            <div className={styles.configRow}>
                <label>Stil</label>
                <div className={styles.buttonGroup}>
                    {[
                        { value: 'italic', icon: <ItalicIcon width={18} height={18} color="#28303F" /> },
                        { value: 'bold', icon: <BoldIcon width={18} height={18} color="#28303F" /> },
                    ].map((item) => {
                        const isActive =
                            (item.value === 'italic' && text.italic) || (item.value === 'bold' && text.bold);

                        const newStyle = {
                            bold: item.value === 'bold' ? !text.bold : text.bold,
                            italic: item.value === 'italic' ? !text.italic : text.italic,
                        };

                        return (
                            <button
                                key={item.value}
                                onClick={() => updateConfig(tableKey, 'header.text', { ...text, ...newStyle })}
                                className={isActive ? styles.isActive : ''}
                            >
                                {item.icon}
                            </button>
                        );
                    })}
                </div>
            </div>

           <div className={`${styles.configRow} ${styles.bottomBorder}`}>
                <label>Rəng</label>
                <ColorPicker
                    value={textColor}
                    onChangeComplete={(color) => {
                        const hex = color.toHexString();
                        setTextColor(hex);
                        updateConfig(tableKey, 'header.text.color', hex);
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
                            onClick={() => updateConfig(tableKey, 'header.border.style', item.value)}
                            className={border.style === item.value ? styles.isActive : ''}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles.configRow}>
                <label>Qalınlığı</label>
                <input
                    type="number"
                    className={styles.numberInput}
                    min={0}
                    max={10}
                    value={border.thickness === undefined || border.thickness === null ? '' : border.thickness}
                    onChange={(e) => {
                        const val = e.target.value;

                        if (val === '') {
                            updateConfig(tableKey, 'header.border.thickness', undefined);
                            return;
                        }

                        const parsed = parseInt(val);
                        if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
                            updateConfig(tableKey, 'header.border.thickness', parsed);
                        }
                    }}
                />
                <span>px</span>
            </div>
            <div className={styles.configRow}>
                <label>Rəng</label>
                <ColorPicker
                    value={borderColor}
                    onChangeComplete={(c) => {
                        const hex = c.toHexString();
                        setBorderColor(hex);
                        updateConfig(tableKey, 'header.border.color', hex);
                    }}
                    className={styles.colorPickerWrapper}
                />
            </div>
        </>
    );
};

export default HeaderConfigSection;
