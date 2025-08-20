import { FC, FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';

import { Combobox, ComboboxRootProps, createListCollection, useCombobox } from '@ark-ui/react/combobox';
import { Portal } from '@ark-ui/react/portal';

import { DirectionDownIcon, FilterXmarkIcon, RemoveIcon } from '@/shared/icons';

import S_Checkbox from '../checkbox';
import { InputSize } from '../input';
import styles from './select.module.css';

export type I_CollectionItem = {
    label: string;
    disabled?: boolean;
    value: string | number | boolean;
};

type I_SelectVariant = 'default' | 'checkbox';

interface I_SelectSimpleProps
    extends Omit<ComboboxRootProps<I_CollectionItem>, 'items' | 'collection' | 'value' | 'onChange'> {
    items?: any;
    loadingStatus?: 'pending' | 'success' | 'error';
    label?: string;
    selectItemsLabel?: string;
    variant?: I_SelectVariant;
    onChange?: (selectedItems: I_CollectionItem[]) => void;
    selectedItems?: any;
    size?: InputSize;
    className?: string;
    disabled?: boolean;
    errorText?: string;
    value: any;
}

const transformItems = (items: I_CollectionItem[]) =>
    items.map((item) => ({ ...item, value: JSON.stringify(item.value) }));
const parseTransformedItems = (items: string[]): I_CollectionItem[] => items.map((item) => JSON.parse(item));

const S_Select: FC<I_SelectSimpleProps> = ({
    label,
    loadingStatus,
    variant = 'default',
    items,
    selectItemsLabel,
    selectedItems,
    multiple,
    errorText,
    onChange,
    size = 'medium',
    onInputValueChange,
    placeholder,
    value,
    className,
    ...props
}) => {
    const [filteredItems, setFilteredItems] = useState(items);
    const collection = useMemo(() => createListCollection({ items: transformItems(filteredItems) }), [filteredItems]);

    const onClickOutside = () => {
        if (filteredItems.length !== items.length) {
            setFilteredItems(items);
        }
    };

    const combobox = useCombobox({
        collection,
        multiple,
        onFocusOutside: onClickOutside,
        onInteractOutside: onClickOutside,
        closeOnSelect: !Boolean(multiple),
    });

    const handleValueChange = (newValue: string[]) => {
        const selectedItems = parseTransformedItems(newValue);
        if (onChange) {
            onChange(selectedItems);
        }
        combobox.setValue(newValue); // `setValue` hər dəfə sinxron olsun
    };

    useEffect(() => {
        if (JSON.stringify(parseTransformedItems(combobox.value)) !== JSON.stringify(selectedItems)) {
            handleValueChange(combobox.value);
            !onInputValueChange && setFilteredItems(items);
        }
    }, [combobox.value]);

    useEffect(() => {
        if (selectedItems) {
            const newValues = Array.isArray(selectedItems)
                ? selectedItems.map((item: any) => JSON.stringify(item))
                : [JSON.stringify(selectedItems)]; // <-- Əgər tək obyektdirsə, array-ə çeviririk

            if (!combobox.value.length || !combobox.value.every((v) => newValues.includes(v))) {
                combobox.setValue(newValues);
            }
        }
    }, [selectedItems]);

    useEffect(() => {
        setFilteredItems(items);
    }, [items, selectedItems]); // <-- `selectedItems` əlavə olundu ki, filtrdə problem olmasın

    const removeValue = (value: I_CollectionItem) => {
        const newValue = combobox.value?.filter((v) => v !== JSON.stringify(value));
        combobox.setValue(newValue);
    };

    const openSelect = () => {
        if (!combobox.open) {
            combobox.setOpen(true);
        }
    };

    const renderItem = (item: I_CollectionItem): Record<I_SelectVariant, ReactNode> => ({
        default: <Combobox.ItemText>{item.label}</Combobox.ItemText>,
        checkbox: (
            <S_Checkbox
                checked={Boolean(combobox.value.find((v) => v === JSON.stringify(item)))}
                color="primary-blue"
                label={item.label}
                disabled={item.disabled}
            />
        ),
    });

    const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value || '';
        //@ts-ignore
        onInputValueChange?.(value);
        setFilteredItems(
            value.trim() === ''
                ? items
                : items.filter((item: any) => item.label.toLowerCase().includes(value.toLowerCase()))
        );
    };
    const onClickRoot = () => {
        if (!combobox.focused) {
            combobox.focus();
        }
    };

    return (
        <Combobox.RootProvider
            className={`${styles.select} ${className || ''}`}
            data-size={size}
            value={combobox}
            onClick={onClickRoot}
        >
            {label && <Combobox.Label>{label}</Combobox.Label>}
            <Combobox.Control data-error={!!errorText}>
                <div className={styles.selectMainContent}>
                    {multiple &&
                        combobox?.value?.map((selectedValueString) => {
                            const selectedValue = JSON.parse(selectedValueString) as I_CollectionItem;
                            return (
                                <span key={selectedValue.label} className={styles.selectedMultipleValue}>
                                    {selectedValue.label}
                                    <button onClick={() => removeValue(selectedValue)}>
                                        <RemoveIcon />
                                    </button>
                                </span>
                            );
                        })}
                    <Combobox.Input onClick={openSelect} onInput={handleInputChange} placeholder={placeholder} />
                </div>
                <div className={styles.selectSideIcons}>
                    <Combobox.ClearTrigger
                        onClick={() => {
                            combobox.setValue([]);
                            setFilteredItems(items);
                            onChange?.([]); // <-- Əlavə et: formData da sıfırlansın
                        }}
                    >
                        <FilterXmarkIcon />
                    </Combobox.ClearTrigger>

                    <Combobox.Trigger>
                        <DirectionDownIcon />
                    </Combobox.Trigger>
                </div>
            </Combobox.Control>
            <select
                name={props.name}
                multiple={multiple}
                value={multiple ? combobox.value || [] : combobox.value?.[0] || '' || combobox.value[0]}
                style={{ display: 'none' }}
                onChange={() => {}}
            >
                {combobox.value?.map((selectedValue) => (
                    <option key={selectedValue} value={selectedValue}>
                        {selectedValue}
                    </option>
                ))}
            </select>

            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content className={styles.selectContent} data-size={size}>
                        <Combobox.ItemGroup>
                            {selectItemsLabel && <Combobox.ItemGroupLabel>{selectItemsLabel}</Combobox.ItemGroupLabel>}
                            {loadingStatus === 'pending' && <>Loading...</>}
                            {loadingStatus === 'success' &&
                                collection.items.map((item, idx) => (
                                    <Combobox.Item key={typeof item.value !== 'boolean' ? item.value : idx} item={item}>
                                        {renderItem(item)[variant]}
                                    </Combobox.Item>
                                ))}
                        </Combobox.ItemGroup>
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
            {errorText && <p className={styles.errorText}>{errorText}</p>}
        </Combobox.RootProvider>
    );
};

export default S_Select;
