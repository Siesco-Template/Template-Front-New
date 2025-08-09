import { FC, MouseEvent } from 'react';

import {
    CustomThemeBackground,
    DarkThemeBackground,
    EditIcon,
    LightThemeBackground,
    SystemThemeBackground,
    TrashIcon,
} from '@/shared/icons';
import { cls } from '@/shared/utils';

import { S_Button } from '@/ui';

import { Theme } from '../../../theme/theme.store';
import styles from './themes.module.css';

interface IThemeCardProps {
    theme: Theme;
    currentTheme: string;
    changeCurrentTheme: (themeId: string) => void;
    newThemeId?: string;
    isEditable?: boolean;
    removeTheme?: (themeId: string) => void;
    editTheme?: (theme: Theme) => void;
}
const ThemeCard: FC<IThemeCardProps> = ({
    theme,
    currentTheme,
    changeCurrentTheme,
    newThemeId,
    removeTheme,
    editTheme,
    isEditable = false,
}) => {
    const handleDelete = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.stopPropagation();
        removeTheme && removeTheme(theme.id);
    };

    const handleEdit = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.stopPropagation();
        editTheme && editTheme(theme);
    };

    const renderCardIcon = (name: string) => {
        switch (name) {
            case 'Light':
                return <LightThemeBackground />;
            case 'Dark':
                return <DarkThemeBackground />;
            case 'Sistem':
                return <SystemThemeBackground />;
            default:
                return <CustomThemeBackground />; // Custom theme icon
        }
    };

    return (
        <div
            className={cls(
                styles.themeCardWrapper,
                theme.id === currentTheme && styles.selected,
                newThemeId && styles.disabled
            )}
        >
            {renderCardIcon(theme.name)}

            <div className={styles.themeCardFooter}>
                <p>{theme.name}</p>
                {isEditable && (
                    <div className={styles.themeCardBtns}>
                        <S_Button isIcon variant="ghost-10" iconBtnSize="10" onClick={handleDelete}>
                            <TrashIcon />
                        </S_Button>
                        <S_Button isIcon variant="ghost-10" iconBtnSize="10" onClick={handleEdit}>
                            <EditIcon />
                        </S_Button>
                    </div>
                )}
            </div>
            <div
                className={styles.changeCurrentTheme}
                onClick={(e) => {
                    e.stopPropagation();
                    !newThemeId && changeCurrentTheme(theme.id);
                }}
            />
        </div>
    );
};

export default ThemeCard;
