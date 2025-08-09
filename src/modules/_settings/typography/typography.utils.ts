import { DefaultSizes } from '../settings.contants';
import { TypographyState } from './typography.store';


export const getTypographyFromContext = (textSettings: any): TypographyState => {
    const fontSize = textSettings?.fontSize ?? DefaultSizes.fontSize;
    const letterSpacing = textSettings?.letterSpacing ?? DefaultSizes.letterSpacing;
    const highlightLinks = textSettings?.highlight?.links ?? DefaultSizes.highlightLinks;
    const highlightTitles = textSettings?.highlight?.headings ?? DefaultSizes.highlightTitles;

    return {
        fontSize,
        previousFontSize: fontSize,

        letterSpacing,
        previousLetterSpacing: letterSpacing,

        highlightLinks,
        previousHighlightLinks: highlightLinks,

        highlightTitles,
        previousHighlightTitles: highlightTitles,
    };
};




export const convertUnits = (value: string, baseFontSize: number = 16) => {
    if (value.endsWith('rem')) {
        const remValue = parseFloat(value);
        return `${remValue * baseFontSize}px`;
    } else if (value.endsWith('px')) {
        const pxValue = parseFloat(value);
        return `${pxValue / baseFontSize}rem`;
    } else {
        throw new Error("Invalid unit. Please provide a value with 'px' or 'rem'.");
    }
};

export const addTypographySizesOnHtmlRoot = (sizes: Partial<TypographyState>) => {
    if (sizes?.fontSize) {
        const root = document.documentElement;
        const fontSize = convertUnits(sizes.fontSize);
        root.style.setProperty('--fs-base', fontSize);
        // root.style.setProperty('--r-base', borderRadius)
    }
};

export const classifyRange = (
    value: number,
    min: number,
    max: number,
    range = {
        verySmall: 20,
        small: 35,
        medium: 60,
        large: 80,
    },
    onlyValue?: boolean,
    clamp: boolean = false
): string => {
    if (min === max) {
        throw new Error('Minimum və maximum valuelər bərabər olmamalıdır');
    }

    if (clamp) {
        value = Math.max(min, Math.min(value, max));
    }

    const percentage = onlyValue ? value : ((value - min) / (max - min)) * 100;

    if (percentage < range.verySmall) return 'Çox kiçik';
    if (percentage < range.small) return 'Kiçik';
    if (percentage < range.medium) return 'Orta (Tövsiyyə olunan)';
    if (percentage < range.large) return 'Böyük';
    return 'Çox böyük';
};

export const rangeForLetterSpacing = (
    value: number,
    range = {
        verySmall: -0.4,
        small: -0.2,
        medium: 0.5,
        large: 2,
    }
) => {
    if (value < range.verySmall) return 'Çox kiçik';
    if (value < range.small) return 'Kiçik';
    if (value < range.medium) return 'Orta (Tövsiyyə olunan)';
    if (value < range.large) return 'Böyük';
    return 'Çox böyük';
};
