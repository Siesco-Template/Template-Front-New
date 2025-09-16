import LayoutProvider from './layout/layout-provider';
import ThemeProvider from './theme/theme-provider';
import TypographyProvider from './typography/typography.provider';
import ViewAndContentProvider from './view-and-content/view-and-content.provider';

const SettingsProvider = [ThemeProvider, TypographyProvider, ViewAndContentProvider, LayoutProvider];

export default SettingsProvider;
