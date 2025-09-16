import { DefaultLayoutNavbar } from '../settings.contants';
import { LayoutState } from './layout.store';

export const getLayoutFromContext = (interfaceSettings: any): LayoutState => {
    const sidebar = interfaceSettings?.sidebarMode ?? {};

    const mode = interfaceSettings?.mode ?? 'light';
    const position = interfaceSettings?.menuPosition ?? DefaultLayoutNavbar.position;
    const pinned = sidebar?.autoHide ?? DefaultLayoutNavbar.pinned;
    const openWithButton = sidebar?.openWithButton ?? DefaultLayoutNavbar.openWithButton;
    const openWithHover = sidebar?.openOnHover ?? DefaultLayoutNavbar.openWithHover;
    const alwaysOpen = sidebar?.alwaysOpen ?? DefaultLayoutNavbar.alwaysOpen;
    const zoom = interfaceSettings?.scale ?? DefaultLayoutNavbar.zoom;

    return {
        mode,
        position,
        pinned,
        openWithButton,
        openWithHover,
        alwaysOpen,
        zoom,

        previousMode: mode,
        previousPosition: position,
        previousPinned: pinned,
        previousOpenWithButton: openWithButton,
        previousOpenWithHover: openWithHover,
        previousAlwaysOpen: alwaysOpen,
        previousZoom: zoom,
    };
};
