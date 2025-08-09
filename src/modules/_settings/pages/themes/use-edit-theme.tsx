import { ChangeEvent, FormEvent, useState } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router';

import { TinyColor } from '@ctrl/tinycolor';

import { Theme, useThemeStore } from '../../theme/theme.store';
import { addThemeOnHtmlRoot, transformThemeToCss } from '../../theme/theme.utils';

type ErrorType = Record<string, string[]>;

export const useEditTheme = () => {
    const [error, setError] = useState<ErrorType>({});
    const { editedTheme, currentTheme, themes, setTheme, saveTheme } = useThemeStore();
	
    const theme = themes.find(theme => theme.id === editedTheme?.id)!;

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
				// background-a görə dark və ya light mode-ni qoyuruq
                newColorsOnTheme = { ...theme, type: currentColor.isDark() ? 'dark' : 'light', background: color };
            } else {
                newColorsOnTheme = { ...theme, foreground: color };
            }
        }

        setTheme(newColorsOnTheme);

		// əgər user-in istifadə etdiyi theme-ni edit edir-sə bütün ui-da dəyişikliklər görünür
		if (editedTheme?.id === currentTheme) {
			addThemeOnHtmlRoot(transformThemeToCss(newColorsOnTheme));
		}
    };

    const changeName = (e: ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;

		setTheme({ ...theme, name});

        if (name.trim() !== '') {
            setError({});
        } else {
            setError({ name: ['Adını yazmaq lazımdır'] });
        }
    };


    useBlocker(editedTheme?.id !== undefined);
    useBeforeUnload((event) => {
        if (editedTheme?.id !== undefined) {
            event.preventDefault();
            event.returnValue = '';
        }
    });

	const editThemeForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (theme.name.trim() === '') {
            setError({ name: ['Adını yazmaq lazımdır'] });
        } else {
            saveTheme();
        }
    };
	
    return {
        theme,
        error,
		name: theme?.name || '',
        primaryColor: colorToHex(theme?.primary[500]),
        secondaryColor: colorToHex(theme?.secondary[500]),
        foregroundColor: colorToHex(theme?.foreground),
        backgroundColor: colorToHex(theme?.background),
        changeColor,
        changeName,
		editThemeForm
    };
};
