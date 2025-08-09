import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { DefaultAlign } from '../settings.contants';

export type CursorVariant = 'light' | 'dark' | 'default';
export type CursorSize = 16 | 24 | 28 | 32;
export type ViewAndContentState = {
    cursorVariant: CursorVariant;
    previousCursorVariant?: CursorVariant;
    cursorSize: number;
    previousCursorSize?: number;
};
type ViewAndContentAction = {
    saveViewAndContent: () => void;
    discardViewAndContent: () => void;

    changeCursorVariant: (variant: CursorVariant) => void;

    changeCursorSize: (size: number) => void;
    getViewAndContentDiff?: () => Record<string, any>;
};

export const useViewAndContentStore = create<ViewAndContentState & ViewAndContentAction>()(
    devtools((set, get) => ({
        discardViewAndContent: () => {
            set((state) => ({
                cursorVariant: state.previousCursorVariant ?? DefaultAlign.cursorVariant,
                cursorSize: state.previousCursorSize ?? DefaultAlign.cursorSize,
            }));
        },

        getViewAndContentDiff: () => {
            const { cursorVariant, previousCursorVariant, cursorSize, previousCursorSize } = get();

            const diff: Record<string, any> = {};

            // Əgər istifadəçi əvvəl dəyişib saxlayıbsa və eyni qalırsa → yadda saxla
            if (
                previousCursorVariant !== undefined &&
                previousCursorVariant !== DefaultAlign.cursorVariant &&
                cursorVariant === previousCursorVariant
            ) {
                diff['extraConfig.visualSettings.cursor'] = cursorVariant;
            }

            if (
                previousCursorSize !== undefined &&
                previousCursorSize !== DefaultAlign.cursorSize &&
                cursorSize === previousCursorSize
            ) {
                diff['extraConfig.visualSettings.cursorSize'] = cursorSize;
            }

            // Əgər cari dəyişib, amma hələ yadda saxlanmayıbsa → yadda saxla
            if (cursorVariant !== previousCursorVariant) {
                diff['extraConfig.visualSettings.cursor'] = cursorVariant;
            }

            if (cursorSize !== previousCursorSize) {
                diff['extraConfig.visualSettings.cursorSize'] = cursorSize;
            }

            return diff;
        },

        saveViewAndContent: () => {
            set(() => ({
                previousCursorVariant: get().cursorVariant,
                previousCursorSize: get().cursorSize,
            }));
        },

        changeCursorVariant: (variant) => {
            set((state) => ({
                cursorVariant: variant,
            }));
        },

        changeCursorSize: (size) => {
            set((state) => ({
                cursorSize: size,
            }));
        },
    }))
);
