import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { DefaultSizes } from '../settings.contants';

export type TypographyState = {
    fontSize: string;
    previousFontSize?: string;

    letterSpacing: string;
    previousLetterSpacing?: string;

    highlightTitles: boolean;
    previousHighlightTitles?: boolean;
    highlightLinks: boolean;
    previousHighlightLinks?: boolean;
};

type TypographyAction = {
    setFontSize: (fs: string) => void;
    saveFontSize: () => void;
    discardFontSize: () => void;

    setLetterSpacing: (ls: string) => void;
    saveLetterSpacing: () => void;
    discardLetterSpacing: () => void;

    toggleHighlightTitles: () => void;
    toggleHighlightLinks: () => void;

    saveSizes: () => void;
    discardSizes: () => void;
    getTypographyDiff?: () => Record<string, any>;
};

export const useTypographyStore = create<TypographyState & TypographyAction>()(
    devtools((set, get) => ({
        setFontSize: (fs) => {
            set((state) => ({
                fontSize: fs,
            }));
        },

        discardFontSize: () => {
            set((state) => ({
                fontSize: state.previousFontSize ?? DefaultSizes.fontSize,
            }));
        },

        setLetterSpacing: (ls) => {
            set((state) => ({
                letterSpacing: ls,
            }));
        },
        getTypographyDiff: () => {
            const {
                fontSize,
                previousFontSize,
                letterSpacing,
                previousLetterSpacing,
                highlightTitles,
                previousHighlightTitles,
                highlightLinks,
                previousHighlightLinks,
            } = get();

            const diff: Record<string, any> = {};

            // bu sahəni dəyişib və saxlayıbsa, diffə sal
            if (
                previousFontSize !== undefined &&
                previousFontSize !== DefaultSizes.fontSize &&
                fontSize === previousFontSize
            ) {
                diff['extraConfig.textSettings.fontSize'] = fontSize;
            }

            if (
                previousLetterSpacing !== undefined &&
                previousLetterSpacing !== DefaultSizes.letterSpacing &&
                letterSpacing === previousLetterSpacing
            ) {
                diff['extraConfig.textSettings.letterSpacing'] = letterSpacing;
            }

            if (
                previousHighlightTitles !== undefined &&
                previousHighlightTitles !== DefaultSizes.highlightTitles &&
                highlightTitles === previousHighlightTitles
            ) {
                diff['extraConfig.textSettings.highlight.headings'] = highlightTitles;
            }

            if (
                previousHighlightLinks !== undefined &&
                previousHighlightLinks !== DefaultSizes.highlightLinks &&
                highlightLinks === previousHighlightLinks
            ) {
                diff['extraConfig.textSettings.highlight.links'] = highlightLinks;
            }

            // Əlavə olaraq, cari sessiyada dəyişib və hələ saxlanmayıbsa
            if (fontSize !== previousFontSize) {
                diff['extraConfig.textSettings.fontSize'] = fontSize;
            }
            if (letterSpacing !== previousLetterSpacing) {
                diff['extraConfig.textSettings.letterSpacing'] = letterSpacing;
            }
            if (highlightTitles !== previousHighlightTitles) {
                diff['extraConfig.textSettings.highlight.headings'] = highlightTitles;
            }
            if (highlightLinks !== previousHighlightLinks) {
                diff['extraConfig.textSettings.highlight.links'] = highlightLinks;
            }

            return diff;
        },
        discardLetterSpacing: () => {
            set((state) => ({
                letterSpacing: state.previousLetterSpacing ?? DefaultSizes.letterSpacing,
            }));
        },

        toggleHighlightTitles: () => {
            set((state) => ({
                highlightTitles: !state.highlightTitles,
            }));
        },

        toggleHighlightLinks: () => {
            set((state) => ({
                highlightLinks: !state.highlightLinks,
            }));
        },

        saveSizes: () => {
            set(() => ({
                previousFontSize: get().fontSize,
                previousLetterSpacing: get().letterSpacing,
                previousHighlightTitles: get().highlightTitles,
                previousHighlightLinks: get().highlightLinks,
            }));
        },

        discardSizes: () => {
            set((state) => ({
                fontSize: state.previousFontSize ?? DefaultSizes.fontSize,

                letterSpacing: state.previousLetterSpacing ?? DefaultSizes.letterSpacing,

                highlightTitles: state.previousHighlightTitles ?? DefaultSizes.highlightTitles,

                highlightLinks: state.previousHighlightLinks ?? DefaultSizes.highlightLinks,
            }));
        },
    }))
);
