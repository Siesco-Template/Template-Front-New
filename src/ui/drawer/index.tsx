'use client';

import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cls } from '@/shared/utils';

import styles from './drawer.module.css';

type I_DrawerProps = {
    children: ReactNode;
    position?: 'left' | 'right' | 'top' | 'bottom';
    isOpen: boolean;
    onClose: () => void;
    width?: string | number;
    contentStyle?: CSSPropertyRule;
    contentClassName?: string;
};

const S_Drawer: FC<I_DrawerProps> = ({
    children,
    position = 'left',
    isOpen,
    onClose,
    width = '80%',
    contentStyle = {},
    contentClassName,
}) => {
    return createPortal(
        <>
            <div className={cls(styles.overlay, isOpen ? styles.show : '')} onClick={onClose} />
            <div
                className={cls(styles.drawer, styles[position], isOpen ? styles.open : '', contentClassName)}
                style={{ width, ...contentStyle }}
            >
                {children}
            </div>
        </>,
        document.body
    );
};

export default S_Drawer;
