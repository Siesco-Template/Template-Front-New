import Header_Content from './header-content';
import styles from './layout.module.css';
import Settings_Layout from './settings-layout';

const Header = () => {
    return (
        <header className={styles.header}>
            <Header_Content />
        </header>
    );
};

export default function S_layout() {
    return (
        <>
            <Header />
            <Settings_Layout />
        </>
    );
}
