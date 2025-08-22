import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import React, { useState } from 'react';

import CustomDatePicker from '@/ui/datepicker/date-picker';
import CustomDateRangePicker from '@/ui/datepicker/date-range-picker';

import { ArrowTransferIcon } from '../../shared/icons';
import styles from './style.module.css';

interface DateIntervalFilterProps {
    label?: string;
    value?: string | [string, string] | any;
    onChange: (value: string | [string, string]) => void;
    readOnly?: boolean;
    singlePlaceholder?: string;
    rangePlaceholders?: [string, string];
    inline?: boolean;
}

const DateIntervalFilter: React.FC<DateIntervalFilterProps> = ({
    label,
    value,
    onChange,
    readOnly = false,
    singlePlaceholder = 'Tarix seçin',
    rangePlaceholders = ['Başlanğıc tarix', 'Bitmə tarixi'],
    inline = false,
}) => {
    const [isRangeMode, setIsRangeMode] = useState(Array.isArray(value));

    const toggleMode = () => {
        if (readOnly) return;
        const next = !isRangeMode;
        setIsRangeMode(next);
        onChange(next ? ['', ''] : '');
    };

    const [date, setDate] = useState(value || (isRangeMode ? ['', ''] : ''));

    return (
        <div className={`${styles.container} ${inline ? styles.inlineContainer : ''}`}>
            <div className={styles.labelWrapper}>
                <label className={styles.label}>{label}</label>
                {!readOnly && (
                    <button onClick={toggleMode} className={styles.switchButton}>
                        <ArrowTransferIcon color="#005A9E" width={18} height={18} />
                    </button>
                )}
            </div>

            <div className={styles.inputWrapper}>
                {isRangeMode ? (
                    <CustomDateRangePicker
                        value={date}
                        onChange={setDate}
                        placeholder={`${rangePlaceholders[0]} – ${rangePlaceholders[1]}`}
                        format="dd.MM.yyyy"
                        style={{ width: 320 }}
                        showHeader={false}
                    />
                ) : (
                    <CustomDatePicker
                        value={date}
                        onChange={setDate}
                        placeholder={singlePlaceholder}
                        format="dd.MM.yyyy"
                        style={{ width: 280 }}
                        oneTap
                    />
                )}
            </div>
        </div>
    );
};

export default DateIntervalFilter;
