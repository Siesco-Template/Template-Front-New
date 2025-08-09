import TextFilter from '../../filters/TextFilter';
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
            <TextFilter
                label=""
                onChange={(val) => onSearchChange?.(val)}
                placeholder="Axtar"
                key="search"
                value={searchText}
                compact={false}
            />
            <button className={styles.searchButton} onClick={onReset}>
                Təmizlə
            </button>
        </div>
    );
};

export default SearchHeader;
