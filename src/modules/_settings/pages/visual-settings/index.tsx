import { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router';

import { cls } from '@/shared/utils';

import { S_Slider } from '@/ui';

import { CursorIcon } from '../../components/cursor';
import { DefaultAlign } from '../../settings.contants';
import { Theme, useThemeStore } from '../../theme/theme.store';
import { CursorVariant, useViewAndContentStore } from '../../view-and-content/view-and-content.store';
import Themes from '../themes';
import styles from './visual-settings.module.css';

type CursorState = {
    value: CursorVariant;
    label: string;
    img: string;
};

export const Cursors: CursorState[] = [
    {
        value: 'light',
        label: 'Ağ',
        img: '/cursors/cursor',
    },
    {
        value: 'dark',
        label: 'Qara',
        img: '/cursors/dark-cursor',
    },
    {
        value: 'default',
        label: 'Sistem',
        img: '/cursors/default-cursor',
    },
];

function VisualSettings() {
    const { setHasChange } = useOutletContext<{ setHasChange: (value: boolean) => void }>();
    const {
        cursorVariant,
        cursorSize,
        changeCursorVariant,
        changeCursorSize,
        previousCursorSize,
        previousCursorVariant,
    } = useViewAndContentStore();

    const { currentTheme, getThemes } = useThemeStore();

    const initialThemeSnapshot = useRef<Theme | null>(null);

    useEffect(() => {
        if (!initialThemeSnapshot.current && currentTheme) {
            const initial = getThemes().find((t) => t.id === currentTheme);
            if (initial) initialThemeSnapshot.current = initial;
        }

        const currentThemeObj = getThemes().find((t) => t.id === currentTheme);
        const themeHasChanged = JSON.stringify(currentThemeObj) !== JSON.stringify(initialThemeSnapshot.current);

        const changedSizes = cursorVariant !== previousCursorVariant || cursorSize !== previousCursorSize;
        const hasAnyChange = changedSizes || themeHasChanged;

        setHasChange(hasAnyChange);
    }, [currentTheme, cursorSize, cursorVariant, previousCursorSize, previousCursorVariant, getThemes, setHasChange]);

    const cursor = () => {
        return (
            <div className={styles.cursorGroup}>
                {Cursors.map((cursor) => {
                    const isDefault = cursor.value === 'default';
                    const isLight = cursor.value === 'light';
                    return (
                        <div
                            className={cls(styles.cursorItem, cursor.value === cursorVariant && styles.active)}
                            onClick={() => {
                                cursorVariant !== cursor.value && changeCursorVariant(cursor.value);
                            }}
                            key={cursor.value}
                        >
                            <div>
                                {!isDefault ? (
                                    <CursorIcon
                                        size={18}
                                        background={isLight ? '#fff' : '#000'}
                                        border={isLight ? '#000' : ''}
                                    />
                                ) : (
                                    <img src={`${Cursors?.[0].img}-32.png`} width={16} height={16} alt={cursor.label} />
                                )}
                            </div>
                            <span>{cursor.label}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div style={{ width: '100%' }}>
            <div className={styles.settingsHeader}>
                <h2 className={styles.headerTitle}>Vizual tənzimləmələri</h2>
                <p className={styles.headerDescription}>
                    Platformanın vizual görünüşünü, rənglərini və fonunu şəxsi zövqünüzə uyğunlaşdırın.
                </p>
            </div>

            <div className={styles.settingsSection}>
                <div className={styles.settingsHead}>
                    <h3>Tema</h3>
                    <p>Göz rahatlığınız və şəxsi zövqünüz üçün ən uyğun temanı tətbiq edin.</p>
                </div>
                <Themes />
            </div>

            <div className={styles.settingsSection}>
                <div className={styles.settingsHead}>
                    <h3>Kursor</h3>
                    <p>Kursorun rəngini tənzimləyin və fokuslandığınız sahələri daha rahat görün.</p>
                </div>

                {cursor()}

                {cursorVariant !== DefaultAlign.cursorVariant && (
                    <div className={styles.cursorSizeSection}>
                        <h4>Kursor Ölçüsü</h4>
                        <div className={styles.cursorSliderContainer}>
                            <S_Slider
                                value={[cursorSize]}
                                onChange={(num) => changeCursorSize(num[0])}
                                min={DefaultAlign.minSize}
                                max={DefaultAlign.maxSize}
                                step={DefaultAlign.step}
                                size="15"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VisualSettings;
