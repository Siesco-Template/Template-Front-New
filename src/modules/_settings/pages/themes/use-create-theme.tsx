import { ChangeEvent, FormEvent, useState } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router';

import { TinyColor } from '@ctrl/tinycolor';

import { useTableConfig } from '@/shared/table/tableConfigContext';

import { Theme, useThemeStore } from '../../theme/theme.store';
import { addThemeOnHtmlRoot, transformThemeToCss } from '../../theme/theme.utils';

export type ErrorType = Record<string, string[]>;

export const useCreateTheme = () => {
    const customCreateSuccessEvent = new CustomEvent('themeCreated', {
        detail: { result: true },
    });

    const customCreateFailEvent = new CustomEvent('themeCreated', {
        detail: { result: false },
    });

    const { saveConfigToApi, loadConfigFromApi } = useTableConfig();
    const [error, setError] = useState<ErrorType>({});
    const { newThemeId, themes, setTheme, saveTheme } = useThemeStore();

    const theme = themes.find((theme) => theme.id === newThemeId)!;

    const changeColor = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const currentColor = new TinyColor(value);
        let newColorsOnTheme: Theme;

        if (
            name === 'primary' ||
            name === 'secondary' ||
            name === 'yellow' ||
            name === 'green' ||
            name === 'blue' ||
            name === 'red'
        ) {
            const newPalette = {
                100: currentColor.mix('#fff', 70).toHexString(),
                200: currentColor.mix('#fff', 60).toHexString(),
                300: currentColor.mix('#fff', 50).toHexString(),
                400: currentColor.mix('#fff', 40).toHexString(),
                500: currentColor.toHexString(),
                600: currentColor.mix('#000', 15).toHexString(),
                700: currentColor.mix('#000', 30).toHexString(),
                800: currentColor.mix('#000', 45).toHexString(),
                900: currentColor.mix('#000', 60).toHexString(),
            };
            newColorsOnTheme = { ...theme, [name]: newPalette };
        } else {
            const newPalette = {
                50: currentColor.mix('#fff', 75).toHexString(),
                100: currentColor.mix('#fff', 70).toHexString(),
                150: currentColor.mix('#fff', 65).toHexString(),
                200: currentColor.mix('#fff', 60).toHexString(),
                250: currentColor.mix('#fff', 55).toHexString(),
                300: currentColor.mix('#fff', 50).toHexString(),
                350: currentColor.mix('#fff', 45).toHexString(),
                400: currentColor.mix('#fff', 40).toHexString(),
                500: currentColor.toHexString(),
                600: currentColor.mix('#000', 15).toHexString(),
                650: currentColor.mix('#000', 22.5).toHexString(),
                700: currentColor.mix('#000', 30).toHexString(),
                750: currentColor.mix('#000', 37.5).toHexString(),
                800: currentColor.mix('#000', 45).toHexString(),
                850: currentColor.mix('#000', 52.5).toHexString(),
                900: currentColor.mix('#000', 60).toHexString(),
                950: currentColor.mix('#000', 67.5).toHexString(),
                1000: currentColor.mix('#000', 75).toHexString(),
            };
            newColorsOnTheme = { ...theme, [name]: newPalette };
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

    const createThemeForm = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (theme.name.trim() === '') {
            setError({ name: ['Adını yazmaq lazımdır'] });
            document.dispatchEvent(customCreateFailEvent);
            return;
        }

        saveTheme();
        await saveConfigToApi();
        await loadConfigFromApi();
        document.dispatchEvent(customCreateSuccessEvent);
        return;
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
        newColors: {
            primaryColor: theme?.primary?.[500],
            secondaryColor: theme?.secondary?.[500],
            yellowColor: theme?.yellow?.[500],
            neutralColor: theme?.neutral?.[500],
            greenColor: theme?.green?.[500],
            blueColor: theme?.blue?.[500],
            redColor: theme?.red?.[500],
        },
        changeColor,
        changeName,
        createThemeForm,
    };
};
