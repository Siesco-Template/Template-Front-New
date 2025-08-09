import React, { PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './context-menu-2.module.css';

type TriggerType = 'click' | 'contextmenu';

type ContextMenuProps = PropsWithChildren & {
    trigger?: TriggerType;
    triggerBox?: ReactNode;
    controlled?: boolean;
    visible?: boolean;
    menuPosition?: 'left' | 'right' | 'top' | 'bottom';
    onVisibleChange?: (visible: boolean) => void;
    isOpen?: boolean;
    onClose?: () => void;
};

const S_ContextMenu2: React.FC<ContextMenuProps> = ({
    children,
    triggerBox,
    trigger = 'contextmenu',
    menuPosition = 'right',
    controlled = false,
    visible: controlledVisible,
    onVisibleChange,
    isOpen,
    onClose,
}) => {
    const [autoVisible, setAutoVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    const isVisible = isOpen !== undefined ? isOpen : (controlled ? controlledVisible : autoVisible);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [controlled, onVisibleChange, onClose]);

    const closeMenu = () => {
        if (controlled) {
            onVisibleChange?.(false);
            onClose?.();
        } else {
            setAutoVisible(false);
            onClose?.();
        }
    };

    const openMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setPosition({ x: event.pageX, y: event.pageY });
        if (controlled) {
            onVisibleChange?.(true);
        } else {
            setAutoVisible(true);
        }
    };

    const handleTrigger = (event: React.MouseEvent) => {
        if (isVisible) {
            closeMenu();
        } else {
            openMenu(event);
        }
    };

    return (
        <>
            <div
                className={styles.contextMenuWrapper}
                onContextMenu={trigger === 'contextmenu' ? handleTrigger : undefined}
                onClick={trigger === 'click' ? handleTrigger : undefined}
                data-active={isVisible}
            >
                {triggerBox}
            </div>
            {isVisible &&
                createPortal(
                    <div
                        className={styles.contextMenu}
                        style={{
                            top: position.y + 25,
                            left: position.x,
                            transform: menuPosition === 'right' ? 'translateX(-100%)' : 'translateX(3%)',
                        }}
                        ref={menuRef}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {children}
                    </div>,
                    document.body
                )}
        </>
    );
};

export default S_ContextMenu2;
