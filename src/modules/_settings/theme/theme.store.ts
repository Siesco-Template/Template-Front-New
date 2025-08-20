import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { DefaultThemes } from '../settings.contants';
import { addThemeOnHtmlRoot, transformThemeToCss } from './theme.utils';

export type ThemePalette = {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
};

export type Theme = {
    name: string;
    type: 'dark' | 'light';
    id: string;
    primary: ThemePalette;
    secondary: ThemePalette;
    background: string;
    foreground: string;
};

export type ThemeState = {
    themes: Theme[];
    currentTheme: string;
    previousTheme: string | null;
    newThemeId?: string;
    editedTheme?: Theme;
};

type ThemeAction = {
    addNewTheme: (theme: Theme) => void;
    changeCurrentTheme: (themeId: string) => void;
    removeTheme: (themeId: string) => void;
    saveTheme: () => void;
    changeEditTheme: (theme: Theme) => void;
    discardNewTheme: () => void;
    getThemeForCss: () => ReturnType<typeof transformThemeToCss>;
    getThemes: () => Theme[];
    getCurrentTheme: () => Theme;
    setTheme: (theme: Theme) => void;
    discardEditedTheme: () => void;
    getThemeDiff: () => Record<string, any>;
};

function deepDiff(obj1: any, obj2: any, basePath: string = ''): Record<string, any> {
    // Nəticədə fərqli olan dəyərləri saxlayacağımız obyekt
    const changes: Record<string, any> = {};

    // İkinci obyektin (yəni cari vəziyyətin) açarlarını dövr edirik
    Object.keys(obj2).forEach((key) => {
        // Cari sahənin tam path-i qurulur (məsələn: "themes[0].primary.500")
        const path = basePath ? `${basePath}.${key}` : key;

        // Əgər obyektin dəyəri nested obyekt-disə və array deyilsə, rekursiv müqayisə et
        if (typeof obj2[key] === 'object' && obj2[key] !== null && !Array.isArray(obj2[key])) {
            // Rekursiv olaraq daxilindəki fərqləri tap
            const nestedChanges = deepDiff(obj1[key] ?? {}, obj2[key], path);
            // Tapılan fərqləri əsas nəticəyə əlavə et
            Object.assign(changes, nestedChanges);
        } else {
            if (JSON.stringify(obj1?.[key]) !== JSON.stringify(obj2[key])) {
                // Fərqli olan dəyəri nəticəyə qeyd et
                changes[path] = obj2[key];
            }
        }
    });

    return changes;
}

function getThemeChanges(defaults: Theme[], current: Theme[]) {
    const changes: Record<string, any> = {};

    current.forEach((theme, index) => {
        const defaultTheme = defaults[index];

        if (!defaultTheme) {
            // Yeni əlavə olunubsa, bütünlükdə qeyd et
            changes[`extraConfig.visualSettings.themes[${index}]`] = theme;
        } else {
            const diff = deepDiff(defaultTheme, theme, `extraConfig.visualSettings.themes[${index}]`);
            Object.assign(changes, diff);
        }
    });

    return changes;
}

export const useThemeStore = create<ThemeState & ThemeAction>()(
    devtools((set, get) => ({
        addNewTheme: (theme) =>
            set((state) => ({
                themes: [...state.themes, theme],

                previousTheme: get().currentTheme,
                currentTheme: theme.id,
                newThemeId: theme.id,
            })),

        setTheme: (newTheme) => {
            set((state) => ({
                themes: state.themes.map((theme) => {
                    if (theme.id === newTheme.id) return newTheme;
                    return theme;
                }),
            }));
        },

        changeCurrentTheme: (themeId) => {
            set(() => ({ previousTheme: get().currentTheme, currentTheme: themeId }));
        },

        removeTheme: (themeId) => {
            const themes = get().themes.filter((theme) => theme?.id !== themeId);
            const currentTheme = get().currentTheme;
            const previousTheme = get().previousTheme;
            const isCurrentTheme = themeId === currentTheme;

            const isPreviousTheme = previousTheme !== null && themes.find((theme) => theme?.id === previousTheme);

            let newCurrentTheme: string = currentTheme;
            if (isCurrentTheme) {
                newCurrentTheme = isPreviousTheme ? previousTheme : DefaultThemes[0].id;
            }

            set(() => ({ themes, currentTheme: newCurrentTheme, previousTheme: null }));
        },

        saveTheme: () => {
            set(() => ({ newThemeId: undefined, editedTheme: undefined }));
        },

        getThemeDiff: () => {
            const { currentTheme, previousTheme, themes } = get();
            const diff: Record<string, any> = {};

            if (previousTheme !== currentTheme) {
                diff['extraConfig.visualSettings.currentTheme'] = currentTheme;
            }

            // themes array-ı boşdursa, heç nə göndərməyə ehtiyac yoxdur
            if (themes.length > 0) {
                const themeChanges = getThemeChanges(DefaultThemes, themes);
                Object.assign(diff, themeChanges);
            }

            return diff;
        },

        discardNewTheme: () => {
            set((state) => ({
                currentTheme: state.previousTheme!,
                themes: state.themes.filter((theme) => theme.id !== state.newThemeId),
                newThemeId: undefined,
            }));
        },

        getThemes: () => {
            return [...DefaultThemes, ...get()?.themes];
        },

        getThemeForCss: () => {
            const themes = [...DefaultThemes, ...get()?.themes];
            const currentTheme = get().currentTheme;
            const previousTheme = get().previousTheme;

            let theme = themes.find((themeItem) => themeItem.id === currentTheme);

            if (!theme) {
                theme = themes.find((theme) => theme.id === previousTheme);
            }

            const themeForCss = transformThemeToCss(theme);

            return themeForCss;
        },

        getCurrentTheme: () => {
            const theme = get()
                .getThemes()
                .find((theme) => theme.id === get().currentTheme);
            return theme;
        },

        changeEditTheme: (theme) => {
            set(() => ({ editedTheme: theme, newThemeId: undefined }));
        },

        discardEditedTheme: () => {
            const editedTheme = get().editedTheme;

            if (get().currentTheme === editedTheme?.id) {
                addThemeOnHtmlRoot(transformThemeToCss(editedTheme));
            }
            set((state) => ({
                themes: state.themes.map((theme) => {
                    if (theme.id === editedTheme?.id) return editedTheme;
                    return theme;
                }),
                editedTheme: undefined,
            }));
        },
    }))
);
