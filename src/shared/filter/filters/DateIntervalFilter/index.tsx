import React, { useEffect, useState } from 'react';

import CustomDatePicker from '@/ui/datepicker/date-picker';
import CustomDateRangePicker from '@/ui/datepicker/date-range-picker';
import CustomDateSelection from '@/ui/datepicker/date-selection-picker';

import { ArrowTransferIcon } from '../../shared/icons';
import styles from './style.module.css';

interface DateIntervalFilterProps {
    label?: string;
    value?: string | [string, string] | Date | [Date, Date];
    onChange: (value: string | [string, string]) => void;
    readOnly?: boolean;
    singlePlaceholder?: string;
    rangePlaceholders?: [string, string] | string;
    inline?: boolean;
    errorMsg?: string | false;
}

const formatDate = (date: Date): string =>
    `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;

const isDateInstance = (val: any): val is Date => val instanceof Date && !isNaN(val.getTime());

const DateIntervalFilter: React.FC<DateIntervalFilterProps> = ({
    label,
    value,
    onChange,
    readOnly = false,
    singlePlaceholder = 'Tarix seçin',
    rangePlaceholders = ['Başlanğıc tarix', 'Bitmə tarixi'],
    inline = false,
    errorMsg,
}) => {
    const [isRangeMode, setIsRangeMode] = useState(Array.isArray(value));

    const placeholder =
        typeof rangePlaceholders === 'string' ? rangePlaceholders : `${rangePlaceholders[0]} – ${rangePlaceholders[1]}`;

    const toggleMode = () => {
        if (readOnly) return;
        const next = !isRangeMode;
        setIsRangeMode(next);
    };

    // console.log(value, 'value in date interval');

    const toDate = (v: string | Date | null | undefined) =>
        v == null || v === ''
            ? null
            : v instanceof Date
              ? v
              : (() => {
                    const [dd, mm, yyyy] = String(v).split('.');
                    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
                })();

    const internalValue = (() => {
        if (isRangeMode) {
            if (Array.isArray(value)) {
                const [a, b] = value;
                return [toDate(a), toDate(b)] as [Date | null, Date | null];
            }
            return [null, null] as [null, null];
        } else {
            return toDate(value as any);
        }
    })();

    const handleChange = (val: any) => {
        if (isRangeMode) {
            const [start, end] = (Array.isArray(val) ? val : [null, null]) as [Date | null, Date | null];
            const formatted: [string, string] = [start ? formatDate(start) : '', end ? formatDate(end) : ''];
            onChange(formatted);
        } else {
            const formatted = val ? formatDate(val as Date) : '';
            onChange(formatted);
        }
    };

    return (
        <div className={`${styles.container} ${inline ? styles.inlineContainer : ''}`}>
            <div className={styles.labelWrapper}>
                <label className={styles.label}>{label}</label>
                {!readOnly && (
                    <button onClick={toggleMode} className={styles.switchButton}>
                        <ArrowTransferIcon color="var(--content-brand)" width={18} height={18} />
                    </button>
                )}
            </div>

            <div className={styles.inputWrapper}>
                {isRangeMode ? (
                    <CustomDateSelection
                        value={internalValue as [Date | null, Date | null]}
                        onChange={handleChange}
                        label={undefined}
                        error={errorMsg}
                        placement="leftEnd"
                    />
                ) : (
                    <CustomDatePicker // @ts-expect-error
                        value={internalValue}
                        onChange={handleChange}
                        placeholder={singlePlaceholder}
                        format="dd.MM.yyyy"
                        style={{ width: '100%' }}
                        error={errorMsg}
                        placement="leftEnd"
                        oneTap
                    />
                )}
            </div>
        </div>
    );
};

export default DateIntervalFilter;
