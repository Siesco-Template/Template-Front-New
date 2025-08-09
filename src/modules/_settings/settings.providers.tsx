import ThemeProvider from './theme/theme-provider';
import TypographyProvider from './typography/typography.provider';
import ViewAndContentProvider from './view-and-content/view-and-content.provider';

const SettingsProvider = [ThemeProvider, TypographyProvider, ViewAndContentProvider];

export default SettingsProvider;
