import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { DefaultThemes } from '../settings.contants';
import { addThemeOnHtmlRoot, transformThemeToCss } from './theme.utils';

export type Theme = {
    name: string;
    id: string;
    isSystemDefault: boolean;
    primary: Record<string, string>;
    secondary: Record<string, string>;
    yellow: Record<string, string>;
    neutral: Record<string, string>;
    green: Record<string, string>;
    blue: Record<string, string>;
    red: Record<string, string>;
    white: Record<string, string>;
    black: Record<string, string>;
};

export type ThemeState = {
    themes: Theme[];
    initialThemes: Theme[];
    currentTheme: string;
    previousTheme: string | null;
    initialTheme: string;
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
    discardTheme: () => void;
    getThemeDiff: () => Record<string, any>;
    detectChanges: () => boolean;
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

function flattenTheme(obj: Record<string, any>, parentKey = ''): Record<string, string> {
    let result: Record<string, string> = {};

    for (const key in obj) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(result, flattenTheme(obj[key], newKey));
        } else {
            result[newKey] = obj[key];
        }
    }

    return result;
}

const prepareDeletedTheme = (basePath: string = '') => {
    const deleted = { [`${basePath}.name`]: null, [`${basePath}.id`]: null, [`${basePath}.isSystemDefault`]: null };
    const colors = ['primary', 'secondary', 'yellow', 'neutral', 'green', 'blue', 'red'];

    colors.forEach((color) => {
        deleted[`${basePath}.${color}.50`] = null;
        deleted[`${basePath}.${color}.100`] = null;
        deleted[`${basePath}.${color}.150`] = null;
        deleted[`${basePath}.${color}.200`] = null;
        deleted[`${basePath}.${color}.250`] = null;
        deleted[`${basePath}.${color}.300`] = null;
        deleted[`${basePath}.${color}.350`] = null;
        deleted[`${basePath}.${color}.400`] = null;
        deleted[`${basePath}.${color}.450`] = null;
        deleted[`${basePath}.${color}.500`] = null;
        deleted[`${basePath}.${color}.550`] = null;
        deleted[`${basePath}.${color}.600`] = null;
        deleted[`${basePath}.${color}.650`] = null;
        deleted[`${basePath}.${color}.700`] = null;
        deleted[`${basePath}.${color}.750`] = null;
        deleted[`${basePath}.${color}.800`] = null;
        deleted[`${basePath}.${color}.850`] = null;
        deleted[`${basePath}.${color}.900`] = null;
        deleted[`${basePath}.${color}.950`] = null;
        deleted[`${basePath}.${color}.1000`] = null;
    });

    deleted[`${basePath}.white.12`] = null;
    deleted[`${basePath}.white.50`] = null;
    deleted[`${basePath}.black.12`] = null;
    deleted[`${basePath}.black.50`] = null;

    return deleted;
};

function getThemeChanges(defaults: Theme[], current: Theme[]) {
    let changes: Record<string, any> = {};

    current.forEach((theme, index) => {
        // const defaultTheme = defaults.find((def) => def.id === theme.id);
        // if (defaultTheme) {
        //     const diff = deepDiff(defaultTheme, theme, `extraConfig.visualSettings.themes[${index}]`);
        //     changes = { ...changes, ...diff };
        // } else {
        //     changes = { ...changes, ...flattenTheme(theme, `extraConfig.visualSettings.themes[${index}]`) };
        // }

        if (theme.isSystemDefault) return;
        changes = { ...changes, ...flattenTheme(theme, `extraConfig.visualSettings.themes[${index}]`) };
    });

    if (defaults.length > current.length) {
        for (let i = current.length; i < defaults.length; i++) {
            changes = { ...changes, ...prepareDeletedTheme(`extraConfig.visualSettings.themes[${i}]`) };
        }
    }

    return changes;
}

export const useThemeStore = create<ThemeState & ThemeAction>()(
    devtools((set, get) => ({
        discardTheme: () => {
            set((state) => ({
                currentTheme: state.initialTheme,
                themes: state.initialThemes,
                previousTheme: state.initialTheme,
                newThemeId: undefined,
                editedTheme: undefined,
            }));
        },

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
            const isCurrentTheme = themeId === currentTheme;

            const previousTheme =
                get().previousTheme !== null ? themes.find((theme) => theme?.id === get().previousTheme) : null;

            let newCurrentTheme: string = currentTheme;
            if (isCurrentTheme) {
                newCurrentTheme = previousTheme?.id ? previousTheme.id : DefaultThemes[0].id;
            }

            set(() => ({
                themes,
                currentTheme: newCurrentTheme,
                previousTheme: null,
                newThemeId: themeId === get().newThemeId ? undefined : get().newThemeId,
                editedTheme: themeId === get().editedTheme?.id ? undefined : get().editedTheme,
            }));
        },

        saveTheme: () => {
            set(() => ({ newThemeId: undefined, editedTheme: undefined }));
        },

        getThemeDiff: () => {
            const { currentTheme, initialTheme, themes, initialThemes } = get();
            let diff: Record<string, any> = {};

            if (initialTheme !== currentTheme) {
                diff['extraConfig.visualSettings.currentTheme'] = currentTheme;
            }

            // themes array-ı boşdursa, heç nə göndərməyə ehtiyac yoxdur
            if (themes.length > 0 && get().detectChanges()) {
                const themeChanges = getThemeChanges(initialThemes, themes);
                diff = { ...diff, ...themeChanges };
            }

            return diff;
        },

        discardNewTheme: () => {
            set((state) => ({
                currentTheme: state.previousTheme || DefaultThemes[0].id,
                themes: state.themes.filter((theme) => theme.id !== state.newThemeId),
                newThemeId: undefined,
            }));
        },

        getThemes: () => {
            return [...get()?.themes];
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

        detectChanges: () => {
            const { themes, initialThemes, currentTheme, initialTheme } = get();
            const themesChanged = JSON.stringify(themes) !== JSON.stringify(initialThemes);
            const currentThemeChanged = currentTheme !== initialTheme;
            return themesChanged || currentThemeChanged;
        },
    }))
);
