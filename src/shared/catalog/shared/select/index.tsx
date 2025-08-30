import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import * as Popover from '@radix-ui/react-popover';

import { CloseIcon, DirectionDownIcon, DirectionUpIcon, SearchIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import { S_Button, S_Checkbox, S_Input } from '@/ui';
import S_Chips from '@/ui/chips';

import styles from './select.module.css';

type Size = '52' | '48' | '44' | '36';

export type CatalogSelectProps<T> = {
    items: T[];
    getKey: (item: T) => string;
    getLabel: (item: T) => string;
    multiple?: boolean;
    selected: T[] | T | null;
    placeholder?: string;
    onChange: (selection: T[] | T | null) => void;
    onViewAll?: () => void;
    showMore?: boolean;
    label?: string;
    description?: string;
    disabled?: boolean;
    state: 'success' | 'error' | 'default';
    size?: Size;
};

export function CatalogSelect<T>({
    items,
    getKey,
    getLabel,
    multiple = false,
    selected,
    placeholder = 'Seçin',
    onChange,
    onViewAll,
    showMore = false,
    label,
    description,
    disabled = false,
    state = 'default',
    size = '36',
}: CatalogSelectProps<T>) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [dropdownWidth, setDropdownWidth] = useState(0);

    const selectedArray: T[] = multiple ? (Array.isArray(selected) ? selected : selected ? [selected] : []) : [];
    const [visibleCount, setVisibleCount] = useState(selectedArray.length || 1);
    const overflowCount = multiple ? selectedArray.length - visibleCount : 0;

    const containerRef = useRef<HTMLButtonElement>(null);
    const measureRefs = useRef<Array<HTMLDivElement | null>>([]);

    // Filter items based on search
    const filtered = items.filter(
        (i) => !search.trim() || getLabel(i).toLowerCase().includes(search.trim().toLowerCase())
    );

    const toggleItem = useCallback(
        (item: T) => {
            if (!multiple) {
                onChange(item);
                setOpen(false);
                return;
            }
            const exists = selectedArray.some((i) => getKey(i) === getKey(item));
            onChange(exists ? selectedArray.filter((i) => getKey(i) !== getKey(item)) : [...selectedArray, item]);
        },
        [multiple, selectedArray, getKey, onChange]
    );

    const clearSelection = () => onChange(multiple ? [] : null);

    // Remove overflowed items (beyond visibleCount)
    const removeOverflow = () => {
        onChange(selectedArray.slice(0, visibleCount));
    };

    // Hidden offscreen measurement container
    useLayoutEffect(() => {
        if (!multiple || !containerRef.current) return;
        const containerWidth = containerRef.current.clientWidth - 52;
        let used = 0;
        let count = 0;

        measureRefs.current.forEach((el) => {
            if (!el) return;
            const w = el.clientWidth;
            if (used + w + 16 <= containerWidth) {
                used += w + 16 + 8; // gap
                count++;
            }
        });

        setVisibleCount(count || 1);
    }, [selectedArray, multiple]);

    const handleResize = useCallback(() => {
        if (containerRef.current) {
            setDropdownWidth(containerRef.current.clientWidth);
        }
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            setDropdownWidth(containerRef.current.clientWidth);
        }
    }, [containerRef.current]);

    useEffect(() => {
        handleResize(); // Initial measurement
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    let isCompleted = false;
    if (multiple) {
        isCompleted = selectedArray.length > 0;
    } else {
        isCompleted = Boolean(selected);
    }

    const triggerClassName = cls(
        styles.trigger,
        open && styles.open,
        disabled && styles.disabled,
        isCompleted && styles.completed,
        styles[`size-${size}`],
        disabled && styles.disabled,
        styles[`state-${state}`]
    );

    return (
        <div className={styles.wrapper}>
            {label && <label className={cls(styles.label, disabled && styles.disabled)}>{label}</label>}

            <div
                style={{
                    position: 'absolute',
                    visibility: 'hidden',
                    height: 2,
                    width: '100%',
                    overflow: 'hidden',
                    left: 0,
                    top: 0,
                    backgroundColor: 'red',
                    display: 'flex',
                    gap: 4,
                }}
            >
                {selectedArray.map((item, idx) => (
                    <div ref={(el) => (measureRefs.current[idx] = el)} key={getKey(item)}>
                        <S_Chips label={getLabel(item)} type="outlined-fill" />
                    </div>
                ))}
            </div>

            <Popover.Root open={open} onOpenChange={setOpen}>
                <Popover.Trigger asChild>
                    <button ref={containerRef} className={triggerClassName}>
                        {multiple ? (
                            selectedArray.length > 0 ? (
                                <div className={styles.selectChips}>
                                    {selectedArray.slice(0, visibleCount).map((item, idx) => (
                                        <S_Chips
                                            key={getKey(item)}
                                            label={getLabel(item)}
                                            type="outlined-fill"
                                            onRightIconClick={(e) => {
                                                e.stopPropagation();
                                                toggleItem(item);
                                            }}
                                        />
                                    ))}
                                    {overflowCount > 0 && (
                                        <S_Chips
                                            label={`+${overflowCount}`}
                                            type="outlined-fill"
                                            onRightIconClick={(e) => {
                                                e.stopPropagation();
                                                removeOverflow();
                                            }}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className={styles.placeholder}>{placeholder}</div>
                            )
                        ) : selected && !Array.isArray(selected) ? (
                            <div className={styles.placeholder}>{getLabel(selected)}</div>
                        ) : (
                            <div className={styles.placeholder}>{placeholder}</div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {(multiple ? selectedArray.length > 0 : selected) && (
                                <CloseIcon className={styles.closeIcon} onClick={clearSelection} />
                            )}
                            {open ? <DirectionUpIcon /> : <DirectionDownIcon />}
                        </div>
                    </button>
                </Popover.Trigger>

                <Popover.Content
                    sideOffset={4}
                    align="start"
                    className={styles.dropdown}
                    style={{ width: dropdownWidth }}
                >
                    <div className={styles.searchHeader}>
                        <div className={styles.searchBox}>
                            <S_Input
                                autoFocus
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Axtar"
                                icon={<SearchIcon width={16} height={16} />}
                                iconPosition="right"
                                size="36"
                            />
                        </div>
                        {showMore && (
                            <S_Button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewAll?.();
                                }}
                                variant="primary"
                                color="primary"
                                size="36"
                            >
                                Hamısı
                            </S_Button>
                        )}
                    </div>

                    <div className={styles.optionsList}>
                        {filtered.length > 0 ? (
                            filtered.map((item) => {
                                const key = getKey(item);
                                const label = getLabel(item);
                                const isSelected = multiple
                                    ? selectedArray.some((i) => getKey(i) === key)
                                    : selected !== null && !Array.isArray(selected) && getKey(selected) === key;

                                return multiple ? (
                                    <S_Checkbox
                                        key={key}
                                        checked={isSelected}
                                        onCheckedChange={() => toggleItem(item)}
                                        label={label}
                                        className={cls(styles.selectOption, isSelected && styles.selected)}
                                    />
                                ) : (
                                    <div className={cls(styles.selectOption, isSelected && styles.selected)} key={key}>
                                        <div className={styles.optionLabel} onClick={() => toggleItem(item)}>
                                            {label}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className={styles.noResult}>Tapılmadı</div>
                        )}
                    </div>
                </Popover.Content>
            </Popover.Root>
            {description && <span className={cls(styles.description, disabled && styles.disabled)}>{description}</span>}
        </div>
    );
}
