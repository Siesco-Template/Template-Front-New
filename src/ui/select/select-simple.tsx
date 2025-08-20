import { FC, ReactNode, useLayoutEffect, useRef, useState } from 'react';

import { Portal } from '@ark-ui/react/portal';
import { Select, createListCollection } from '@ark-ui/react/select';

import { DirectionDownIcon, FilterXmarkIcon, SearchIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import S_Input from '../input';
import styles from './select.module.css';

export interface Item {
    label: string;
    value: string;
    disabled?: boolean;
    show?: boolean;
}

interface I_Select_SimpleProps {
    items: Item[];
    value?: string[];
    setSelectedItems: (selected: Item[]) => void;
    placeholder?: string;
    label?: ReactNode;
    description?: string;
    error?: string;
    clearButton?: boolean;
    itemGroupLabel?: ReactNode;
    itemsContentMinWidth?: number | string;
    itemsContentMaxWidth?: number | string;
    showSearch?: boolean;
    disabled?: boolean;
    iconStyle?: string;
    name?: string;
}

const S_Select_Simple: FC<I_Select_SimpleProps> = ({
    items,
    value,
    setSelectedItems,
    placeholder,
    label,
    description,
    error,
    clearButton,
    itemGroupLabel,
    itemsContentMinWidth = '100px',
    itemsContentMaxWidth,
    showSearch = false,
    disabled = false,
    iconStyle,
    name,
}) => {
    const [filter, setFilter] = useState('');
    const hasResult = useRef(false);

    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined);

    useLayoutEffect(() => {
        const el = triggerRef.current;
        if (!el) return;

        const setWidth = () => setTriggerWidth(el.offsetWidth);
        setWidth();

        const ro = new ResizeObserver(setWidth);
        ro.observe(el);
        window.addEventListener('resize', setWidth);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', setWidth);
        };
    }, []);

    const filteredItems = items.map((item) => {
        if (item.label.toLowerCase().includes(filter.toLowerCase())) {
            hasResult.current = true;
            return { ...item, show: true };
        }

        return { ...item, show: false };
    });

    const collection = createListCollection<Item>({ items: filteredItems });

    // console.log(items.find((i) => i.value === value[0])?.label === 'Seçin');

    return (
        <Select.Root
            collection={collection}
            value={value}
            onValueChange={(e) => setSelectedItems(e.items)}
            onOpenChange={(open) => open || setFilter('')}
            className={styles.selectSimple}
            disabled={disabled}
        >
            {label && <Select.Label className={styles.label}>{label}</Select.Label>}

            <Select.Control className={styles.control}>
                <Select.Trigger ref={triggerRef} className={styles.trigger} data-invalid={!!error ? 'true' : undefined}>
                    <Select.ValueText
                        className={cls(
                            styles.value,
                            !value ||
                                value.length === 0 ||
                                value[0] === '' ||
                                items.find((i) => i.value === value[0])?.label === 'Seçin'
                                ? styles.placeholderGrey
                                : styles.valueBlack
                        )}
                        placeholder={placeholder}
                    />
                    <Select.Indicator>
                        <DirectionDownIcon className={cls(styles.arrowIcon, iconStyle)} />
                    </Select.Indicator>
                </Select.Trigger>

                {clearButton && (
                    <Select.ClearTrigger className={styles.clearTrigger}>
                        <FilterXmarkIcon />
                    </Select.ClearTrigger>
                )}
            </Select.Control>

            {error ? (
                <div className={styles.descriptionError}>{error}</div>
            ) : description ? (
                <div className={styles.description}>{description}</div>
            ) : null}

            <Portal>
                <Select.Positioner>
                    <Select.Content
                        className={styles.selectSimpleContent}
                        style={{ minWidth: itemsContentMinWidth, maxWidth: itemsContentMaxWidth, width: triggerWidth }}
                    >
                        {showSearch && (
                            <div className={styles.searchContainer}>
                                <S_Input
                                    type="text"
                                    placeholder="Search…"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                        if (e.code === 'Space') {
                                            e.stopPropagation();
                                        }
                                    }}
                                    iconPosition="right"
                                    icon={<SearchIcon width={15} height={15} />}
                                />
                            </div>
                        )}

                        <Select.ItemGroup className={styles.itemGroup}>
                            {itemGroupLabel && <Select.ItemGroupLabel>{itemGroupLabel}</Select.ItemGroupLabel>}
                            {collection.items.map(
                                (item) =>
                                    item.show && (
                                        <Select.Item key={item.value} item={item} className={styles.item}>
                                            <Select.ItemText>{item.label}</Select.ItemText>
                                        </Select.Item>
                                    )
                            )}
                            {!collection.items.some((item) => item.show) && (
                                <div className={styles.noResult}>Nəticə tapılmadı</div>
                            )}
                        </Select.ItemGroup>
                    </Select.Content>
                </Select.Positioner>
            </Portal>

            <Select.HiddenSelect />
        </Select.Root>
    );
};

export default S_Select_Simple;
