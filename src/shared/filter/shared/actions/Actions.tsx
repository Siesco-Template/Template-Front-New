import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router';

import { filterService } from '@/services/filter/filter.service';

import { showToast } from '@/ui/toast/showToast';

import { CopyCheckIcon, EditIcon, EyeIcon, ReloadIcon, TrashIcon } from '../icons';
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
    const [_, setSearchParams] = useSearchParams();
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
                    // clearAllQueryParams();
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
                        <EyeIcon color="var(--content-tertiary)" /> Bax
                    </li>
                    <li onClick={onEdit} className={styles.dropdownItem}>
                        <EditIcon color="var(--content-tertiary)" /> Düzəliş et
                    </li>
                    <li onClick={onDelete} className={styles.dropdownItem}>
                        <TrashIcon color="var(--content-tertiary)" /> Sil
                    </li>
                    <li onClick={handleDefaultToggle} className={styles.dropdownItem}>
                        {filter.isDefault ? (
                            <>
                                <ReloadIcon color="var(--content-tertiary)" /> Default filteri sıfırla
                            </>
                        ) : (
                            <>
                                <CopyCheckIcon color="var(--content-tertiary)" /> Default filter et
                            </>
                        )}
                    </li>
                </ul>
            )}
        </div>
    );
};

export default ActionsDropdown;
