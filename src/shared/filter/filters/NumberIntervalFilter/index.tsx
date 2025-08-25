import { useEffect, useState } from 'react';

import { ArrowTransferIcon } from '../../shared/icons';
import styles from './style.module.css';

interface NumberIntervalFilterProps {
    label?: string;
    value: { min: string; max: string } | number | any;
    onChange: (val: { min: string; max: string } | number | any) => void;
    readOnly?: boolean;
    placeholder: string | any;
    inline?: boolean;
}

const NumberIntervalFilter = ({
    label,
    onChange,
    value,
    placeholder,
    readOnly = false,
    inline = false,
}: NumberIntervalFilterProps) => {
    const [min, setMin] = useState('');
    const [max, setMax] = useState('');
    const [isRangeMode, setIsRangeMode] = useState(false);

    useEffect(() => {
        if (Array.isArray(value)) {
            setMin(value[0]?.toString() ?? '');
            setMax(value[1]?.toString() ?? '');
        } else if (typeof value === 'object' && value !== null) {
            setMin(value.min || '');
            setMax(value.max || '');
        } else if (typeof value === 'number' || typeof value === 'string') {
            setMin(value?.toString() ?? '');
            setMax('');
        } else {
            setMin('');
            setMax('');
        }
    }, [value]);

    const handleMinChange = (value: any) => {
        if (readOnly) return;
        const regex = /^[0-9]*$/;
        if (regex.test(value)) {
            setMin(value);
            if (!isRangeMode) {
                onChange(value ? Number(value) : '');
            } else {
                onChange({ min: value, max });
            }
        }
    };

    const handleMaxChange = (value: string) => {
        if (readOnly) return;
        const regex = /^[0-9]*$/;
        if (regex.test(value)) {
            setMax(value);
            onChange({ min, max: value });
        }
    };

    const handleChange = (value: string) => {
        if (readOnly) return;
        const regex = /^[0-9]*$/;

        if (isRangeMode) {
            const parts = value.split('-').map((x) => x.trim());

            if (parts.length === 2 && regex.test(parts[0]) && regex.test(parts[1])) {
                setMin(parts[0]);
                setMax(parts[1]);
                onChange({ min: parts[0], max: parts[1] });
            } else {
                setMin('');
                setMax('');
                onChange({ min: '', max: '' });
            }
        } else {
            if (regex.test(value)) {
                setMin(value);
                setMax('');
                onChange(value ? Number(value) : '');
            }
        }
    };

    const toggleMode = () => {
        if (readOnly) return;
        setIsRangeMode(!isRangeMode);
        setMin('');
        setMax('');
        onChange({ min: '', max: '' });
    };

    return (
        <div className={`${styles.container} ${inline ? styles.inlineContainer : ''}`}>
            <div className={styles.labelWrapper}>
                {label && <label className={styles.label}>{label}</label>}
                {!readOnly && (
                    <button onClick={toggleMode} className={styles.switchButton}>
                        <ArrowTransferIcon color="#005A9E" width={18} height={18} />
                    </button>
                )}
            </div>
            <div className={styles.inputWrapper}>
                {isRangeMode ? (
                    <div className={styles.rangeWrapper}>
                        <input
                            type="text"
                            placeholder="min"
                            value={min}
                            onChange={(e) => handleMinChange(e.target.value)}
                            className={`${styles.inputField} ${styles.inputFieldRange}`}
                            readOnly={readOnly}
                        />
                        <span className={styles.rangeSeparator}>-</span>
                        <input
                            type="text"
                            placeholder="max"
                            value={max}
                            onChange={(e) => handleMaxChange(e.target.value)}
                            className={`${styles.inputField} ${styles.inputFieldRange}`}
                            readOnly={readOnly}
                        />
                    </div>
                ) : (
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={min}
                        onChange={(e) => handleChange(e.target.value)}
                        className={`${styles.inputField} ${styles.inputFieldSingle}`}
                        readOnly={readOnly}
                    />
                )}
            </div>
        </div>
    );
};

export default NumberIntervalFilter;
