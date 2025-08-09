import { create } from 'zustand';

import { DefaultLayoutNavbar } from '../settings.contants';

export type LayoutPositionState = 'left' | 'right' | 'top' | 'bottom';
export type LayoutZoomState = 'small' | 'normal' | 'large';

export type LayoutState = {
    position: LayoutPositionState;
    previousPosition?: LayoutPositionState;

    pinned: boolean;
    previousPinned?: boolean;

    openWithButton: boolean;
    previousOpenWithButton?: boolean;

    openWithHover: boolean;
    previousOpenWithHover?: boolean;

    alwaysOpen: boolean;
    previousAlwaysOpen?: boolean;

    zoom: LayoutZoomState;
    previousZoom?: LayoutZoomState;
};
type LayoutActions = {
    setPosition: (position: LayoutPositionState) => void;
    togglePinned: (pinned: boolean) => void;
    toggleOpenWithButton: (openWithButton: boolean) => void;
    toggleOpenWithHover: (openWithHover: boolean) => void;
    toggleAlwaysOpen: (alwaysOpen: boolean) => void;
    setZoom: (zoom: LayoutZoomState) => void;
    saveChangesOnLayout: () => void;
    discardChangesOnLayout: () => void;
    getLayoutDiff?: () => Record<string, any>;
};

export const useLayoutStore = create<LayoutState & LayoutActions>()((set, get) => ({
    position: DefaultLayoutNavbar.position,
    pinned: DefaultLayoutNavbar.pinned,
    openWithButton: DefaultLayoutNavbar.openWithButton,
    openWithHover: DefaultLayoutNavbar.openWithHover,
    alwaysOpen: DefaultLayoutNavbar.alwaysOpen,
    zoom: DefaultLayoutNavbar.zoom,
    previousPosition: DefaultLayoutNavbar.position,
    previousPinned: DefaultLayoutNavbar.pinned,
    previousOpenWithButton: DefaultLayoutNavbar.openWithButton,
    previousOpenWithHover: DefaultLayoutNavbar.openWithHover,
    previousAlwaysOpen: DefaultLayoutNavbar.alwaysOpen,
    previousZoom: DefaultLayoutNavbar.zoom,

    setPosition: (position) => set(() => ({ position })),
    togglePinned: (pinned) => set(() => ({ pinned })),
    toggleOpenWithButton: (openWithButton) => set(() => ({ openWithButton })),
    toggleOpenWithHover: (openWithHover) => set(() => ({ openWithHover })),
    toggleAlwaysOpen: (alwaysOpen) => set(() => ({ alwaysOpen })),
    setZoom: (zoom) => set(() => ({ zoom })),

    getLayoutDiff: () => {
        const {
            position,
            pinned,
            openWithButton,
            openWithHover,
            alwaysOpen,
            zoom,
            previousPosition,
            previousPinned,
            previousOpenWithButton,
            previousOpenWithHover,
            previousAlwaysOpen,
            previousZoom,
        } = get();

        const diff: Record<string, any> = {};
        // Müqayisə üçün funksiya
        const isChanged = (current: any, previous: any, defaultVal: any) =>
            current !== previous || previous !== defaultVal;

        // Hər bir dəyər üçün fərqlilik varsa diffə yazırıq
        if (isChanged(position, previousPosition, DefaultLayoutNavbar.position)) {
            diff['extraConfig.interfaceSettings.menuPosition'] = position;
        }

        if (isChanged(pinned, previousPinned, DefaultLayoutNavbar.pinned)) {
            diff['extraConfig.interfaceSettings.sidebarMode.autoHide'] = pinned;
        }

        if (isChanged(openWithButton, previousOpenWithButton, DefaultLayoutNavbar.openWithButton)) {
            diff['extraConfig.interfaceSettings.sidebarMode.openWithButton'] = openWithButton;
        }

        if (isChanged(openWithHover, previousOpenWithHover, DefaultLayoutNavbar.openWithHover)) {
            diff['extraConfig.interfaceSettings.sidebarMode.openOnHover'] = openWithHover;
        }

        if (isChanged(alwaysOpen, previousAlwaysOpen, DefaultLayoutNavbar.alwaysOpen)) {
            diff['extraConfig.interfaceSettings.sidebarMode.alwaysOpen'] = alwaysOpen;
        }

        if (isChanged(zoom, previousZoom, DefaultLayoutNavbar.zoom)) {
            diff['extraConfig.interfaceSettings.scale'] = zoom;
        }
        // console.log('Layout diff:', diff);
        // Layout diff: {extraConfig.interfaceSettings.scale :'large'}
        return diff;
    },
    saveChangesOnLayout: () => {
        const state = useLayoutStore.getState();
        set({
            previousPinned: state.pinned,
            previousPosition: state.position,
            previousOpenWithButton: state.openWithButton,
            previousOpenWithHover: state.openWithHover,
            previousAlwaysOpen: state.alwaysOpen,
            previousZoom: state.zoom,
        });
    },

    discardChangesOnLayout: () => {
        set((state) => ({
            pinned: state.previousPinned ?? DefaultLayoutNavbar.pinned,
            position: state.previousPosition ?? DefaultLayoutNavbar.position,
            openWithButton: state.previousOpenWithButton ?? DefaultLayoutNavbar.openWithButton,
            openWithHover: state.previousOpenWithHover ?? DefaultLayoutNavbar.openWithHover,
            alwaysOpen: state.previousAlwaysOpen ?? DefaultLayoutNavbar.alwaysOpen,
            zoom: state.previousZoom ?? DefaultLayoutNavbar.zoom,
        }));
    },
}));
