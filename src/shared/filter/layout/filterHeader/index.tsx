import { S_Button } from '@/ui';

import { DiskIcon, SortCircle, TickIcon } from '../../shared/icons';
import styles from './style.module.css';

interface Props {
    onSortClick: () => void;
    sortMode: boolean;
    onSaveSort: () => void;
    onSaveFilters: () => void;
    disableSave?: boolean;
}
const FilterHeader: React.FC<Props> = ({ onSortClick, sortMode, onSaveSort, onSaveFilters, disableSave = false }) => {
    return (
        <>
            <div className={styles.filterHeader}>
                <h1 className={styles.filterTitle}>Filter</h1>
                <div className={styles.filterHeaderButtons}>
                    <button onClick={onSortClick} className={styles.headerBtn}>
                        {sortMode ? (
                            <TickIcon width={16} height={16} color="hsl(var(--clr-blue-900))" />
                        ) : (
                            <SortCircle width={16} height={16} color="hsl(var(--clr-blue-900))" />
                        )}
                    </button>

                    {!sortMode && (
                        <button className={styles.headerBtn} onClick={onSaveFilters} disabled={disableSave}>
                            <DiskIcon width={16} height={16} color="hsl(var(--clr-blue-900))" />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default FilterHeader;
