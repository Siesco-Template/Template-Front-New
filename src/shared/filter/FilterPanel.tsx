import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router';

import dayjs from 'dayjs';

import { filterService } from '@/services/filter/filter.service';

import { SearchIcon } from '@/shared/icons';

import { S_Input } from '@/ui';

import Catalog from '../catalog';
import { useTableContext } from '../table/table-context';
import { useDebounce } from '../table/useDebounce';
import { applyFiltersToUrl, parseFiltersFromUrl } from './config/filterHelpers';
import { FilterKey } from './config/filterTypeEnum';
import DateIntervalFilter from './filters/DateIntervalFilter';
import DraggableItems from './filters/Draggable';
import NumberIntervalFilter from './filters/NumberIntervalFilter';
import SavedFilters from './filters/SavedFilters';
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
    onReady?: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, storageKey, table_key, onReady }) => {
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

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (filters.length === 0 || activeTab !== 'default') return;

        const hash = window.location.hash;
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const raw = params.get('filterData');

        const getEmptyValue = (f: FilterConfig) => {
            if (f.type === 'number-interval') return { min: '', max: '' };
            if (f.type === 'date-interval') {
                return Array.isArray(f.value) ? ['', ''] : '';
            }
            if (f.type === 'multi-select') return [];
            return '';
        };

        const applyFilterSet = (filtersToApply: FilterConfig[]) => {
            setSavedFilters(filtersToApply);
            filtersToApply.forEach((f: any) => onChange(f.key, f.value));

            const cleaned = filtersToApply
                .filter((f) => !isEmpty(f.value))
                .map((f) => ({ id: f.key || f.column, value: f.value }));

            applyFiltersToUrl(cleaned, filterDataState.skip, filterDataState.take, filterDataState.sort, {
                replace: true,
            });
        };

        const init = async () => {
            try {
                if (raw) {
                    const parsed = JSON.parse(raw);
                    const urlFilters: { id: string; value: any }[] = parsed.filter || [];

                    const updated = filters.map((f) => {
                        const id = f.key || f.column;
                        const match = urlFilters.find((u) => u.id === id);
                        const value = match?.value ?? getEmptyValue(f);
                        return { ...f, value };
                    });

                    applyFilterSet(updated);
                } else if (!hasInitialized.current) {
                    const res = await filterService.getDefaultFilter(table_key);
                    const defVals = Array.isArray(res?.filterValues) ? res.filterValues : [];

                    const mergedDefault = filters.map((f) => {
                        const df = defVals.find((d: any) => d.column === (f.key || f.column));
                        return { ...f, value: df?.value !== undefined ? df.value : getEmptyValue(f) };
                    });

                    setDefaultSnapshot(mergedDefault);
                    setHasDefault(defVals.length > 0);
                    applyFilterSet(mergedDefault);
                }
            } catch (e) {
                console.warn('Filter initialization error:', e);

                const emptyFilters = filters.map((f) => ({ ...f, value: getEmptyValue(f) }));
                setSavedFilters(emptyFilters);
                emptyFilters.forEach((f: any) => onChange(f.key, f.value));

                const base = window.location.hash.split('?')[0];
                window.history.replaceState(null, '', base);

                setDefaultSnapshot(null);
                setHasDefault(false);
            } finally {
                hasInitialized.current = true;
                onReady?.();
            }
        };

        init();
    }, [activeTab, filters]);

    const isEmpty = (v: any) =>
        v == null ||
        (typeof v === 'string' && v.trim() === '') ||
        (Array.isArray(v) && v.length === 0) ||
        (typeof v === 'object' && 'min' in v && 'max' in v && v.min === '' && v.max === '');

    const handleResetFilters = () => {
        setSearchText('');

        if (hasDefault && defaultSnapshot) {
            setSavedFilters(defaultSnapshot);
            defaultSnapshot.forEach((f: any) => onChange(f.key, f.value));

            const cleanedDefaults = defaultSnapshot
                .filter((f) => !isEmpty(f.value))
                .map((f) => ({ id: f.key || f.column, value: f.value }));

            applyFiltersToUrl(cleanedDefaults, filterDataState.skip, filterDataState.take, filterDataState.sort);
            return;
        }

        const resetFilters = filters.map((f) => {
            let resetValue: any = '';
            if (f.type === 'number-interval') resetValue = { min: '', max: '' };
            else if (f.type === 'date-interval') resetValue = Array.isArray(f.value) ? [null, null] : null;
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
        // onChange(key, value);
    };

    const renderFilter = (filter: any) => {
        // console.log(filter, 'renderFilter');
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
                            icon={<SearchIcon width={20} height={20} style={{ marginLeft: 2 }} />}
                            iconPosition="right"
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
            // case FilterKey.MultiSelect: // 5
            //     return (
            //         <DropdownMultiSelect
            //             key={filter.key}
            //             label={filter.label}
            //             filterKey={filter.key}
            //             options={filter.options || []}
            //             value={filter.value || []}
            //             onChange={(key, values) => _onChange(key, values)}
            //             disabled={filter.readOnly}
            //         />
            //     );
            case FilterKey.Select: // 4
                const items = (filter.options || []).map((opt: any) => ({
                    value: opt.value,
                    label: opt.label,
                    disabled: !!opt.disabled,
                }));

                const selectedObj =
                    filter.value != null && filter.value !== ''
                        ? (items.find((i: any) => String(i.value) === String(filter.value)) ?? null)
                        : null;

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
                        value={filter.value}
                        onChange={(val) => _onChange(filter.key, val)} //
                        readOnly={filter.readOnly}
                        singlePlaceholder={filter.placeholder}
                        rangePlaceholders={filter.rangePlaceholders}
                        errorMsg={false}
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
                                            <div className={styles.filtersMain}>
                                                <div className={styles.filterContent}>
                                                    {filteredSavedFilters.map(renderFilter)}
                                                </div>
                                                <Button variant="tertiary" onClick={handleApplyFilters}>
                                                    Tətbiq et
                                                </Button>
                                            </div>
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
                </div>
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
