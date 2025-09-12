import { S_Button } from '@/ui';

import { DiskIcon, SortCircle, TickIcon } from '../../shared/icons';
import styles from './style.module.css';

interface Props {
    onSortClick: () => void;
    sortMode: boolean;
    onSaveSort: () => void;
    onSaveFilters: () => void;
    disableSave?: boolean;
    filterName?: string;
    hideActions?: boolean;
}
const FilterHeader: React.FC<Props> = ({
    onSortClick,
    sortMode,
    onSaveSort,
    onSaveFilters,
    disableSave = false,
    hideActions,
    filterName,
}) => {
    return (
        <>
            <div className={styles.filterHeader}>
                <h1 className={styles.filterTitle}>{filterName}</h1>
                {!hideActions && (
                    <div className={styles.filterHeaderButtons}>
                        <S_Button
                            onClick={() => {
                                if (sortMode) {
                                    onSaveSort();
                                } else {
                                    onSortClick();
                                }
                            }}
                            color="secondary"
                            variant="primary"
                        >
                            {sortMode ? (
                                <DiskIcon width={16} height={16} color="var(--content-secondary-brand-bold)" />
                            ) : (
                                <SortCircle width={16} height={16} color="var(--content-secondary-brand-bold)" />
                            )}
                        </S_Button>

                        {!sortMode && (
                            <S_Button color="primary" variant="primary" onClick={onSaveFilters} disabled={disableSave}>
                                <DiskIcon width={16} height={16} color="var(--clr-content-brand-light)" />
                            </S_Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default FilterHeader;
