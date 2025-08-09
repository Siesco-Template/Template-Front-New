import { useState } from 'react';

import { CustomThemeBackground } from '@/shared/icons';
import { cls } from '@/shared/utils';

import Modal from '@/ui/modal';
import { useConfirm } from '@/ui/modal/confirm';

import { DefaultThemes } from '../../settings.contants';
import { Theme, useThemeStore } from '../../theme/theme.store';
import CreateTheme from './ui/create-theme';
import EditTheme from './ui/edit-theme';
import ThemeCard from './ui/theme-card';
import styles from './ui/themes.module.css';

const Themes = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const confirm = useConfirm();
    const {
        themes,
        getThemes,
        currentTheme,
        addNewTheme,
        changeCurrentTheme,
        getCurrentTheme,
        newThemeId,
        editedTheme,
        changeEditTheme,
        removeTheme,
        discardNewTheme,
        discardEditedTheme,
    } = useThemeStore();

    const newTheme = () => {
        const initialCurrentTheme = getCurrentTheme() || DefaultThemes[0];
        setIsOpenModal(true);
        addNewTheme({
            name: '',
            id: getThemes()[getThemes().length - 1].id + '1',
            background: initialCurrentTheme?.background,
            foreground: initialCurrentTheme?.foreground,
            primary: initialCurrentTheme?.primary,
            secondary: initialCurrentTheme?.secondary,
            type: initialCurrentTheme.type,
        });
    };

    const closeModal = async () => {
        const isConfirmed = await confirm({
            title: 'Dəyişiklikləri geri qaytar',
            message: 'Dəyişiklikləri geri qaytarmağa əminsiniz?',
            confirmText: 'Bəli',
            cancelText: 'Xeyir',
        });
        if (isConfirmed) {
            setIsOpenModal(false);
            editedTheme?.id && discardEditedTheme();
            newThemeId && discardNewTheme();
        }
    };

    const editTheme = (theme: Theme) => {
        setIsOpenModal(true);
        changeEditTheme(theme);
    };

    return (
        <>
            <div className={styles.cardContainer}>
                {DefaultThemes?.map((theme) => {
                    return <ThemeCard key={theme.id} {...{ theme, currentTheme, changeCurrentTheme, newThemeId }} />;
                })}
                {themes?.map((theme, idx) => {
                    return (
                        <ThemeCard
                            key={idx}
                            {...{
                                theme,
                                currentTheme,
                                changeCurrentTheme,
                                newThemeId,
                                removeTheme,
                                editTheme,
                                isEditable: true,
                            }}
                        />
                    );
                })}

                {!newThemeId && (
                    <div className={cls(styles.themeCardWrapper)} onClick={newTheme}>
                        <CustomThemeBackground />

                        <div className={styles.themeCardFooter}>
                            <p>Custom</p>
                        </div>
                    </div>
                )}
            </div>

            {newThemeId && (
                <Modal open={isOpenModal} onOpenChange={closeModal} title="Tema yarat">
                    <CreateTheme closeModal={closeModal} />
                </Modal>
            )}

            {editedTheme?.id && (
                <Modal open={isOpenModal} onOpenChange={closeModal} title="Tema redaktə et">
                    <EditTheme closeModal={closeModal} />
                </Modal>
            )}
        </>
    );
};

export default Themes;
