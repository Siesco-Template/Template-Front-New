import React from 'react';

import { RemoveIcon } from '../../../shared/icons';
import styles from './style.module.css';

interface BaseInputProps {
    type?: 'text' | 'select';
    label: string;
    placeholder?: string;
    value?: string;
    onClick?: () => void;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    rightIcon?: React.ReactNode;
    compact?: boolean;
}

const BaseInput: React.FC<BaseInputProps> = ({
    type = 'text',
    label,
    placeholder,
    value = '',
    onClick,
    onChange,
    readOnly = false,
    compact,
    rightIcon,
}) => {
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!readOnly) {
            onChange?.('');
        }
    };

    return (
        <div className={styles.inputContainer}>
            <label className={styles.label}>{label}</label>
            <div
                className={`${styles.inputWrapper} ${readOnly ? styles.readOnly : ''} ${
                    compact ? styles.compactPadding : ''
                }`}
                onClick={readOnly ? onClick : undefined}
            >
                <input
                    type="text"
                    value={value ?? ''}
                    onChange={(e) => {
                        if (!readOnly) {
                            onChange?.(e.target.value);
                        }
                    }}
                    placeholder={placeholder || `Axtar ${label.toLowerCase()}`}
                    className={styles.inputField}
                    readOnly={readOnly}
                />

                {value && value.length > 0 && !readOnly ? (
                    <button className={styles.clearButton} onClick={handleClear}>
                        <RemoveIcon width={16} height={16} />
                    </button>
                ) : (
                    rightIcon && rightIcon
                )}
            </div>
        </div>
    );
};

export default BaseInput;
