import { Theme } from './theme.store';

export const transformThemeToCss = (theme?: Theme) => {
    if (theme) {
        const contentColors = Object.entries(theme.content).reduce(
            (acc, [key, value]) => {
                acc[`--content-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        const backgroundColors = Object.entries(theme.background).reduce(
            (acc, [key, value]) => {
                acc[`--content-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        const borderColors = Object.entries(theme.border).reduce(
            (acc, [key, value]) => {
                acc[`--content-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        return {
            type: theme.type,
            cssVariables: {
                ...contentColors,
                ...backgroundColors,
                ...borderColors,
            },
        };
    }
};

export const addThemeOnHtmlRoot = (getTheme: ReturnType<typeof transformThemeToCss>) => {
    if (getTheme) {
        const { type, cssVariables } = getTheme;
        const root = document.documentElement;

        Object.entries(cssVariables)?.forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        root.setAttribute('data-theme', type);
    }
};
