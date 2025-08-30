import { useState } from 'react';

import { MRT_RowData } from 'material-react-table';

import { CustomMRTColumn } from '../table';
import CatalogViewAllDialog from './CatalogViewAllDialog';
import { CatalogSelect, CatalogSelectProps } from './shared/select';

// Preset modal sizes matching design tokens
export const PRESET_SIZES = {
    'md-lg': { maxWidth: 900, height: 700 }, // Balanced standard – ideal for tables
    lg: { maxWidth: 960, height: 600 }, // Wider but a bit shorter – light content
    xl: { maxWidth: 1200, height: 720 }, // Rich content, multi-column tables
    xxl: { maxWidth: 1400, height: 800 }, // Complex interfaces, filters + table
} as const;

export type PresetSize = keyof typeof PRESET_SIZES;

type SelectPassThroughProps<T> = Partial<
    Omit<
        CatalogSelectProps<T>,
        'items' | 'getKey' | 'getLabel' | 'multiple' | 'selected' | 'onChange' | 'onViewAll' | 'showMore'
    >
>;

export interface CatalogProps<T extends MRT_RowData> {
    /** Full dataset to display */
    items: T[];
    /** Display label extractor */
    getLabel: (item: T) => string;
    /** Unique ID extractor for each row */
    getRowId: (item: T) => string;
    /** Selected value */
    value: T[];
    /** Called when selection changes */
    onChange: (selected: T | T[] | null) => void;
    /** Single- or multi-select mode */
    multiple?: boolean;
    /** Enable the "View All" modal */
    enableModal?: boolean;
    /** Choose one of the preset modal sizes */
    sizePreset?: PresetSize;
    /** Shown columns in modal table  */
    showMoreColumns?: CustomMRTColumn<T>[];
    /** Count of total items in table  */
    totalItemCount: number;
    /** Callback to refetch data when modal opens */
    onRefetch?: () => void;
    /** Callback to click new button in table header  */
    onClickNew?: () => void;
    /** Loading state for the catalog */
    isLoading?: boolean;
    /** Label for the catalog */
    label?: string;
    /** Title shown as default placeholder (unless overridden) */
    title?: string;

    /** Extra props to pass through to the underlying CatalogSelect */
    selectProps?: SelectPassThroughProps<T>;
}

export default function Catalog<T extends MRT_RowData>(props: CatalogProps<T>) {
    const {
        items,
        getLabel,
        getRowId,
        value,
        onChange,
        multiple = false,
        enableModal = true,
        sizePreset = 'md-lg',
        showMoreColumns,
        totalItemCount,
        onRefetch,
        onClickNew,
        isLoading,
        label,
        title,
        selectProps,
    } = props;

    const [open, setOpen] = useState(false);

    const handleSelect = (newValue: T | T[] | null) => onChange(newValue);
    const paperStyle = PRESET_SIZES[sizePreset];

    const {
        placeholder: placeholderFromParent,
        state: stateFromParent,
        ...restSelectProps
    } = (selectProps ?? {}) as SelectPassThroughProps<T>;

    const computedState: NonNullable<CatalogSelectProps<T>['state']> = stateFromParent ?? 'default';

    const placeholder = placeholderFromParent ?? title ?? 'Seçin';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <CatalogSelect<T>
                items={items}
                getKey={(p) => getRowId(p)}
                getLabel={(p) => getLabel(p)}
                multiple={multiple}
                selected={multiple ? value : value.length > 0 ? value[0] : null}
                onChange={handleSelect}
                placeholder={placeholder}
                state={computedState}
                onViewAll={() => setOpen(true)}
                showMore={enableModal}
                label={label}
                {...restSelectProps}
            />

            {enableModal && (
                <CatalogViewAllDialog
                    open={open}
                    setOpen={setOpen}
                    items={items}
                    getRowId={getRowId}
                    value={value}
                    multiple={multiple}
                    handleSelect={handleSelect}
                    paperStyle={paperStyle}
                    sizePreset={sizePreset}
                    showMoreColumns={showMoreColumns}
                    totalItemCount={totalItemCount}
                    onRefetch={onRefetch}
                    onClickNew={onClickNew}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
