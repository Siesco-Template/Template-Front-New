import { useEffect } from 'react';
import { useOutletContext } from 'react-router';

import { S_Slider, S_Switch } from '@/ui';

import { useTypographyStore } from '../../typography/typography.store';
import { classifyRange } from '../../typography/typography.utils';
import styles from './typography.module.css';
import { useFontSize } from './use-font-size';
import { useLetterSpacing } from './use-letter-spacting';

const Typography = () => {
    const { setHasChange } = useOutletContext<{ setHasChange: (value: boolean) => void }>();

    const { fontSize, fontSizeMin, fontSizeMax, onChangeFontSize } = useFontSize();
    const { difference, percentage, letterSpacingAsNumber, onChangeLetterSpacing, letterSpaceMax, letterSpaceMin } =
        useLetterSpacing();

    const {
        previousFontSize,
        previousLetterSpacing,
        highlightLinks,
        previousHighlightLinks,
        toggleHighlightLinks,
        highlightTitles,
        previousHighlightTitles,
        toggleHighlightTitles,
    } = useTypographyStore();

    const previousLetterSpacingAsNumber = Number(previousLetterSpacing?.slice(0, -2)) * percentage + difference;

    const changedSizes =
        fontSize != Number(previousFontSize?.slice(0, -2)) ||
        letterSpacingAsNumber != previousLetterSpacingAsNumber ||
        highlightTitles !== previousHighlightTitles ||
        highlightLinks !== previousHighlightLinks;

    useEffect(() => {
        setHasChange(changedSizes);
    }, [changedSizes, setHasChange]);

    return (
        <div style={{ width: '100%' }}>
            <div className={styles.settingsHeader}>
                <h2 className={styles.headerTitle}>Mətn</h2>
                <p className={styles.headerDescription}>
                    Mətnin oxunaqlılığını və estetik görünüşünü artırmaq üçün şrift ölçüsünü və hərflərarası məsafəni
                    tənzimləyin.
                </p>
            </div>

            <div className={styles.settingsSection}>
                <div className={styles.section}>
                    <div>
                        <h3>Şrift ölçüsü</h3>
                        <p>Paneldəki mətnlərin ölçüsünü dəyişin.</p>
                    </div>
                    <div className={styles.sliderContainer}>
                        <S_Slider
                            value={[fontSize]}
                            min={fontSizeMin}
                            onChange={onChangeFontSize}
                            max={fontSizeMax}
                            step={0.1}
                        />
                        <span className={styles.sliderDescription}>
                            {classifyRange(fontSize, fontSizeMin, fontSizeMax)}
                        </span>
                    </div>
                </div>
                <div className={styles.section}>
                    <div>
                        <h3>Hərflərarası məsafə</h3>
                        <p>Hərflər arasındakı boşluğu tənzimləyərək mətnin sıx və ya geniş görünməsini seçin.</p>
                    </div>
                    <div className={styles.sliderContainer}>
                        <S_Slider
                            value={[letterSpacingAsNumber]}
                            min={letterSpaceMin}
                            onChange={onChangeLetterSpacing}
                            max={letterSpaceMax}
                            step={0.01}
                        />
                        <span className={styles.sliderDescription}>
                            {classifyRange(
                                letterSpacingAsNumber,
                                letterSpaceMin,
                                letterSpaceMax,
                                {
                                    verySmall: -0.4 + difference,
                                    small: -0.2 + difference,
                                    medium: 0.5 + difference,
                                    large: 1 + difference,
                                },
                                true
                            )}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.settingsSection}>
                <div className={styles.section}>
                    <div>
                        <h3>Vurğulama</h3>
                        <p>Başlıqların və keçidlərin vizual vurğusunu tənzimləyin.</p>
                    </div>
                    <div className={styles.switchesContainer}>
                        <div style={{ borderBottom: '1px solid var(--background-tertiary)' }}>
                            <span>Başlıqları vurğula</span>
                            <S_Switch size="20" checked={highlightTitles} onCheckedChange={toggleHighlightTitles} />
                        </div>
                        <div>
                            <span>Linkləri vurğula</span>
                            <S_Switch size="20" checked={highlightLinks} onCheckedChange={toggleHighlightLinks} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Typography;
