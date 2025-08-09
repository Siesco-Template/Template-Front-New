import { useEffect, useRef, useState } from 'react';

// import CheckIcon from '@assets/icons/CheckIcon';
// import DownArrow from '@assets/icons/DownArrow';
// import UnCheckIcon from '@assets/icons/UnCheckIcon';

import styles from './SelectComponent.module.css';

interface DomainOption {
    label: string;
    value: string;
}

interface DomainSelectProps {
    options: DomainOption[];
    onSelectionChange: (selectedId: string) => void;
    value?: string;
    error?: string;
    clearError?: () => void;
    label: string;
    disabled?: boolean;
    className: string;
    name: string;
    placeholder?: string;
}

const SelectComponent: React.FC<DomainSelectProps> = ({
    options = [],
    onSelectionChange,
    value,
    error,
    clearError,
    label,
    name,
    className,
    disabled = false,
    placeholder = '',
}) => {
    const [selectedDomainId, setSelectedDomainId] = useState<string>(value || '');
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) {
            setSelectedDomainId(value);
        }
    }, [value]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (selectedDomainId && clearError) {
            clearError();
        }
    }, [selectedDomainId, clearError]);

    const handleSelect = (selectedId: string) => {
        if (selectedDomainId !== selectedId) {
            setSelectedDomainId(selectedId);
            onSelectionChange(selectedId);
            setIsOpen(false);
        }
    };

    const handleToggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className={styles.selectContainer}>
            <div className={styles.inputContainer} ref={dropdownRef}>
                <label>{label}</label>
                <div
                    className={`${styles.customSelect} ${error ? styles.errorSelect : ''}`}
                    onClick={handleToggleDropdown}
                    aria-expanded={isOpen}
                    aria-controls="dropdown-list"
                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                >
                    <span>
                        {selectedDomainId
                            ? options
                                  .filter((option) => option.value === selectedDomainId)
                                  .map((option) => option.label)
                                  .join(', ')
                            : placeholder}
                    </span>
                    <div className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
                        {/* <DownArrow size="20px" /> */}x
                    </div>
                </div>

                {isOpen && (
                    <div className={styles.dropdown} id="dropdown-list" role="listbox" aria-labelledby="dropdown-label">
                        <div className={styles.optionsList}>
                            {options.length > 0 ? (
                                options.map((option) => (
                                    <div
                                        key={option.value}
                                        className={`${styles.option} ${
                                            selectedDomainId === option.value ? styles.selected : ''
                                        }`}
                                        onClick={() => handleSelect(option.value)}
                                        role="option"
                                        aria-selected={selectedDomainId === option.value}
                                    >
                                        <p className={styles.checks}>
                                            {
                                                selectedDomainId === option.value
                                                    ? 1 // <CheckIcon size="24px" />;
                                                    : 2 // <UnCheckIcon size="24px" />
                                            }
                                        </p>
                                        {option.label}
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noResult}>tapilmadi</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectComponent;
