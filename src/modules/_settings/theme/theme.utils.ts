import { Theme } from './theme.store';

export const transformThemeToCss = (theme?: Theme) => {
    if (theme) {
        const primaryColors = Object.entries(theme.primary).reduce(
            (acc, [key, value]) => {
                acc[`--clr-primary-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        const secondaryColors = Object.entries(theme.secondary).reduce(
            (acc, [key, value]) => {
                acc[`--clr-secondary-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        const yellowColors = Object.entries(theme.yellow).reduce(
            (acc, [key, value]) => {
                acc[`--clr-yellow-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        const neutralColors = Object.entries(theme.neutral).reduce(
            (acc, [key, value]) => {
                acc[`--clr-neutral-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        const greenColors = Object.entries(theme.green).reduce(
            (acc, [key, value]) => {
                acc[`--clr-green-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        const blueColors = Object.entries(theme.blue).reduce(
            (acc, [key, value]) => {
                acc[`--clr-blue-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        const redColors = Object.entries(theme.red).reduce(
            (acc, [key, value]) => {
                acc[`--clr-red-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        const whiteColors = Object.entries(theme.white).reduce(
            (acc, [key, value]) => {
                acc[`--clr-white-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        const blackColors = Object.entries(theme.black).reduce(
            (acc, [key, value]) => {
                acc[`--clr-black-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        return {
            cssVariables: {
                ...primaryColors,
                ...secondaryColors,
                ...yellowColors,
                ...neutralColors,
                ...greenColors,
                ...blueColors,
                ...redColors,
                ...whiteColors,
                ...blackColors,
                '--clr-white': '#fff',
                '--clr-black': '#000',
            },
        };
    }
};

export const addThemeOnHtmlRoot = (getTheme: ReturnType<typeof transformThemeToCss>) => {
    if (getTheme) {
        const { cssVariables } = getTheme;
        const root = document.documentElement;

        Object.entries(cssVariables)?.forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }
};
