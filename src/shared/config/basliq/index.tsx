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

import { S_Checkbox, S_Switch } from '@/ui';

import ValidatedNumberInput from '../components/input/ValidatedNumberInput';
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

    const [fontSizeError, setFontSizeError] = useState(false);

    useEffect(() => {
        if (text.color) setTextColor(text.color);
        if (border.color) setBorderColor(border.color);
        if (cell.backgroundColor) setBackgroundColor(cell.backgroundColor);
    }, [text.color, border.color, cell.backgroundColor]);

    return (
        <>
            <div className={styles.configRow}>
                <label>Sabitlə</label>
                <S_Switch
                    checked={!!header.pinned}
                    size="16"
                    onCheckedChange={({ checked }) => updateConfig(tableKey, 'header.pinned', !!checked)}
                />
            </div>

            <div className={styles.sectionSubHeader}>Xana</div>
            <div className={styles.configRow}>
                <label>Xana hündürlüyü</label>
                <ValidatedNumberInput
                    value={cell.padding}
                    min={30}
                    max={50}
                    step={1}
                    defaultValue={34}
                    className={styles.numberInput}
                    invalidClass={styles.invalid}
                    shakeClass={styles.shake}
                    tooltipText="30-50 px aralığında olmalıdır"
                    onValidChange={(v) => updateConfig(tableKey, 'header.cell.padding', v)}
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
                <ValidatedNumberInput
                    value={text.fontSize}
                    min={1}
                    max={24}
                    step={1}
                    defaultValue={16}
                    className={styles.numberInput}
                    invalidClass={styles.invalid}
                    shakeClass={styles.shake}
                    tooltipText="1–24 px aralığında olmalıdır"
                    onValidChange={(v) => updateConfig(tableKey, 'header.text.fontSize', v)}
                />
                <span>px</span>
            </div>
            <div className={styles.configRow}>
                <label>Stil</label>
                <div className={styles.buttonGroup}>
                    {[
                        {
                            value: 'italic',
                            icon: <ItalicIcon width={18} height={18} color="var(--content-secondary)" />,
                        },
                        { value: 'bold', icon: <BoldIcon width={18} height={18} color="var(--content-secondary)" /> },
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
                        { value: 'solid', icon: <SolidIcon color="var(--content-secondary)" /> },
                        { value: 'dashed', icon: <DashedIcon color="var(--content-secondary)" /> },
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
                <ValidatedNumberInput
                    value={border.thickness}
                    min={0}
                    max={10}
                    step={1}
                    defaultValue={1}
                    className={styles.numberInput}
                    invalidClass={styles.invalid}
                    shakeClass={styles.shake}
                    tooltipText="0–10 px aralığında olmalıdır"
                    onValidChange={(v) => updateConfig(tableKey, 'header.border.thickness', v)}
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
