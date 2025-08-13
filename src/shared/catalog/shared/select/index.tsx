import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import * as Popover from '@radix-ui/react-popover';

import { CloseIcon, DirectionDownIcon, DirectionUpIcon, SearchIcon } from '@/shared/icons';

import { S_Button, S_Checkbox, S_Input } from '@/ui';

import styles from './select.module.css';

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
}: CatalogSelectProps<T>) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [dropdownWidth, setDropdownWidth] = useState(0);

    const selectedArray: T[] = multiple && Array.isArray(selected) ? selected : [];
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
        const containerWidth = containerRef.current.clientWidth - 16;
        const reserve = 42 + 35; // space for clear+arrow icons + (+N) chip width
        let used = 0;
        let count = 0;

        measureRefs.current.forEach((el) => {
            if (!el) return;
            const w = el.getBoundingClientRect().width;
            if (used + w + 16 <= containerWidth - reserve) {
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

    return (
        <>
            {/* label */}
            {label && <label className={styles.selectLabel}>{label}</label>}

            {/* Offscreen measurement */}
            <div style={{ position: 'absolute', visibility: 'hidden', height: 0, overflow: 'hidden' }}>
                {selectedArray.map((item, idx) => (
                    <div key={getKey(item)} ref={(el) => (measureRefs.current[idx] = el)} className={styles.selectChip}>
                        {getLabel(item)}
                    </div>
                ))}
            </div>
            <Popover.Root open={open} onOpenChange={setOpen}>
                <Popover.Trigger asChild>
                    <button
                        ref={containerRef}
                        className={styles.selectTrigger}
                        style={{ borderColor: open ? 'hsl(var(--clr-primary-500))' : 'hsl(var(--clr-grey-300))' }}
                    >
                        <div className={styles.selectChips}>
                            {multiple ? (
                                selectedArray.length > 0 ? (
                                    <>
                                        {selectedArray.map((item, idx) => (
                                            <div
                                                key={getKey(item)}
                                                className={styles.selectChip}
                                                style={{ display: idx < visibleCount ? 'flex' : 'none' }}
                                            >
                                                {getLabel(item)}
                                                <CloseIcon
                                                    className={styles.chipCloseIcon}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleItem(item);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                        {overflowCount > 0 && (
                                            <div className={styles.selectChip}>
                                                +{overflowCount}
                                                <CloseIcon
                                                    className={styles.chipCloseIcon}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeOverflow();
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <span className={styles.placeholder}>{placeholder}</span>
                                )
                            ) : selected && !Array.isArray(selected) ? (
                                <span className={styles.placeholder}>{getLabel(selected)}</span>
                            ) : (
                                <span className={styles.placeholder}>{placeholder}</span>
                            )}
                        </div>
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
                    className={styles.dropdownContent}
                    style={{ width: dropdownWidth }}
                >
                    <div className={styles.searchHeader}>
                        <S_Input
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Axtar"
                            icon={<SearchIcon width={20} height={20} style={{ marginLeft: 2 }} />}
                            iconPosition="left"
                        />
                        {showMore && (
                            <S_Button
                                type="button"
                                className="!py-1.5"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewAll?.();
                                }}
                                variant="main-10"
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

                                return (
                                    <div key={key} className={styles.selectOption}>
                                        {multiple ? (
                                            <S_Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => toggleItem(item)}
                                                label={label}
                                            />
                                        ) : (
                                            <div className={styles.optionLabel} onClick={() => toggleItem(item)}>
                                                {label}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className={styles.noResult}>Tapılmadı</div>
                        )}
                    </div>
                </Popover.Content>
            </Popover.Root>
        </>
    );
}
