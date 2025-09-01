import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router';

import { filterService } from '@/services/filter/filter.service';

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

    const navigate = useNavigate();

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

    const clearAllQueryParams = () => {
        setSearchParams({}, { replace: true });
    };

    const handleSetDefaultFilter = async (filter: any) => {
        if (!filter) return;

        setSavedFilters((prev: any) => prev.map((f: any) => ({ ...f, isDefault: f.id === filter.id })));
        onToggle(null);

        if (filter?.filterValues?.length) {
            onApplyFilter?.(filter.filterValues);
        } else {
            try {
                const resp = await filterService.getFilterById(filter.id);
                onApplyFilter?.(resp?.filterValues ?? []);
            } catch {}
        }

        try {
            await filterService.setDefaultFilter(filter.id);
            toast.success('Varsayılan filter uğurla təyin edildi');
        } catch (e) {
            console.error(e);
            toast.error('Varsayılan filter serverdə saxlanmadı');
        }
    };

    const handleRemoveDefaultFilter = () => {
        if (filter) {
            filterService
                .removeDefaultFilter(filter.id)
                .then((response) => {
                    toast.success('Varsayılan filter uğurla sıfırlandı');
                    onToggle(null);

                    setSavedFilters((prevFilters: any) =>
                        prevFilters.map((f: any) => (f.id === filter.id ? { ...f, isDefault: false } : f))
                    );
                    clearAllQueryParams();
                })
                .catch((error) => {
                    console.error('Varsayılan filter sıfırlanarkən xəta baş verdi', error);
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
                                <ReloadIcon color="var(--content-tertiary)" /> Varsayılanı sıfırla
                            </>
                        ) : (
                            <>
                                <CopyCheckIcon color="var(--content-tertiary)" /> Varsayılan et
                            </>
                        )}
                    </li>
                </ul>
            )}
        </div>
    );
};

export default ActionsDropdown;
