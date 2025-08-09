import { DatePicker } from 'antd';
import 'antd/dist/reset.css';
import type { RangePickerProps } from 'antd/es/date-picker';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import styles from './date-range.module.css';

const { RangePicker } = DatePicker;

interface DateRangeProps {
  value?: [string, string];
  onChange: (value: [string, string]) => void;
  readOnly?: boolean;
  placeholders?: [string, string];
  className?: string;
  label?: string;
  showInlineLabel?: boolean;
}

const DateRange: React.FC<DateRangeProps> = ({
  value = ['', ''],
  onChange,
  readOnly = false,
  placeholders = ['dd/mm/yyyy - dd/mm/yyyy '],
  className = '',
  label = 'Tarix aralığı',
  showInlineLabel = false,
}) => {
  const [dates, setDates] = useState<[string, string]>(value);

  const handleChange: RangePickerProps['onChange'] = (_, dateStrings) => {
    if (readOnly) return;
    
    const newDates = dateStrings as [string, string];
    setDates(newDates);
    onChange(newDates);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      
      <RangePicker
        format="DD.MM.YYYY"
        value={[
          dates[0] ? dayjs(dates[0], 'DD.MM.YYYY') : null,
          dates[1] ? dayjs(dates[1], 'DD.MM.YYYY') : null
        ]}
        onChange={handleChange}
        placeholder={[
          `dd/mm/yyyy`,
          `dd/mm/yyyy `
        ]}
        className={styles.datePicker}
        disabled={readOnly}
      />
    </div>
  );
};

export default DateRange;