import { useEffect } from 'react';
import { useOutletContext } from 'react-router';

import Catalog from '@/shared/catalog';
import { DarkThemeBackground, LightThemeBackground } from '@/shared/icons';
import { cls } from '@/shared/utils';

import { S_Switch } from '@/ui';
import { Item } from '@/ui/select/select-simple';

import { LayoutPositionState, LayoutZoomState, useLayoutStore } from '../../layout/layout.store';
import SystemThemeCard from '../themes/ui/system/system-theme';
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

const InterfaceSettings = () => {
    const { setHasChange } = useOutletContext<{ setHasChange: (value: boolean) => void }>();
    const {
        mode,
        previousMode,
        setMode,

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
        zoom !== previousZoom ||
        mode !== previousMode;

    useEffect(() => {
        setHasChange(changedLayout);
    }, [changedLayout, setHasChange]);

    const selectedObj: any = layoutPositions.find((i) => i.value === position) ?? null;
    const selectedZoomObj: any = zoomOptions.find((i) => i.value === zoom) ?? null;

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
                        <Catalog
                            // @ts-expect-error
                            items={layoutPositions}
                            getLabel={(i: { label: string; value: LayoutPositionState }) => i.label}
                            getRowId={(i: { value: LayoutPositionState }) => String(i.value)}
                            value={selectedObj ? [selectedObj] : []}
                            onChange={(sel) => {
                                const picked = Array.isArray(sel) ? sel[0] : sel;
                                setPosition(picked ? ((picked as any).value as LayoutPositionState) : position);
                            }}
                            multiple={false}
                            enableModal={false}
                            sizePreset="md-lg"
                            totalItemCount={layoutPositions.length}
                            isLoading={false}
                            showMoreColumns={[]}
                            clearable={false}
                            searchItems={false}
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
                                size="20"
                                checked={alwaysOpen}
                                onCheckedChange={({ checked }) => toggleAlwaysOpen(checked)}
                            />
                        </div>
                        <div>
                            <span>Hover zamanı açılsın</span>
                            <S_Switch
                                size="20"
                                checked={openWithHover}
                                onCheckedChange={({ checked }) => toggleOpenWithHover(checked)}
                            />
                        </div>
                        <div>
                            <span>Düymə ilə açılsın</span>
                            <S_Switch
                                size="20"
                                checked={openWithButton}
                                onCheckedChange={({ checked }) => toggleOpenWithButton(checked)}
                            />
                        </div>
                        <div>
                            <span>Avtomatik gizlənsin</span>
                            <S_Switch
                                size="20"
                                checked={pinned}
                                onCheckedChange={({ checked }) => togglePinned(checked)}
                            />
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
                        <Catalog
                            // @ts-expect-error
                            items={zoomOptions}
                            getLabel={(i: { label: string; value: LayoutZoomState }) => i.label}
                            getRowId={(i: { value: LayoutZoomState }) => String(i.value)}
                            value={selectedZoomObj ? [selectedZoomObj] : []}
                            onChange={(sel) => {
                                const picked = Array.isArray(sel) ? sel[0] : sel;
                                setZoom(picked ? ((picked as any).value as LayoutZoomState) : zoom);
                            }}
                            multiple={false}
                            enableModal={false}
                            sizePreset="md-lg"
                            totalItemCount={zoomOptions.length}
                            isLoading={false}
                            showMoreColumns={[]}
                            clearable={false}
                            searchItems={false}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.settingsSection}>
                <div className={styles.section}>
                    <div>
                        <h3>Rejim</h3>
                        <p>Saytın rejimini seçərək öz zövqünüzə uyğunlaşdırın.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                    <div
                        className={cls(styles.themeCardWrapper, mode === 'light' && styles.selected)}
                        onClick={() => setMode('light')}
                    >
                        <LightThemeBackground />

                        <div className={styles.themeCardFooter}>
                            <p>Light</p>
                        </div>
                    </div>
                    <div
                        className={cls(styles.themeCardWrapper, mode === 'dark' && styles.selected)}
                        onClick={() => setMode('dark')}
                    >
                        <DarkThemeBackground />

                        <div className={styles.themeCardFooter}>
                            <p>Dark</p>
                        </div>
                    </div>
                    <div
                        className={cls(styles.themeCardWrapper, mode === 'system' && styles.selected)}
                        onClick={() => setMode('system')}
                    >
                        <SystemThemeCard />

                        <div className={styles.themeCardFooter}>
                            <p>Sistem</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterfaceSettings;
