import { ChangeEvent, FormEvent, useState } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router';

import { TinyColor } from '@ctrl/tinycolor';

import { Theme, useThemeStore } from '../../theme/theme.store';
import { addThemeOnHtmlRoot, transformThemeToCss } from '../../theme/theme.utils';

type ErrorType = Record<string, string[]>;

export const useCreateTheme = (closeModal: () => void) => {
    const [error, setError] = useState<ErrorType>({});
    const { newThemeId, themes, setTheme, saveTheme } = useThemeStore();

    const theme = themes.find((theme) => theme.id === newThemeId)!;

    const hexToHsl = (color: string | TinyColor) => {
        if (typeof color === 'string') {
            color = new TinyColor(color).toHslString().slice(4, -1);
        } else {
            return color.toHslString().slice(4, -1);
        }
    };
    const colorToHex = (color: string) => new TinyColor(`hsl(${color})`).toHexString();

    const changeColor = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const currentColor = new TinyColor(value);
        const color = currentColor.toHslString().slice(4, -1);
        let newColorsOnTheme: Theme;

        if (name === 'primary' || name === 'secondary') {
            const newPalette = {
                50: hexToHsl(currentColor.mix('#fff', 80)),
                100: hexToHsl(currentColor.mix('#fff', 70)),
                200: hexToHsl(currentColor.mix('#fff', 60)),
                300: hexToHsl(currentColor.mix('#fff', 50)),
                400: hexToHsl(currentColor.mix('#fff', 40)),
                500: hexToHsl(currentColor),
                600: hexToHsl(currentColor.mix('#000', 15)),
                700: hexToHsl(currentColor.mix('#000', 30)),
                800: hexToHsl(currentColor.mix('#000', 45)),
                900: hexToHsl(currentColor.mix('#000', 60)),
            };
            newColorsOnTheme = { ...theme, [name]: newPalette };
        } else {
            if (name === 'background') {
                newColorsOnTheme = { ...theme, type: currentColor.isDark() ? 'dark' : 'light', background: color };
            } else {
                newColorsOnTheme = { ...theme, foreground: color };
            }
        }

        setTheme(newColorsOnTheme);
        addThemeOnHtmlRoot(transformThemeToCss(newColorsOnTheme));
    };

    const changeName = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;

        setTheme({ ...theme, name });

        if (name.trim() !== '') {
            setError({});
        } else {
            setError({ name: ['Ad tələb olunur'] });
        }
    };

    const createThemeForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (theme.name.trim() === '') {
            setError({ name: ['Ad tələb olunur'] });
        } else {
            saveTheme();
        }
    };

    useBlocker(newThemeId !== undefined);
    useBeforeUnload((event) => {
        if (newThemeId !== undefined) {
            event.preventDefault();
            event.returnValue = '';
        }
    });

    return {
        theme,
        error,
        primaryColor: colorToHex(theme.primary[500]),
        secondaryColor: colorToHex(theme.secondary[500]),
        foregroundColor: colorToHex(theme.foreground),
        backgroundColor: colorToHex(theme.background),
        changeColor,
        changeName,
        createThemeForm,
        closeModal,
    };
};
