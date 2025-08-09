import { FC } from 'react';

import { cls } from '@/shared/utils';

import { S_Button, S_Input } from '@/ui';

import { useCreateTheme } from '../use-create-theme';
import styles from './themes.module.css';

type ErrorType = Record<string, string[]>;

interface ICreateThemeProps {
    closeModal: () => void;
}
const CreateTheme: FC<ICreateThemeProps> = ({ closeModal }) => {
    const {
        backgroundColor,
        changeColor,
        changeName,
        createThemeForm,
        error,
        foregroundColor,
        primaryColor,
        secondaryColor,
        theme,
    } = useCreateTheme(closeModal);

    return (
        <form className={styles.createThemeForm} onSubmit={createThemeForm}>
            <div className={styles.formItems}>
                <S_Input label="Tema adı" name="name" onChange={changeName} errorText={error?.name?.[0]} />
                <div className={styles.colorInputs}>
                    <div className={styles.colorInputWrapper}>
                        <label htmlFor="primary">Əsas rəng</label>
                        <input
                            type="color"
                            id="primary"
                            name="primary"
                            className={styles.colorInput}
                            value={primaryColor}
                            onChange={changeColor}
                        />
                    </div>
                    <div className={styles.colorInputWrapper}>
                        <label htmlFor="secondary">İkinci rəng</label>
                        <input
                            type="color"
                            id="secondary"
                            name="secondary"
                            className={styles.colorInput}
                            value={secondaryColor}
                            onChange={changeColor}
                        />
                    </div>
                    <div className={styles.colorInputWrapper}>
                        <label htmlFor="foreground">Ön plan rəngi</label>
                        <input
                            type="color"
                            id="foreground"
                            name="foreground"
                            className={styles.colorInput}
                            value={foregroundColor}
                            onChange={changeColor}
                        />
                    </div>
                    <div className={styles.colorInputWrapper}>
                        <label htmlFor="background">Arxa fon rəngi</label>
                        <input
                            type="color"
                            id="background"
                            name="background"
                            className={styles.colorInput}
                            value={backgroundColor}
                            onChange={changeColor}
                        />
                    </div>
                </div>
            </div>

            <ul className={styles.themePalettesWrapper}>
                <li className={cls(styles.themePalette, styles.themePalette1)}>
                    {Object.entries(theme.primary).map(([key, value]) => {
                        return (
                            <span className={styles.paletteItem} key={key} style={{ background: `hsl(${value})` }} />
                        );
                    })}
                </li>
                <li className={styles.themePalette}>
                    {Object.entries(theme.secondary).map(([key, value]) => {
                        return (
                            <span className={styles.paletteItem} key={key} style={{ background: `hsl(${value})` }} />
                        );
                    })}
                </li>
            </ul>
            <div className={styles.createThemeBtnsWrapper}>
                <S_Button type="button" variant="outlined-10" onClick={closeModal}>
                    Geri qayıt
                </S_Button>
                <S_Button type="submit" variant="main-10">
                    Yadda saxla
                </S_Button>
            </div>
        </form>
    );
};

export default CreateTheme;
