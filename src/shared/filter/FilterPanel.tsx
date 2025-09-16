import React, { useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';

import { filterService } from '@/services/filter/filter.service';

import { SearchIcon } from '@/shared/icons';

import { S_Button, S_Input } from '@/ui';
import Modal from '@/ui/dialog';
import { showToast } from '@/ui/toast/showToast';

import Catalog from '../catalog';
import { useTableContext } from '../table/table-context';
import { useTableConfig } from '../table/tableConfigContext';
import styles from './filter.module.css';
import DateIntervalFilter from './filters/DateIntervalFilter';
import DraggableItems from './filters/Draggable';
import NumberIntervalFilter from './filters/NumberIntervalFilter';
import SavedFilters from './filters/SavedFilters';
import FilterHeader from './layout/filterHeader';
import Header from './layout/header';
import SearchHeader from './layout/searchHeader';
import { FilterConfig } from './types';
import { applyConfigToFilters, applyFiltersToUrl, getEmptyValue, isEmpty } from './utils/filterHelpers';
import { FilterKey } from './utils/filterTypeEnum';

interface FilterPanelProps {
    filters: FilterConfig[];
    onChange?: (key: string, value: any) => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
    table_key: string;
    onResetFilters: () => void;
    onReady?: () => void;
    isResetting?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    filters,
    onChange,
    table_key,
    onReady,
    onResetFilters,
    isResetting = false,
}) => {
    const [activeTab, setActiveTab] = useState<'default' | 'saved'>('default');
    const [savedFilters, setSavedFilters] = useState<FilterConfig[]>([]);
    const [sortMode, setSortMode] = useState(false);
    const [searchText, setSearchText] = useState<string>('');
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [filterName, setFilterName] = useState('');

    const [errorText, setErrorText] = useState('');

    const { filterDataState } = useTableContext();

    const selectRef = useRef<HTMLDivElement | null>(null);

    const [defaultFilter, setDefaultFilter] = useState<FilterConfig[] | null>(null);
    const [hasDefault, setHasDefault] = useState(false);

    const { saveConfigToApi, config } = useTableConfig();

    const [appliedFilterName, setAppliedFilterName] = useState<any>(null);
    const [isAppliedDefault, setIsAppliedDefault] = useState(false);

    const [isDirty, setIsDirty] = useState(false);
    const [isModified, setIsModified] = useState(false);

    console.log(isAppliedDefault, 'isdeflt', filterName);

    useEffect(() => {
        const tableFilters = config?.tables?.[table_key]?.filters;
        // console.log(tableFilters, 'tbleflters');
        // console.log(filters, 'filters');
        if (filters && tableFilters) {
            // console.log('brdadi');
            setSavedFilters(applyConfigToFilters(filters, tableFilters));
            // console.log(applyConfigToFilters(filters, tableFilters), 'x');
            // console.log(savedFilters, 'svdflters');
        } else {
            // console.log('elsdeyem');
            setSavedFilters(filters);
        }
    }, [filters, config, table_key]);

    console.log(savedFilters, 'svd');

    const parseFiltersFromUrl = (): { id: string; value: any }[] => {
        try {
            const hash = window.location.hash;
            const queryString = hash.split('?')[1] || '';
            const params = new URLSearchParams(queryString);
            const raw = params.get('filterData');

            const parsed = raw ? JSON.parse(decodeURIComponent(raw)) : [];
            const filters = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.filter) ? parsed.filter : [];

            return filters;
        } catch {
            return [];
        }
    };

    useEffect(() => {
        const urlFilters = parseFiltersFromUrl();

        if (activeTab !== 'default') return;

        const updated = filters.map((f) => {
            const match = urlFilters?.find((u) => u.id === f.key || u.id === f.column);
            return match ? { ...f, value: match.value } : { ...f, value: getEmptyValue(f) };
        });

        const tableFilters = config?.tables?.[table_key]?.filters;
        if (tableFilters) {
            setSavedFilters(applyConfigToFilters(updated, tableFilters));
        } else {
            setSavedFilters(updated);
        }

        updated.forEach((f: any) => onChange?.(f.key, f.value));
    }, [window.location.hash, filters, defaultFilter]);

    useEffect(() => {
        (async () => {
            try {
                const res = await filterService.getDefaultFilter(table_key);
                const defVals = Array.isArray(res?.filterValues) ? res.filterValues : [];
                if (!defVals.length) {
                    onReady?.();
                    return;
                }

                const df = filters.map((f) => {
                    const hit = defVals.find((d: any) => String(d.column ?? d.key) === String(f.key ?? f.column));
                    return hit ? { ...f, value: hit.value } : { ...f, value: getEmptyValue(f) };
                });

                const onlyFilled = df.filter((f) => !isEmpty(f.value));
                setDefaultFilter(onlyFilled);
                setHasDefault(true);

                const urlFilters = parseFiltersFromUrl();

                if (urlFilters?.length === 0 && !isResetting) {
                    applyFiltersToUrl(
                        onlyFilled.map((f) => ({ id: f.key || f.column, value: f.value })),
                        filterDataState.skip,
                        filterDataState.take,
                        filterDataState.sort,
                        true
                    );
                    setIsAppliedDefault(true);

                    if (res?.filterTitle) {
                        setAppliedFilterName(res.filterTitle);
                    }
                } else {
                    onReady?.();
                }
            } catch (_) {
                onReady?.();
            } finally {
                onReady?.();
            }
        })();
    }, [table_key]);

    // urldeki butun filterleri temizleyir, eger default varsa onu saxliyir ama
    const handleResetFilters = () => {
        setSearchText('');
        setAppliedFilterName(null);
        setIsAppliedDefault(false);
        setIsModified(false);

        const reset = savedFilters.map((f) => ({
            ...f,
            value: getEmptyValue(f),
        }));
        // @ts-expect-error
        setSavedFilters(reset);
        reset.forEach((f: any) => onChange?.(f.key, f.value));

        // URL təmizlə
        let newHash = window.location.hash.split('?')[0];
        window.location.hash = newHash;

        // bir dəfəlik fetch initialFilter:true ilə getsin
        onResetFilters?.();
    };

    // hansisa filterde yeni value secende state vurur, ama tetbiq etmir helem
    const handleUpdateFilter = (key: string, value: any) => {
        const updatedFilters = savedFilters.map((f) =>
            f.key === key || f.column === key
                ? {
                      ...f,
                      value,
                  }
                : f
        );

        console.log(updatedFilters, 'upd filters');

        setSavedFilters(updatedFilters);

        if (appliedFilterName || isAppliedDefault) {
            setAppliedFilterName(null);
            setIsModified(true);
            setIsAppliedDefault(false);
        }
    };

    // filterKey gore filterleri ui cixardir
    const renderFilter = (filter: any) => {
        // console.log(filter, 'f');
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
                            size="36"
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
                    // @ts-expect-error
                    <DateIntervalFilter
                        key={filter.key}
                        label={filter.label}
                        value={filter.value}
                        onChange={(val) => _onChange(filter.key, val)}
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

    // filterlerin orderini ve visibilty yadda saxlayir
    const handleSaveSort = async () => {
        if (!isDirty) {
            setSortMode(false);
            return;
        }

        await saveConfigToApi();
        setSortMode(false);
        setIsDirty(false);
    };

    const handleSaveCurrentFilters = () => {
        setIsSaveModalOpen(true);
    };

    // save olunan filteri tetbiq edir
    const handleApplySavedFilter = (
        filters: FilterConfig[],
        isDefault?: boolean,
        filterId?: string,
        filterName?: string
    ) => {
        const cleanedFilters = filters?.map((f) => ({
            id: f.key || f.column,
            value: f.value,
        }));

        const tableFilters = config?.tables?.[table_key]?.filters;

        let merged = applyConfigToFilters(filters, tableFilters ?? []);
        merged = merged.map((f) => ({
            ...f,
            value: filters.find((sf) => sf.key === f.key || sf.column === f.column)?.value ?? f.value,
            visible: true,
        }));

        setSavedFilters(merged);

        applyFiltersToUrl(cleanedFilters, filterDataState.skip, filterDataState.take, filterDataState.sort, isDefault);

        setActiveTab('default');
        setAppliedFilterName(filterName);

        setIsAppliedDefault(!!isDefault);
    };

    // filteri tetbiq edir
    const handleApplyFilters = () => {
        const filterItems = savedFilters?.map((f) => ({
            id: f.key || f.column,
            value: f.value,
        }));

        console.log(savedFilters, 'clg');

        applyFiltersToUrl(filterItems, filterDataState.skip, filterDataState.take, filterDataState.sort, false);

        setActiveTab('default');
    };

    const filteredSavedFilters = savedFilters
        .filter((filter) => {
            // Əgər istifadəçi hansısa filter tətbiq edib və ya dəyişib → hamısını göstər
            if (appliedFilterName || isModified) return true;
            console.log(appliedFilterName, isModified, 'drf');

            // Əks halda yalnız visible=true olanları göstər
            return filter.visible !== false;
        })
        .filter((filter) => {
            const columnMatch = filter?.column?.toLowerCase().includes(searchText?.toLowerCase());
            const labelMatch = filter?.label?.toLowerCase().includes(searchText?.toLowerCase());
            return columnMatch || labelMatch;
        });

    const handleResetOrder = () => {};

    // yeni filter save edir
    const handleSaveFilter = async (name?: string) => {
        if (!name) return setErrorText('Filter adını daxil edin');

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
            showToast({ label: 'Filter uğurla yaradıldı', type: 'success' });
            setFilterName('');
            setIsSaveModalOpen(false);
        } catch (error) {
            console.error('Filteri yaratmaqda xəta baş verdi:', error);
        }
    };

    // hem yaradir hemde save edir
    const handleSaveAndApplyFilter = async (name?: string) => {
        if (!name) return setErrorText('Filter adını daxil edin');

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
                                        filterName={appliedFilterName}
                                        hideActions={!!appliedFilterName || isModified}
                                        isDefault={isAppliedDefault}
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
                                            tableKey={table_key}
                                            setIsDirty={setIsDirty}
                                        />
                                    ) : (
                                        <>
                                            <div className={styles.filtersMain}>
                                                <div className={styles.filterContent}>
                                                    {filteredSavedFilters.map((filter) => (
                                                        <React.Fragment key={filter.key || filter.column}>
                                                            {renderFilter(filter)}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                                <S_Button
                                                    variant="primary"
                                                    color="primary"
                                                    onClick={handleApplyFilters}
                                                >
                                                    Tətbiq et
                                                </S_Button>
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

            <Modal
                open={isSaveModalOpen}
                onOpenChange={setIsSaveModalOpen}
                title="Filteri yadda saxla"
                size="xs"
                footer={
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <S_Button
                            variant="primary"
                            color="secondary"
                            onClick={() => handleSaveAndApplyFilter(filterName)}
                        >
                            Yadda saxla və istifadə et
                        </S_Button>
                        <S_Button variant="primary" color="primary" onClick={() => handleSaveFilter(filterName)}>
                            Yadda saxla
                        </S_Button>
                    </div>
                }
            >
                <S_Input
                    label="Ad"
                    placeholder="Ad daxil edin"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    size="36"
                    autoFocus={true}
                />
            </Modal>
        </>
    );
};

export default FilterPanel;
