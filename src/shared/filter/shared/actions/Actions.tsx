import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

import { filterService } from '@/services/filter/filter.service';

import { showToast } from '@/ui/toast/showToast';

import { CopyCheckIcon, EditIcon, EyeIcon, ReloadIcon, TrashIcon2 } from '../icons';
import styles from './style.module.css';

const ActionsDropdown = ({
    onView,
    onEdit,
    onDelete,
    isOpen,
    onToggle,
    filter,
    setSavedFilters,
    onApplyFilter,
}: any) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onToggle(null);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onToggle]);

    const handleSetDefaultFilter = async (filter: any) => {
        if (!filter) return;

        setSavedFilters((prev: any) => prev.map((f: any) => ({ ...f, isDefault: f.id === filter.id })));

        try {
            await filterService.setDefaultFilter(filter.id);
            showToast({ label: 'Default  filter uğurla təyin edildi', type: 'success' });
            onToggle(null);
            onApplyFilter(filter.filterValues, true, filter.id, filter.filterTitle);
            console.log(filter.filterValues, true, filter.id, filter.filterTitle, 'dflt flter adi');
        } catch (e) {
            console.error(e);
        }
    };

    const handleRemoveDefaultFilter = () => {
        if (filter) {
            filterService
                .removeDefaultFilter(filter.id)
                .then((response) => {
                    showToast({ label: 'Default filter uğurla sıfırlandı', type: 'success' });
                    onToggle(null);

                    setSavedFilters((prevFilters: any) =>
                        prevFilters.map((f: any) => (f.id === filter.id ? { ...f, isDefault: false } : f))
                    );
                })
                .catch((error) => {
                    console.error('Default filter sıfırlanarkən xəta baş verdi', error);
                });
        }
    };

    const handleDefaultToggle = () => {
        if (filter.isDefault) {
            handleRemoveDefaultFilter();
        } else {
            handleSetDefaultFilter(filter);
        }
    };

    return (
        <div className={styles.actionsDropdown} ref={dropdownRef}>
            <button onClick={onToggle} className={styles.dotBtn}>
                ⋮
            </button>
            {isOpen && (
                <ul className={styles.dropdownMenu}>
                    <li onClick={onView} className={styles.dropdownItem}>
                        <EyeIcon width={14} height={14} color="var(--content-tertiary)" /> Bax
                    </li>
                    <li onClick={onEdit} className={styles.dropdownItem}>
                        <EditIcon width={14} height={14} color="var(--content-tertiary)" /> Düzəliş et
                    </li>
                    <li onClick={onDelete} className={styles.dropdownItem}>
                        <TrashIcon2 width={14} height={14} color="var(--content-tertiary)" /> Sil
                    </li>
                    <li onClick={handleDefaultToggle} className={styles.dropdownItem}>
                        {filter.isDefault ? (
                            <>
                                <ReloadIcon width={14} height={14} color="var(--content-tertiary)" /> Default filteri
                                sıfırla
                            </>
                        ) : (
                            <>
                                <CopyCheckIcon width={14} height={14} color="var(--content-tertiary)" /> Default filter
                                et
                            </>
                        )}
                    </li>
                </ul>
            )}
        </div>
    );
};

export default ActionsDropdown;
