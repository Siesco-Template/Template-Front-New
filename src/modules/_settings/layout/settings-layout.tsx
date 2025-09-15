import { FC, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router';

import { useWidthViewport } from '@/shared/hooks';
import { DirectionLeft01 } from '@/shared/icons';
import { cls } from '@/shared/utils';

import styles from './layout.module.css';
import { useLayoutStore } from './layout.store';
import Navbar_Content from './navbar-content';
import Sidebar from './sidebar-content/sidebar';

const navbarSizeMap: Record<'small' | 'normal' | 'large', number> = {
    small: 40,
    normal: 60,
    large: 80,
};

const Layout_Sidebar: FC = () => {
    const { pinned, position, alwaysOpen, openWithButton, openWithHover, zoom } = useLayoutStore();
    const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);
    const [open, setOpen] = useState(pinned);

    useEffect(() => {
        setOpen(pinned);
    }, [pinned]);

    const changePinnOnSidebarBtn = (
        <button
            className={cls(styles.sidebarToggleBtn, open && styles.pinned, styles[position])}
            onClick={() => {
                setSubMenuOpen(null);
                setOpen(!open);
            }}
        >
            <DirectionLeft01 width={20} height={20} color="var(--content-brand, #0D3CAF)" />
        </button>
    );

    const handleHover = () => {
        if (openWithHover && pinned && !alwaysOpen) {
            setOpen(false);
        }
    };

    const handleMouseLeave = () => {
        if (openWithHover && !pinned && !alwaysOpen) {
            setOpen(true);
        }
    };

    return (
        <nav
            className={cls(styles.layoutSidebar, styles[zoom], !open || alwaysOpen ? styles.unpinned : styles.pinned)}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
        >
            <Sidebar subMenuOpen={subMenuOpen} setSubMenuOpen={setSubMenuOpen} open={open} setOpen={setOpen} />
            {!alwaysOpen ? (openWithButton ? changePinnOnSidebarBtn : null) : null}
        </nav>
    );
};

const Layout_Navbar: FC = () => {
    const asideRef = useRef<HTMLElement>(null);
    const { zoom } = useLayoutStore();

    const heightPx = navbarSizeMap[zoom];

    return (
        <aside className={styles.layoutNavbar} style={{ height: heightPx }} ref={asideRef}>
            <Navbar_Content />
        </aside>
    );
};

const Content: FC = () => {
    return (
        <main className={styles.layoutContent}>
            <div className={styles.mainLayout}>
                <Outlet />
            </div>
        </main>
    );
};

export default function Settings_Layout() {
    const { position } = useLayoutStore();
    const width = useWidthViewport();

    if (!position) {
        return null;
    }

    if (width < 700) {
        return (
            <div className={styles.unsupportedMessage}>
                <h2>Bu tətbiqi istifadə etmək üçün daha böyük ekran ölçüsünə malik cihazdan istifadə edin.</h2>
            </div>
        );
    }

    return (
        <div
            className={styles.layout}
            style={{
                flexDirection: position === 'top' || position === 'bottom' ? 'column' : 'row',
            }}
        >
            {position === 'left' && <Layout_Sidebar />}
            {position === 'top' && <Layout_Navbar />}
            <Content />
            {position === 'bottom' && <Layout_Navbar />}
            {position === 'right' && <Layout_Sidebar />}
        </div>
    );
}
