import { SearchIcon } from '@/shared/icons';

import { S_Input } from '@/ui';

import styles from './style.module.css';

interface SearchHeaderProps {
    onReset?: () => void;
    onSearchChange?: (val: string) => void;
    searchText?: string;
    mode?: 'filter' | 'sort';
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ onReset, onSearchChange, searchText }) => {
    return (
        <div className={styles.searchHeader}>
            <S_Input
                placeholder="Axtar"
                value={searchText}
                onChange={(e) => onSearchChange?.(e.target.value)}
                inputSize="medium"
                label=""
                icon={<SearchIcon width={20} height={20} style={{ marginLeft: 2 }} />}
                iconPosition="right"
            />
            <button className={styles.searchButton} onClick={onReset}>
                Təmizlə
            </button>
        </div>
    );
};

export default SearchHeader;
