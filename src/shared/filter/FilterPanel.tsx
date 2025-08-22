import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router';

import dayjs from 'dayjs';

import { filterService } from '@/services/filter/filter.service';

import { S_Input } from '@/ui';
import S_Select_Simple, { Item } from '@/ui/select/select-simple';

import Catalog from '../catalog';
import { CatalogSelect } from '../catalog/shared/select';
import { useTableContext } from '../table/table-context';
import { useDebounce } from '../table/useDebounce';
import { applyFiltersToUrl, parseFiltersFromUrl } from './config/filterHelpers';
import { FilterKey } from './config/filterTypeEnum';
import DropdownMultiSelect from './filters/CatalogWithMultiSelect';
import DateIntervalFilter from './filters/DateIntervalFilter';
import DraggableItems from './filters/Draggable';
import NumberIntervalFilter from './filters/NumberIntervalFilter';
import SavedFilters from './filters/SavedFilters';
import TextFilter from './filters/TextFilter';
import FilterHeader from './layout/filterHeader';
import Header from './layout/header';
import SearchHeader from './layout/searchHeader';
import Button from './shared/button';
import ConfirmModal from './shared/modal';
import styles from './styles/filter.module.css';
import { FilterConfig } from './types';

interface FilterPanelProps {
    filters: FilterConfig[];
    onChange: (key: string, value: any) => void;
    storageKey: string;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
    table_key: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, storageKey, table_key, isCollapsed }) => {
    const [activeTab, setActiveTab] = useState<'default' | 'saved'>('default');
    const [savedFilters, setSavedFilters] = useState<FilterConfig[]>([]);
    const [sortMode, setSortMode] = useState(false);
    const [searchText, setSearchText] = useState<string>('');
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [filterName, setFilterName] = useState('');

    const location = useLocation();
    const selectRef = useRef<HTMLDivElement | null>(null);
    const [mainWidth, setMainWidth] = useState<string>('200px');

    const [defaultSnapshot, setDefaultSnapshot] = useState<FilterConfig[] | null>(null);
    const [hasDefault, setHasDefault] = useState(false);

    const handleResize = () => {
        if (selectRef.current) {
            const width = selectRef.current.offsetWidth - 20;
            setMainWidth(`${width}px`);
        }
    };

    useDebounce(mainWidth, 200, handleResize);
    useEffect(() => {
        handleResize();
    }, []);

    const { filterDataState } = useTableContext();

    useEffect(() => {
        const orderKey = `filter_order_${storageKey}`;
        const visibilityKey = `filter_visibility_${storageKey}`;

        const savedOrder = JSON.parse(localStorage.getItem(orderKey) || '[]');
        const visibilityMap = JSON.parse(localStorage.getItem(visibilityKey) || '{}');

        let updated: any = filters.map((f: any) => ({
            ...f,
            visible: visibilityMap[f.key] ?? true,
        }));

        if (savedOrder.length > 0) {
            updated = [
                ...savedOrder.map((k: any) => updated.find((f: any) => f.key === k)).filter(Boolean),
            ] as FilterConfig[];
        }

        setSavedFilters(updated);
    }, [filters, storageKey]);

    useEffect(() => {
        if (filters.length === 0) return;

        const initFilters = async () => {
            const qs = window.location.hash.split('?')[1] || '';
            const params = new URLSearchParams(qs);
            const hasUrl = params.has('filterData');

            // 1) HƏR HALDA default-u al və snapshot kimi yadda saxla
            try {
                const res = await filterService.getDefaultFilter(table_key);
                const defVals = Array.isArray(res?.filterValues) ? res.filterValues : [];

                const mergedDefault = filters.map((f) => {
                    const df = defVals.find((d: any) => d.column === (f.key || f.column));
                    return {
                        ...f,
                        value:
                            df?.value ??
                            (f.type === 'number-interval'
                                ? { min: '', max: '' }
                                : f.type === 'date-interval'
                                  ? ['', '']
                                  : f.type === 'multi-select'
                                    ? []
                                    : ''),
                    };
                });

                // default snapshot + flag
                setDefaultSnapshot(mergedDefault);
                setHasDefault(defVals.length > 0);
            } catch {
                setDefaultSnapshot(null);
                setHasDefault(false);
            }

            // 2) UI/URL doldurma məntiqi
            if (hasUrl) {
                const fromUrl = parseFiltersFromUrl(filters);
                setSavedFilters(fromUrl);
                fromUrl.forEach((f: any) => onChange(f.key, f.value));
            } else {
                // sənin mövcud default-u UI+URL-ə yazma məntiqin (dəyişmədən qalsın)
                try {
                    const res = await filterService.getDefaultFilter(table_key);
                    const defVals = Array.isArray(res.filterValues) ? res.filterValues : [];
                    const merged = filters.map((f) => {
                        const df = defVals.find((d: any) => d.column === (f.key || f.column));
                        return { ...f, value: df?.value ?? f.value };
                    });

                    setSavedFilters(merged);
                    merged.forEach((f: any) => onChange(f.key, f.value));

                    const cleaned = merged
                        .filter(
                            (f) =>
                                f.value != null &&
                                !(typeof f.value === 'string' && f.value.trim() === '') &&
                                !(Array.isArray(f.value) && f.value.length === 0)
                        )
                        .map((f) => ({ id: f.key || f.column, value: f.value }));

                    applyFiltersToUrl(cleaned, filterDataState.skip, filterDataState.take, filterDataState.sort);
                } catch {
                    setSavedFilters(filters);
                }
            }
        };

        initFilters();
    }, [filters, table_key]);

    const isEmpty = (v: any) =>
        v == null ||
        (typeof v === 'string' && v.trim() === '') ||
        (Array.isArray(v) && v.length === 0) ||
        (typeof v === 'object' && 'min' in v && 'max' in v && v.min === '' && v.max === '');

    const handleResetFilters = () => {
        setSearchText('');

        if (hasDefault && defaultSnapshot) {
            // 1) UI-da yalnız default dəyərləri tətbiq et
            setSavedFilters(defaultSnapshot);
            defaultSnapshot.forEach((f: any) => onChange(f.key, f.value));

            // 2) URL-ə də yalnız default dəyərləri yaz
            const cleanedDefaults = defaultSnapshot
                .filter((f) => !isEmpty(f.value))
                .map((f) => ({ id: f.key || f.column, value: f.value }));

            applyFiltersToUrl(cleanedDefaults, filterDataState.skip, filterDataState.take, filterDataState.sort);
            return;
        }

        const resetFilters = filters.map((f) => {
            let resetValue: any = '';
            if (f.type === 'number-interval') resetValue = { min: '', max: '' };
            else if (f.type === 'date-interval') resetValue = ['', ''];
            else if (f.type === 'multi-select') resetValue = [];
            return { ...f, value: resetValue };
        });

        setSavedFilters(resetFilters);
        resetFilters.forEach((f: any) => onChange(f.key, f.value));

        const base = window.location.hash.split('?')[0];
        window.location.hash = base;
    };

    const handleUpdateFilter = (key: string, value: any) => {
        console.log(key, value, 'handleUpdateFilter');
        const updatedFilters = savedFilters.map((f) => (f.key === key ? { ...f, value } : f));
        setSavedFilters(updatedFilters);
        onChange(key, value);
    };

    const renderFilter = (filter: any) => {
        const _onChange = filter.onChange || ((key: string, value: any) => handleUpdateFilter(key, value));
        switch (filter.type || filter.filterKey) {
            case FilterKey.Text: // 1
                const v = typeof filter.value === 'string' ? filter.value : '';
                return (
                    <div style={{ width: '100%' }}>
                        <S_Input
                            key={filter.key || filter.column}
                            label={filter.label || filter.column}
                            value={v}
                            placeholder={filter.placeholder || filter.column}
                            onChange={(e) => _onChange(filter.key, e.target.value)}
                            readOnly={filter.readOnly}
                            inputSize="medium"
                            style={{ width: '100%' }}
                        />
                    </div>
                );
            case FilterKey.NumberInterval: // 3
                return (
                    <NumberIntervalFilter
                        key={filter.key || filter.column}
                        label={filter.label || filter.column}
                        value={filter.value || { min: '', max: '' }}
                        onChange={(val) => _onChange(filter.key, val)}
                        readOnly={filter.readOnly}
                        placeholder={filter.placeholder || filter.column}
                    />
                );
            case FilterKey.MultiSelect: // 5
                return (
                    <DropdownMultiSelect
                        key={filter.key}
                        label={filter.label}
                        filterKey={filter.key}
                        options={filter.options || []}
                        value={filter.value || []}
                        onChange={(key, values) => _onChange(key, values)}
                        disabled={filter.readOnly}
                    />
                );
            case FilterKey.Select: // 4
                console.log(filter.options, 'items in renderFilter');
                const items = (filter.options || []).map((opt: any) => ({
                    value: opt.value,
                    label: opt.label,
                    disabled: !!opt.disabled,
                }));

                const selectedObj =
                    filter.value != null && filter.value !== ''
                        ? (items.find((i: any) => i.value === filter.value) ?? null)
                        : null;

                // console.log(filter, 'filter in renderFilter');

                return (
                    <Catalog
                        key={filter.key}
                        items={items}
                        getLabel={(i: any) => i?.label}
                        getRowId={(i: any) => String(i?.value)}
                        value={selectedObj ? [selectedObj] : []}
                        onChange={(sel) => {
                            const picked = Array.isArray(sel) ? sel[0] : sel;
                            const newVal = picked ? (picked as any).value : '';
                            _onChange(filter.key, newVal);
                        }}
                        multiple={false}
                        enableModal={false}
                        sizePreset="md-lg"
                        totalItemCount={items.length}
                        onRefetch={undefined}
                        onClickNew={undefined}
                        isLoading={false}
                        label={filter.label}
                        showMoreColumns={filter.showMoreColumns || []}
                    />
                );

            case FilterKey.DateInterval: // 7
                return (
                    <DateIntervalFilter
                        key={filter.key}
                        label={filter.label}
                        value={filter.value || ['', '']}
                        onChange={(val) => _onChange(filter.key, val)}
                        readOnly={filter.readOnly}
                        singlePlaceholder={filter.placeholder}
                        rangePlaceholders={filter.rangePlaceholders}
                    />
                );
            default:
                return null;
        }
    };

    const handleSaveSort = () => {
        setSortMode(false);
    };

    const handleSaveCurrentFilters = () => {
        setIsSaveModalOpen(true);
    };

    const handleApplySavedFilter = (filters: FilterConfig[]) => {
        const cleanedFilters = filters?.map((f) => ({
            id: f.key || f.column,
            value: f.value,
        }));

        applyFiltersToUrl(cleanedFilters, filterDataState.skip, filterDataState.take, filterDataState.sort);
    };

    const handleApplyFilters = () => {
        const filterItems = savedFilters?.map((f) => ({
            id: f.key || f.column,
            value: f.value,
        }));

        applyFiltersToUrl(filterItems, filterDataState.skip, filterDataState.take, filterDataState.sort);
    };

    const filteredSavedFilters = savedFilters
        .filter((filter) => filter.visible !== false)
        .filter((filter) => {
            const columnMatch = filter?.column?.toLowerCase().includes(searchText?.toLowerCase());
            const labelMatch = filter?.label?.toLowerCase().includes(searchText?.toLowerCase());
            return columnMatch || labelMatch;
        });

    const handleResetOrder = () => {};

    const handleSaveFilter = async (name?: string) => {
        if (!name) return;

        const newFilter: any = {
            tableId: table_key,
            filterTitle: name,
            filterValues: savedFilters
                .map((f: any) => {
                    const value = f.value && f.value.toString().length > 0 ? f.value.toString() : '';

                    if (value !== '') {
                        return {
                            column: f.key,
                            value: value,
                            filterOperation: 1,
                            filterKey: f.type,
                        };
                    }
                    return null;
                })
                .filter((filter: any) => filter !== null),
        };

        try {
            const response = await filterService.createFilter(newFilter);
            toast.success('Filter uğurla yaradıldı');

            setFilterName('');
            setIsSaveModalOpen(false);
        } catch (error) {
            console.error('Filteri yaratmaqda xəta baş verdi:', error);
        }
    };

    const handleSaveAndApplyFilter = async (name?: string) => {
        if (!name) return;

        const newFilter: any = {
            tableId: table_key,
            filterTitle: name,
            filterValues: savedFilters
                .map((f: any) => {
                    const value = f.value;

                    const isEmpty =
                        value === null ||
                        value === undefined ||
                        (typeof value === 'string' && value.trim() === '') ||
                        (Array.isArray(value) && value.length === 0) ||
                        (typeof value === 'object' &&
                            'min' in value &&
                            'max' in value &&
                            value.min === '' &&
                            value.max === '');

                    if (isEmpty) return null;

                    let filterOperation = 1;

                    // Tipə görə operation təyini
                    if (f.type === FilterKey.Text || f.type === 'text') {
                        filterOperation = 3;
                    } else if (f.type === FilterKey.NumberInterval || f.type === 'number-interval') {
                        filterOperation = 11;
                    } else if (f.type === FilterKey.DateInterval || f.type === 'date-interval') {
                        filterOperation = 11;
                    }

                    let formattedValue = value;

                    // Tək tarix daxil olunubsa, +1 gün et
                    if ((f.type === FilterKey.DateInterval || f.type === 'date-interval') && Array.isArray(value)) {
                        const [start, end] = value;

                        if (start && !end) {
                            const nextDay = dayjs(start, 'DD.MM.YYYY').add(1, 'day').format('DD.MM.YYYY');
                            formattedValue = [start, nextDay];
                        } else if (start && end && start === end) {
                            const nextDay = dayjs(start, 'DD.MM.YYYY').add(1, 'day').format('DD.MM.YYYY');
                            formattedValue = [start, nextDay];
                        }
                    }

                    return {
                        column: f.key,
                        value:
                            Array.isArray(formattedValue) ||
                            (typeof formattedValue === 'object' && 'min' in formattedValue)
                                ? formattedValue
                                : formattedValue.toString(),
                        filterOperation,
                        filterKey: f.type,
                    };
                })
                .filter((filter: any) => filter !== null),
        };

        try {
            const response = await filterService.createFilter(newFilter);

            const cleanedFilters = newFilter?.filterValues?.map((f: any) => ({
                id: f.column,
                value: f.value,
            }));

            applyFiltersToUrl(cleanedFilters, filterDataState.skip, filterDataState.take, filterDataState.sort);

            setFilterName('');
            setIsSaveModalOpen(false);
        } catch (error) {
            console.error('Filteri yaratmaqda xəta baş verdi:', error);
        }
    };
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.filterContainer}>
                    <div className={styles.filterContent} ref={selectRef}>
                        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
                        <div className={styles.filterScrollableContent}>
                            {activeTab === 'default' ? (
                                <>
                                    <FilterHeader
                                        onSortClick={() => setSortMode(!sortMode)}
                                        sortMode={sortMode}
                                        onSaveSort={handleSaveSort}
                                        onSaveFilters={handleSaveCurrentFilters}
                                    />
                                    <SearchHeader
                                        onReset={sortMode ? handleResetOrder : handleResetFilters}
                                        onSearchChange={(val) => setSearchText(val)}
                                        searchText={searchText}
                                    />

                                    {sortMode ? (
                                        <DraggableItems
                                            savedFilters={savedFilters}
                                            setSavedFilters={setSavedFilters}
                                            storageKey={storageKey}
                                        />
                                    ) : (
                                        <>
                                            {filteredSavedFilters.map(renderFilter)}
                                            <Button
                                                variant="tertiary"
                                                onClick={handleApplyFilters}
                                                // disabled={!isAnyFilterFilled}
                                            >
                                                Tətbiq et
                                            </Button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <SavedFilters
                                    renderFilter={renderFilter}
                                    onApplyFilter={handleApplySavedFilter}
                                    table_key={table_key}
                                    filters={filters}
                                />
                            )}
                        </div>
                    </div>
                </div>{' '}
            </div>
            <ConfirmModal
                open={isSaveModalOpen}
                onOpenChange={setIsSaveModalOpen}
                onSave={handleSaveFilter}
                onSaveAndUse={handleSaveAndApplyFilter}
                mode="create"
            />
        </>
    );
};

export default FilterPanel;
