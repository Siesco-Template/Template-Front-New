import { DefaultThemes } from '../settings.contants';
import { Theme, ThemeState } from './theme.store';

export const transformThemeToCss = (theme?: Theme) => {
	if (theme) {
		
		const primaryColors = Object.entries(theme.primary).reduce((acc, [key, value]) => {
			acc[`--clr-primary-${key}`] = value;
			return acc;
		}, {} as Record<string, string>);
	
		const secondaryColors = Object.entries(theme.secondary).reduce((acc, [key, value]) => {
			acc[`--clr-secondary-${key}`] = value;
			return acc;
		}, {} as Record<string, string>);
		
		const bgAndForegroundColor = {
			'--clr-background': theme.background,
			'--clr-foreground': theme.foreground,
		}
		return {
			type: theme.type,
			cssVariables: {
				...primaryColors,
				...secondaryColors,
				...bgAndForegroundColor,
			}
		}
	}
}


export const addThemeOnHtmlRoot = (getTheme: ReturnType<typeof transformThemeToCss>) => {
	if (getTheme) {
		const {type, cssVariables} = getTheme;
		const root = document.documentElement;

		Object.entries(cssVariables)?.forEach(([key, value]) => {
			root.style.setProperty(key, value);
		});
		root.setAttribute('data-theme', type)
		
	}
}