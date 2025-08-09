import React, { useEffect, useRef, useState } from 'react';

import { ArrowDown, CloseIcon, RemoveIcon } from '../../shared/icons';
import styles from './style.module.css';

interface Option {
    label: string;
    value: string;
}

interface CatalogSimpleProps {
    label?: string;
    options: Option[];
    value: string | any;
    onChange: (value: string) => void;
    disabled?: boolean;
    disabledOptions?: string[];
}

const CatalogSimple: React.FC<CatalogSimpleProps> = ({
    label,
    options,
    value,
    onChange,
    disabled = false,
    disabledOptions,
}) => {
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [arrowRotated, setArrowRotated] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelectChange = (value: string) => {
        if (disabled) return;
        setSelectedValue(value);
        onChange(value);
        setIsOpen(false);
    };

    const handleRemoveSelection = (event: React.MouseEvent) => {
        if (disabled) return;
        event.stopPropagation();
        setSelectedValue(null);
        onChange('');
    };

    const toggleDropdown = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
        setArrowRotated(!arrowRotated);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setArrowRotated(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setSelectedValue(value || null);
    }, [value]);

    return (
        <div className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
            <label className={styles.label}>{label}</label>
            <div className={styles.selectContainer} onClick={toggleDropdown} ref={dropdownRef}>
                <div className={`${styles.select} ${disabled ? styles.disabledSelect : ''}`}>
                    {selectedValue ? (
                        <div className={styles.selectedTag}>
                            <span
                                className={styles.selectedLabel}
                                title={options.find((opt) => opt.value === selectedValue)?.label}
                            >
                                {options.find((opt) => opt.value === selectedValue)?.label}
                            </span>
                            {!disabled && (
                                <button className={styles.removeButton} onClick={handleRemoveSelection}>
                                    <RemoveIcon width={16} height={16} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <span className={styles.placeholder}>Seçim edin...</span>
                    )}
                    <span className={`${styles.arrow} ${arrowRotated ? styles.arrowOpen : ''}`}>
                        <ArrowDown color="#54595E" />
                    </span>
                </div>

                {isOpen && (
                    <div className={styles.dropdown}>
                        {options.map((opt) => {
                            const isDisabled = disabledOptions?.includes(opt.value);

                            return (
                                <div
                                    key={opt.value}
                                    className={`${styles.option} ${isDisabled ? styles.disabledOption : ''}`}
                                    onClick={() => !isDisabled && handleSelectChange(opt.value)}
                                >
                                    {opt.label}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatalogSimple;
