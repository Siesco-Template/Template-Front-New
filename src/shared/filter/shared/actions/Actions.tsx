import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import { filterService } from '@/services/filter/filter.service';

import { CopyCheckIcon, EditIcon, EyeIcon, ReloadIcon, TrashIcon } from '../icons';
import styles from './style.module.css';

const ActionsDropdown = ({ onView, onEdit, onDelete, isOpen, onToggle, filter, setSavedFilters }: any) => {
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

    const handleSetDefaultFilter = () => {
        if (filter) {
            setSavedFilters((prevFilters: any) =>
                prevFilters.map((f: any) => ({
                    ...f,
                    isDefault: f.id === filter.id ? true : false,
                }))
            );

            onToggle(null);

            filterService
                .setDefaultFilter(filter.id)
                .then((response) => {
                    // console.log('Varsayılan filter uğurla təyin edildi', response);
                    toast.success('Varsayılan filter uğurla təyin edildi');
                })
                .catch((error) => {
                    console.error('Varsayılan filter təyin edilərkən xəta baş verdi', error);
                });
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
                })
                .catch((error) => {
                    console.error('Varsayılan filter sıfırlanarkən xəta baş verdi', error);
                });
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
                        <EyeIcon /> Bax
                    </li>
                    <li onClick={onEdit} className={styles.dropdownItem}>
                        <EditIcon /> Düzəliş et
                    </li>
                    <li onClick={onDelete} className={styles.dropdownItem}>
                        <TrashIcon /> Sil
                    </li>
                    <li
                        onClick={filter.isDefault ? handleRemoveDefaultFilter : handleSetDefaultFilter}
                        className={styles.dropdownItem}
                    >
                        {filter.isDefault ? (
                            <>
                                <ReloadIcon /> Varsayılanı sıfırla
                            </>
                        ) : (
                            <>
                                <CopyCheckIcon /> Varsayılan et
                            </>
                        )}
                    </li>
                </ul>
            )}
        </div>
    );
};

export default ActionsDropdown;
