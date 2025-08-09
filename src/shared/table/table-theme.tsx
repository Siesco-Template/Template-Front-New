import { PropsWithChildren, useMemo } from 'react';

import { ThemeProvider, createTheme } from '@mui/material';

import { useThemeStore } from '@/modules/_settings/theme/theme.store';

const TableTheme = ({ children }: PropsWithChildren) => {
    const currentTheme = useThemeStore((state) => state.getCurrentTheme)();
    const root = document.documentElement;
    const tableTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: currentTheme?.type ?? 'light', //let's use the same dark/light mode as the global theme
                    primary: {
                        '50': `hsl(var(--clr-primary-50))`,
                        '100': `hsl(var(--clr-primary-100))`,
                        '200': `hsl(var(--clr-primary-200))`,
                        '300': `hsl(var(--clr-primary-300))`,
                        '400': `hsl(var(--clr-primary-400))`,
                        '500': `hsl(var(--clr-primary-500))`,
                        '600': `hsl(var(--clr-primary-600))`,
                        '700': `hsl(var(--clr-primary-700))`,
                        '800': `hsl(var(--clr-primary-800))`,
                        '900': `hsl(var(--clr-primary-900))`,
                        main: `hsl(var(--clr-primary-500))`,
                        light: `hsl(var(--clr-primary-200))`,
                        dark: `hsl(var(--clr-primary-900))`,
                    },
                    secondary: {
                        '50': `hsl(var(--clr-secondary-50))`,
                        '100': `hsl(var(--clr-secondary-100))`,
                        '200': `hsl(var(--clr-secondary-200))`,
                        '300': `hsl(var(--clr-secondary-300))`,
                        '400': `hsl(var(--clr-secondary-400))`,
                        '500': `hsl(var(--clr-secondary-500))`,
                        '600': `hsl(var(--clr-secondary-600))`,
                        '700': `hsl(var(--clr-secondary-700))`,
                        '800': `hsl(var(--clr-secondary-800))`,
                        '900': `hsl(var(--clr-secondary-900))`,
                        main: `hsl(var(--clr-secondary-500))`,
                        light: `hsl(var(--clr-secondary-200))`,
                        dark: `hsl(var(--clr-secondary-900))`,
                    },
                    info: {
                        main: 'hsl(var(--clr-blue-500))', //add in a custom color for the toolbar alert background stuff
                        light: 'hsl(var(--clr-blue-200))',
                        dark: 'hsl(var(--clr-blue-900))',
                        '100': `hsl(var(--clr-blue-100))`,
                        '200': `hsl(var(--clr-blue-200))`,
                        '300': `hsl(var(--clr-blue-300))`,
                        '400': `hsl(var(--clr-blue-400))`,
                        '500': `hsl(var(--clr-blue-500))`,
                        '600': `hsl(var(--clr-blue-600))`,
                        '700': `hsl(var(--clr-blue-700))`,
                        '800': `hsl(var(--clr-blue-800))`,
                        '900': `hsl(var(--clr-blue-900))`,
                    },
                    background: {
                        default: `hsl(var(--clr-background))`,
                    },
                },
                typography: {
                    button: {
                        textTransform: 'none', //customize typography styles for all buttons in table by default
                        fontSize: `var(--fs-200)`,
                    },
                },
                components: {
                    MuiTooltip: {
                        styleOverrides: {
                            tooltip: {
                                fontSize: `var(--fs-100)`, //override to make tooltip font size larger
                            },
                        },
                    },
                    MuiSwitch: {
                        styleOverrides: {
                            thumb: {
                                color: 'hsl(var(--clr-blue-500))',
                            },
                        },
                    },
                },
            }),
        [currentTheme]
    );
    return <ThemeProvider theme={tableTheme}>{children}</ThemeProvider>;
};

export default TableTheme;
