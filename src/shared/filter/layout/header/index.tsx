import styles from './style.module.css';

interface HeaderProps {
    activeTab: 'default' | 'saved';
    setActiveTab: (tab: 'default' | 'saved') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => (
    <div className={styles.header}>
        <div className={styles.header__title}>
            <button
                className={`${styles.tabButton} ${activeTab === 'default' ? styles.active : ''}`}
                onClick={() => setActiveTab('default')}
            >
                Default
            </button>
            <button
                className={`${styles.tabButton} ${activeTab === 'saved' ? styles.active : ''}`}
                onClick={() => setActiveTab('saved')}
            >
                Saxlanılan
            </button>
        </div>
    </div>
);

export default Header;
