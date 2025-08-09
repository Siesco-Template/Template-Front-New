import { useEffect } from 'react';
import { useOutletContext } from 'react-router';

import { S_Button, S_Switch } from '@/ui';
import S_Select_Simple, { Item } from '@/ui/select/select-simple';

import { LayoutPositionState, LayoutZoomState, useLayoutStore } from '../../layout/layout.store';
import { useViewAndContentStore } from '../../view-and-content/view-and-content.store';
import styles from './interface-settings.module.css';

const layoutPositions: Item[] = [
    {
        value: 'left',
        label: 'Sol',
    },
    {
        value: 'right',
        label: 'Sağ',
    },
    {
        value: 'top',
        label: 'Yuxarı',
    },
    {
        value: 'bottom',
        label: 'Aşağı',
    },
];

const zoomOptions: Item[] = [
    {
        value: 'small',
        label: 'Kiçik',
    },
    {
        value: 'normal',
        label: 'Orta',
    },
    {
        value: 'large',
        label: 'Böyük',
    },
];


export const ViewAndContentActions = () => {
    const { previousCursorSize, previousCursorVariant, saveViewAndContent, discardViewAndContent } =
        useViewAndContentStore();

    const isChanged = previousCursorSize || previousCursorVariant;

    const saveActions = () => {
        saveViewAndContent();
    };

    const discardActions = () => {
        discardViewAndContent();
    };
    if (!isChanged) return null;

    return (
        <div className={styles.buttonContainer}>
            <S_Button color="red" variant="outlined-20" children={'Geri qaytar'} onClick={() => discardActions()} />
            <S_Button variant="main-20" color="green" children={'Yadda Saxla'} onClick={() => saveActions()} />
        </div>
    );
};

const InterfaceSettings = () => {
    const { setHasChange } = useOutletContext<{ setHasChange: (value: boolean) => void }>();
    const {
        position,
        previousPosition,
        setPosition,

        pinned,
        previousPinned,
        togglePinned,

        openWithButton,
        previousOpenWithButton,
        toggleOpenWithButton,

        openWithHover,
        previousOpenWithHover,
        toggleOpenWithHover,

        alwaysOpen,
        previousAlwaysOpen,
        toggleAlwaysOpen,

        zoom,
        previousZoom,
        setZoom,
    } = useLayoutStore();

    const changedLayout =
        position !== previousPosition ||
        pinned !== previousPinned ||
        openWithButton !== previousOpenWithButton ||
        openWithHover !== previousOpenWithHover ||
        alwaysOpen !== previousAlwaysOpen ||
        zoom !== previousZoom;

    useEffect(() => {
        setHasChange(changedLayout);
    }, [changedLayout, setHasChange]);

    return (
        <div style={{ width: '100%' }}>
            <div className={styles.settingsHeader}>
                <h2 className={styles.headerTitle}>İnterfeys tənzimləmələri</h2>
                <p className={styles.headerDescription}>
                    Panelin ümumi ölçüsü, şriftlər və menyu yerləşməsi kimi əsas interfeys tənzimləmələrini buradan
                    dəyişə bilərsiniz.
                </p>
            </div>
            <div className={styles.settingsSection}>
                <div className={styles.section}>
                    <div>
                        <h3>Menyu yerləşməsi</h3>
                        <p>Menyunun dashboard daxilində hansı istiqamətdə göstəriləcəyini seçin.</p>
                    </div>
                    <div style={{ maxWidth: 100 }}>
                        <S_Select_Simple
                            items={layoutPositions}
                            value={[position]}
                            setSelectedItems={(value) => setPosition(value[0].value as LayoutPositionState)}
                            itemsContentMinWidth={100}
                            itemsContentMaxWidth={100}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.settingsSection}>
                <div className={styles.section}>
                    <div>
                        <h3>Sidebar rejimi</h3>
                        <p>İş tərzinizə uyğun olaraq menyunun görünmə və idarəetmə üsulunu seçin.</p>
                    </div>
                    <div className={styles.switchesContainer}>
                        <div>
                            <span>Həmişə açıq</span>
                            <S_Switch
                                checked={alwaysOpen}
                                onCheckedChange={({ checked }) => toggleAlwaysOpen(checked)}
                            />
                        </div>
                        <div>
                            <span>Hover zamanı açılsın</span>
                            <S_Switch
                                checked={openWithHover}
                                onCheckedChange={({ checked }) => toggleOpenWithHover(checked)}
                            />
                        </div>
                        <div>
                            <span>Düymə ilə açılsın</span>
                            <S_Switch
                                checked={openWithButton}
                                onCheckedChange={({ checked }) => toggleOpenWithButton(checked)}
                            />
                        </div>
                        <div>
                            <span>Avtomatik gizlənsin</span>
                            <S_Switch checked={pinned} onCheckedChange={({ checked }) => togglePinned(checked)} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.settingsSection}>
                <div className={styles.section}>
                    <div>
                        <h3>Ümumi ölçü</h3>
                        <p>Menyunun ölçüsünü tənzimləyin.</p>
                    </div>
                    <div style={{ maxWidth: 100 }}>
                        <S_Select_Simple
                            items={zoomOptions}
                            value={[zoom]}
                            setSelectedItems={(value) => setZoom(value[0].value as LayoutZoomState)}
                            itemsContentMinWidth={100}
                            itemsContentMaxWidth={100}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterfaceSettings;
