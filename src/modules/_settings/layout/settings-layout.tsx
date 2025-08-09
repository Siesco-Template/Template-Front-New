import { FC, useEffect, useRef } from 'react';
import { Outlet } from 'react-router';

import { useWidthViewport } from '@/shared/hooks';
import { DirectionLeft01 } from '@/shared/icons';
import { cls } from '@/shared/utils';

import styles from './layout.module.css';
import { useLayoutStore } from './layout.store';
import Navbar_Content from './navbar-content';
import Sidebar from './sidebar-content/sidebar';

const sizeMap: Record<'small' | 'normal' | 'large', number> = {
    small: 220,
    normal: 250,
    large: 300,
};

const navbarSizeMap: Record<'small' | 'normal' | 'large', number> = {
    small: 40,
    normal: 60,
    large: 80,
};

const Layout_Sidebar: FC = () => {
    const { pinned, position, togglePinned, alwaysOpen, openWithButton, openWithHover, zoom } = useLayoutStore();

    const widthPx = sizeMap[zoom];

    const changePinnOnSidebarBtn = (
        <button
            className={cls(styles.sidebarToggleBtn, pinned && styles.pinned, styles[position])}
            onClick={() => togglePinned(!pinned)}
        >
            <DirectionLeft01 />
        </button>
    );

    const sidebarStyle: React.CSSProperties = {
        width: alwaysOpen || !pinned ? `${widthPx}px` : undefined,
    };

    const handleHover = () => {
        if (openWithHover && pinned && !alwaysOpen) {
            // console.log('Sidebar hovered');
            togglePinned(false);
        }
    };

    const handleMouseLeave = () => {
        if (openWithHover && !pinned && !alwaysOpen) {
            // console.log('Sidebar mouse left');
            togglePinned(true);
        }
    };

    return (
        <nav
            style={sidebarStyle}
            className={cls(styles.layoutSidebar, pinned ? styles.pinned : styles.unpinned)}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
        >
            <Sidebar />
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
