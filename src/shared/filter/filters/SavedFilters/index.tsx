import React, { useEffect, useState } from 'react';

import { filterService } from '@/services/filter/filter.service';

import { SearchIcon } from '@/shared/icons';

import { S_Button, S_Input } from '@/ui';
import Modal from '@/ui/dialog';
import { showToast } from '@/ui/toast/showToast';

import SearchHeader from '../../layout/searchHeader';
import ActionsDropdown from '../../shared/actions/Actions';
import { ArrowLeftIcon, DiskIcon, TrashIcon } from '../../shared/icons';
import { FilterConfig } from '../../types';
import { capitalizeFirst } from '../../utils/stringUtils';
import styles from './style.module.css';

interface SavedFiltersProps {
    renderFilter: (filter: FilterConfig) => React.ReactNode;
    onApplyFilter: any;
    table_key: string;
    filters: FilterConfig[];
    onClearAppliedFilter?: () => void;
}

const SavedFilters = ({ renderFilter, onApplyFilter, table_key, filters }: SavedFiltersProps) => {
    const [savedFilters, setSavedFilters] = useState<any[]>([]);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editing, setEditing] = useState(false);
    const [selectedFilterSearchText, setSelectedFilterSearchText] = useState<string>('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filterToDelete, setFilterToDelete] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    const mergedFilterView: FilterConfig[] = filters.map((f: any) => {
        const matched = selectedFilter?.filterValues?.find((sf: any) => sf.column === f.key || sf.column === f.column);
        return {
            ...f,
            value: matched?.value ?? f.value ?? '',
            type: matched?.filterKey ?? f.type,
            // readOnly: !editing,
            // disabled: !editing,
            onChange: (key: string, value: any) => handleUpdateSelectedFilter(f.key, value),
        };
    });

    useEffect(() => {
        setLoading(true);
        filterService
            .getFiltersByTableId(table_key)
            .then((response) => {
                setSavedFilters(response);
            })
            .catch((error) => {
                console.error('Filterlər alınarkən xəta baş verdi:', error);
            })
            .finally(() => setLoading(false));
    }, []);

    // delete metodu
    const handleDelete = (id: string) => {
        const filter = savedFilters.find((filter: any) => filter.id == id);
        setFilterToDelete(filter);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (filterToDelete) {
            filterService
                .deleteFilter(filterToDelete.id)
                .then(() => {
                    const updatedFilters = savedFilters.filter((filter: any) => filter.id !== filterToDelete.id);
                    setSavedFilters(updatedFilters);
                    setShowDeleteModal(false);
                    setFilterToDelete(null);
                    showToast({ label: 'Filter uğurla silindi', type: 'success' });
                })
                .catch((error) => {
                    console.error('Filter silinərkən xəta baş verdi:', error);
                    setShowDeleteModal(false);
                    setFilterToDelete(null);
                });
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setFilterToDelete(null);
    };

    // context menu
    const handleToggleDropdown = (id: number | null) => {
        setOpenDropdownId((prev) => (prev === id ? null : id));
    };

    // axtaris
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const filteredFilters = savedFilters?.filter((filter: any) =>
        filter?.filterTitle?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    const highlightMatch = (text: string, search: string) => {
        if (!search) return text;
        const regex = new RegExp(`(${search})`, 'gi');
        return text.replace(regex, (match) => `<span class=${styles.highlight}>${match}</span>`);
    };

    // resetleme
    const handleResetSelectedFilter = () => {
        setSelectedFilterSearchText('');

        if (!selectedFilter) return;

        const currentHash = window.location.hash.split('?')[0];
        window.location.hash = currentHash;
    };

    // edit
    const handleEdit = (id: string) => {
        const selected = savedFilters.find((filter: any) => filter.id === id);
        setSelectedFilter(selected);
        setEditing(true);
        setOpenDropdownId(null);
    };

    const handleSaveEditedFilter = () => {
        if (!selectedFilter) return;

        const updatedFilter = {
            filterTitle: selectedFilter.filterTitle,
            filterValues: selectedFilter.filterValues.map((f: any) => ({
                column: f.column,
                value: f.value.toString(),
                filterOperation: f.filterOperation,
                filterKey: f.filterKey,
            })),
        };

        filterService
            .updateFilter(updatedFilter, selectedFilter.id)
            .then((response) => {
                const updatedFilters = savedFilters.map((filter: any) =>
                    filter.id === selectedFilter.id ? { ...filter, ...updatedFilter } : filter
                );
                setSavedFilters(updatedFilters);
                setEditing(false);
                showToast({ label: 'Filterə uğurla düzəliş edildi', type: 'success' });
            })
            .catch((error) => {
                console.error('Filteri yeniləyərkən xəta baş verdi:', error);
            });
    };

    const handleUpdateSelectedFilter = (key: string, value: any) => {
        setSelectedFilter((prev: any) => {
            if (!prev) return prev;

            const existingFilter = prev.filterValues.find((f: any) => f.column === key);

            const baseFilter = filters.find((f: any) => f.key === key || f.column === key);

            if (!baseFilter) return prev;

            const updatedFilter = {
                column: key,
                value,
                filterOperation: baseFilter.type ?? 1,
                filterKey: baseFilter.type ?? 1,
            };

            let updatedValues;

            if (existingFilter) {
                updatedValues = prev.filterValues.map((f: any) => (f.column === key ? { ...f, ...updatedFilter } : f));
            } else {
                updatedValues = [...prev.filterValues, updatedFilter];
            }

            return { ...prev, filterValues: updatedValues };
        });
    };

    // select filter for view
    const handleFilterClick = (id?: string) => {
        if (!id) return;
        const selected = savedFilters.find((filter: any) => filter.id == id);
        setSelectedFilter(selected);
        onApplyFilter(selected?.filterValues, false, id, selected?.filterTitle);
    };

    const handleBack = () => {
        setSelectedFilter(null);
        setEditing(false);
        setSelectedFilterSearchText('');
    };

    return (
        <ul className={styles.savedFilterList}>
            <>
                {selectedFilter ? (
                    <div className={styles.selectedFilterDetails}>
                        <div className={styles.selectedFilterHeader}>
                            <button className={styles.selectedFilterInfo} type="button">
                                {editing && <ArrowLeftIcon color='var("--content-primary")' onClick={handleBack} />}
                                <span>{capitalizeFirst(selectedFilter.filterTitle)}</span>
                            </button>
                            <div className={styles.btnGroup}>
                                {editing && (
                                    <>
                                        <S_Button
                                            variant="primary"
                                            color="secondary"
                                            aria-label="Yadda saxla"
                                            onClick={handleSaveEditedFilter}
                                        >
                                            <DiskIcon
                                                width={16}
                                                height={16}
                                                color="var(--content-secondary-brand-bold)"
                                            />
                                        </S_Button>

                                        <S_Button
                                            variant="primary"
                                            color="secondary"
                                            aria-label="Sil"
                                            onClick={() => handleDelete(selectedFilter.id)}
                                        >
                                            <TrashIcon
                                                width={16}
                                                height={16}
                                                color="var(--content-secondary-brand-bold)"
                                            />
                                        </S_Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <SearchHeader
                            onReset={handleResetSelectedFilter}
                            onSearchChange={(val) => setSelectedFilterSearchText(val)}
                            searchText={selectedFilterSearchText}
                        />
                        <div className={styles.selectedFilterMain}>
                            {mergedFilterView
                                .filter(
                                    (f) =>
                                        f?.label?.toLowerCase().includes(selectedFilterSearchText.toLowerCase()) ||
                                        f?.column?.toLowerCase().includes(selectedFilterSearchText.toLowerCase())
                                )
                                .map((f) => (
                                    <div key={f.key || f.column}>{renderFilter(f)}</div>
                                ))}
                        </div>

                        <S_Button
                            variant="primary"
                            color="primary"
                            onClick={() => onApplyFilter(selectedFilter.filterValues)}
                        >
                            Tətbiq et
                        </S_Button>
                    </div>
                ) : (
                    <>
                        <div className={styles.savedFilterTop}>
                            <h3>Filter</h3>
                            <S_Input
                                placeholder="Axtar..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                size="36"
                                style={{ width: '100%' }}
                                icon={<SearchIcon width={20} height={20} style={{ marginLeft: 2 }} />}
                                iconPosition="right"
                            />
                        </div>

                        <ul className={styles.savedFilterList}>
                            {loading ? (
                                <div className={styles.spinnerWrapper}>
                                    <div className={styles.spinner}></div>
                                </div>
                            ) : filteredFilters?.length > 0 ? (
                                filteredFilters.map((filter: any) => (
                                    <React.Fragment key={filter.id}>
                                        <li
                                            className={`${styles.savedFilterRow} ${filter.isDefault ? styles.active : ''}`}
                                            onDoubleClick={() => handleFilterClick(filter.id)}
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: highlightMatch(
                                                        capitalizeFirst(filter.filterTitle),
                                                        searchTerm
                                                    ),
                                                }}
                                            />
                                            <ActionsDropdown
                                                isOpen={openDropdownId == filter.id}
                                                onToggle={() =>
                                                    handleToggleDropdown(
                                                        openDropdownId === filter.id ? null : filter.id
                                                    )
                                                }
                                                onEdit={() => handleEdit(filter.id)}
                                                onView={() => handleFilterClick(filter.id)}
                                                onDelete={() => handleDelete(filter.id)}
                                                filter={filter}
                                                setSavedFilters={setSavedFilters}
                                                onApplyFilter={onApplyFilter}
                                            />
                                        </li>
                                    </React.Fragment>
                                ))
                            ) : searchTerm ? (
                                <div className={styles.noResults}>Nəticə tapılmadı</div>
                            ) : null}
                        </ul>
                    </>
                )}

                <Modal
                    open={showDeleteModal}
                    onOpenChange={setShowDeleteModal}
                    title="Xəbərdarlıq"
                    size="xs"
                    footer={
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <S_Button variant="primary" color="secondary" onClick={handleCancelDelete}>
                                Ləğv et
                            </S_Button>
                            <S_Button variant="primary" color="primary" onClick={handleConfirmDelete}>
                                Təsdiqlə
                            </S_Button>
                        </div>
                    }
                >
                    <h1 className={styles.description}>
                        <span>{capitalizeFirst(filterToDelete?.filterTitle)}</span>
                        filterini silmək istədiyinizdən əminsiniz mi?
                    </h1>
                </Modal>
            </>
        </ul>
    );
};

export default SavedFilters;
