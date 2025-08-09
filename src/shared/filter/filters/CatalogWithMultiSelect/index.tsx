import React, { useEffect, useRef, useState } from 'react';

import { ArrowDown, RemoveIcon } from '../../shared/icons';
import styles from './style.module.css';

interface Option {
    label: string;
    value: string;
}

interface DropdownMultiSelectProps {
    label?: string;
    options: Option[];
    onChange: (key: string, value: string[]) => void;
    filterKey: string;
    value: string[] | any;
    disabled?: boolean;
}

const DropdownMultiSelect: React.FC<DropdownMultiSelectProps> = ({
    label,
    options,
    onChange,
    filterKey,
    value,
    disabled = false,
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()));

    const toggleOption = (value: string) => {
        if (disabled) return;
        const updatedValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
        setSelectedValues(updatedValues);
        onChange(filterKey, updatedValues);
    };

    const handleRemoveTag = (value: string) => {
        if (disabled) return;
        const updatedValues = selectedValues.filter((v) => v !== value);
        setSelectedValues(updatedValues);
        onChange(filterKey, updatedValues);
    };

    const handleSelectAll = () => {
        if (disabled) return;
        if (selectedValues.length === options.length) {
            setSelectedValues([]);
            onChange(filterKey, []);
        } else {
            const allValues = options.map((o) => o.value);
            setSelectedValues(allValues);
            onChange(filterKey, allValues);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setSelectedValues(value || []);
    }, [value]);

    return (
        <div className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`} ref={dropdownRef}>
            <label className={styles.label}>{label}</label>
            <div
                className={styles.inputWrapper}
                onClick={() => {
                    if (!disabled) {
                        setOpen((prev) => !prev);
                    }
                }}
            >
                {selectedValues.length > 0 ? (
                    <div className={styles.selectedTags}>
                        {selectedValues.map((value) => {
                            const option = options.find((opt) => opt.value === value);
                            return (
                                <span key={value} className={styles.tag}>
                                    {option?.label}
                                    {!disabled && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveTag(value);
                                            }}
                                        >
                                            <RemoveIcon width={16} height={16} color="#0078D7" />
                                        </button>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                ) : (
                    <span className={styles.placeholder}>Seçim edin...</span>
                )}
                <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}>
                    <ArrowDown color="#54595E" />
                </span>
            </div>

            {open && !disabled && (
                <div className={`${styles.dropdown} ${open ? styles.open : ''}`}>
                    <div className={styles.header}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Axtar..."
                            className={styles.selectInput}
                        />
                        <button className={styles.selectAllBtn} onClick={handleSelectAll}>
                            Hamısı
                        </button>
                    </div>
                    <div className={styles.options}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <label key={opt.value} className={styles.option}>
                                    <input
                                        type="checkbox"
                                        checked={selectedValues.includes(opt.value)}
                                        onChange={() => toggleOption(opt.value)}
                                    />
                                    {opt.label}
                                </label>
                            ))
                        ) : (
                            <div className={styles.noResult}>Heç bir nəticə tapılmadı</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownMultiSelect;
