import { FC } from 'react';

import { S_Button, S_Input } from '@/ui';

import { useCreateTheme } from '../use-create-theme';
import styles from './themes.module.css';

interface ICreateThemeProps {
    closeModal: (open: boolean) => void;
}
const CreateTheme: FC<ICreateThemeProps> = ({ closeModal }) => {
    const { createThemeForm, changeColor, changeName, error, theme, newColors } = useCreateTheme();

    return (
        <form className={styles.createThemeForm} onSubmit={createThemeForm}>
            <div className={styles.formItems}>
                <S_Input
                    name="name"
                    placeholder="Adlandır"
                    size={'48'}
                    onChange={changeName}
                    description={error?.name?.[0]}
                    state={error?.name?.[0] ? 'error' : 'default'}
                />
                <div className={styles.colorInputs}>
                    {/* Primary Color */}
                    <div>
                        <div className={styles.colorInputWrapper}>
                            <div className={styles.colorLabel}>
                                <label htmlFor="primary">Əsas rəng</label>
                                <span>{newColors.primaryColor}</span>
                            </div>
                            <input
                                type="color"
                                id="primary"
                                name="primary"
                                className={styles.colorInput}
                                value={newColors.primaryColor}
                                onChange={changeColor}
                            />
                        </div>
                        <div className={styles.themePalette}>
                            {Object.entries(theme.primary).map(([key, value]) => {
                                return <span className={styles.paletteItem} key={key} style={{ background: value }} />;
                            })}
                        </div>
                    </div>

                    <div>
                        <div className={styles.colorInputWrapper}>
                            <div className={styles.colorLabel}>
                                <label htmlFor="secondary">İkinci rəng</label>
                                <span>{newColors.secondaryColor}</span>
                            </div>
                            <input
                                type="color"
                                id="secondary"
                                name="secondary"
                                className={styles.colorInput}
                                value={newColors.secondaryColor}
                                onChange={changeColor}
                            />
                        </div>
                        <div className={styles.themePalette}>
                            {Object.entries(theme.secondary).map(([key, value]) => {
                                return <span className={styles.paletteItem} key={key} style={{ background: value }} />;
                            })}
                        </div>
                    </div>

                    <div>
                        <div className={styles.colorInputWrapper}>
                            <div className={styles.colorLabel}>
                                <label htmlFor="yellow">Sarı rəng</label>
                                <span>{newColors.yellowColor}</span>
                            </div>
                            <input
                                type="color"
                                id="yellow"
                                name="yellow"
                                className={styles.colorInput}
                                value={newColors.yellowColor}
                                onChange={changeColor}
                            />
                        </div>
                        <div className={styles.themePalette}>
                            {Object.entries(theme.yellow).map(([key, value]) => {
                                return <span className={styles.paletteItem} key={key} style={{ background: value }} />;
                            })}
                        </div>
                    </div>

                    <div>
                        <div className={styles.colorInputWrapper}>
                            <div className={styles.colorLabel}>
                                <label htmlFor="neutral">Neytral rəng</label>
                                <span>{newColors.neutralColor}</span>
                            </div>
                            <input
                                type="color"
                                id="neutral"
                                name="neutral"
                                className={styles.colorInput}
                                value={newColors.neutralColor}
                                onChange={changeColor}
                            />
                        </div>
                        <div className={styles.themePalette}>
                            {Object.entries(theme.neutral).map(([key, value]) => {
                                return <span className={styles.paletteItem} key={key} style={{ background: value }} />;
                            })}
                        </div>
                    </div>

                    <div>
                        <div className={styles.colorInputWrapper}>
                            <div className={styles.colorLabel}>
                                <label htmlFor="green">Yaşıl rəng</label>
                                <span>{newColors.greenColor}</span>
                            </div>
                            <input
                                type="color"
                                id="green"
                                name="green"
                                className={styles.colorInput}
                                value={newColors.greenColor}
                                onChange={changeColor}
                            />
                        </div>
                        <div className={styles.themePalette}>
                            {Object.entries(theme.green).map(([key, value]) => {
                                return <span className={styles.paletteItem} key={key} style={{ background: value }} />;
                            })}
                        </div>
                    </div>

                    <div>
                        <div className={styles.colorInputWrapper}>
                            <div className={styles.colorLabel}>
                                <label htmlFor="blue">Mavi rəng</label>
                                <span>{newColors.blueColor}</span>
                            </div>
                            <input
                                type="color"
                                id="blue"
                                name="blue"
                                className={styles.colorInput}
                                value={newColors.blueColor}
                                onChange={changeColor}
                            />
                        </div>
                        <div className={styles.themePalette}>
                            {Object.entries(theme.blue).map(([key, value]) => {
                                return <span className={styles.paletteItem} key={key} style={{ background: value }} />;
                            })}
                        </div>
                    </div>

                    <div>
                        <div className={styles.colorInputWrapper}>
                            <div className={styles.colorLabel}>
                                <label htmlFor="red">Qırmızı rəng</label>
                                <span>{newColors.redColor}</span>
                            </div>
                            <input
                                type="color"
                                id="red"
                                name="red"
                                className={styles.colorInput}
                                value={newColors.redColor}
                                onChange={changeColor}
                            />
                        </div>
                        <div className={styles.themePalette}>
                            {Object.entries(theme.red).map(([key, value]) => {
                                return <span className={styles.paletteItem} key={key} style={{ background: value }} />;
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.createThemeBtnsWrapper}>
                <S_Button type="button" variant="outlined" onClick={closeModal.bind(null, false)}>
                    Geri qayıt
                </S_Button>
                <S_Button type="submit" variant="primary">
                    Yadda saxla
                </S_Button>
            </div>
        </form>
    );
};

export default CreateTheme;
