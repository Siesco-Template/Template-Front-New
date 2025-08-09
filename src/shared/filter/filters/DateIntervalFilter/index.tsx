import { DatePicker } from 'antd';
import 'antd/dist/reset.css';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import React, { useEffect, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import { ArrowTransferIcon } from '../../shared/icons';
import styles from './style.module.css';

const { RangePicker } = DatePicker;

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
    const [isRangeMode, setIsRangeMode] = useState(false);

    const [singleDate, setSingleDate] = useState<string | undefined>(undefined);
    const [rangeDate, setRangeDate] = useState<[string | undefined, string | undefined]>([undefined, undefined]);

    useEffect(() => {
        if (isRangeMode) {
            if (Array.isArray(value)) {
                setRangeDate(value as [string, string]);
            } else {
                setRangeDate([undefined, undefined]);
            }
        } else {
            if (Array.isArray(value) && typeof value[0] === 'string') {
                setSingleDate(value[0]);
            } else if (typeof value === 'string') {
                setSingleDate(value);
            } else {
                setSingleDate(undefined);
            }
        }
    }, [value, isRangeMode]);

    const handleSingleChange: DatePickerProps['onChange'] = (date, dateString: any) => {
        if (readOnly) return;
        if (dateString) {
            setSingleDate(dateString);
            onChange(dateString);
        } else {
            setSingleDate(undefined);
            onChange('');
        }
    };

    const handleRangeChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
        if (readOnly) return;
        if (dateStrings && dateStrings[0] && dateStrings[1]) {
            setRangeDate(dateStrings as [string, string]);
            onChange(dateStrings as [string, string]);
        } else {
            setRangeDate([undefined, undefined]);
            onChange(['', '']);
        }
    };

    const toggleMode = () => {
        if (readOnly) return;
        setIsRangeMode((prev) => !prev);
        onChange('');
    };

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
                    <RangePicker
                        format="DD.MM.YYYY"
                        value={
                            rangeDate[0] && rangeDate[1]
                                ? [dayjs(rangeDate[0], 'DD.MM.YYYY'), dayjs(rangeDate[1], 'DD.MM.YYYY')]
                                : undefined
                        }
                        onChange={handleRangeChange}
                        placeholder={rangePlaceholders}
                        className={styles.datePicker}
                        disabled={readOnly}
                    />
                ) : (
                    <DatePicker
                        format="DD.MM.YYYY"
                        value={singleDate ? dayjs(singleDate, 'DD.MM.YYYY') : undefined}
                        onChange={handleSingleChange}
                        placeholder={singlePlaceholder}
                        className={styles.datePicker}
                        disabled={readOnly}
                    />
                )}
            </div>
        </div>
    );
};

export default DateIntervalFilter;
