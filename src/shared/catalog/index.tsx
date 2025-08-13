import { useState } from 'react';

import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';

import { CustomMRTColumn } from '../table';
import CatalogViewAllDialog from './CatalogViewAllDialog';
import { CatalogSelect } from './shared/select';

// Preset modal sizes matching design tokens
export const PRESET_SIZES = {
    'md-lg': { maxWidth: 900, height: 700 }, // Balanced standard – ideal for tables
    lg: { maxWidth: 960, height: 600 }, // Wider but a bit shorter – light content
    xl: { maxWidth: 1200, height: 720 }, // Rich content, multi-column tables
    xxl: { maxWidth: 1400, height: 800 }, // Complex interfaces, filters + table
} as const;

export type PresetSize = keyof typeof PRESET_SIZES;

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
}

export function Catalog<T extends MRT_RowData>({
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
}: CatalogProps<T>) {
    const [open, setOpen] = useState(false);

    const handleSelect = (newValue: T | T[] | null) => {
        onChange(newValue);
    };

    const paperStyle = PRESET_SIZES[sizePreset];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {/* Compact select-like Autocomplete */}
            <CatalogSelect
                items={items}
                getKey={(p) => getRowId(p)}
                getLabel={(p) => getLabel(p)}
                multiple={multiple} // or false for single-select
                selected={multiple ? value : value[0]}
                onChange={handleSelect}
                placeholder="Seçin məhsul"
                onViewAll={() => setOpen(true)}
                showMore={enableModal}
            />

            {enableModal && (
                <CatalogViewAllDialog
                    open={open}
                    setOpen={setOpen}
                    items={items}
                    getLabel={getLabel}
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

export default Catalog;
