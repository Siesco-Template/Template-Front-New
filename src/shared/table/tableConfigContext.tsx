import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

import { configService } from '@/services/configuration/configuration.service';

import { useLayoutStore } from '@/modules/_settings/layout/layout.store';
import { useSettingsStore } from '@/modules/_settings/settings.store';
import { getPersonalizationDiff } from '@/modules/_settings/settings.utils';
import { useThemeStore } from '@/modules/_settings/theme/theme.store';
import { useTypographyStore } from '@/modules/_settings/typography/typography.store';
import { useViewAndContentStore } from '@/modules/_settings/view-and-content/view-and-content.store';

import { getUserDiffFromConfig, mergeWithEval, setNestedValue } from '../utils/queryBuilder';

export type ConfigValue = {
    padding?: number;
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
    alignment?: 'left' | 'center' | 'right';
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    thickness?: number;
    style?: 'solid' | 'dashed' | 'none';
    borderColor?: string;
    pinned?: any;
};

export type TableConfigMap = Record<string, any>;

const TableConfigContext = createContext<{
    config: TableConfigMap;
    updateConfig: (tableKey: string, path: string, value: any) => void;
    updateConfigSync: (tableKey: string, path: string, value: any) => TableConfigMap;
    loadConfigFromApi: () => Promise<void>;
    resetConfig: () => void;
    saveConfigToApi: (diff?: Record<string, any>) => Promise<void>;
    defaultConfig: TableConfigMap;
    setDefaultConfig: React.Dispatch<React.SetStateAction<TableConfigMap>>;
}>({
    config: {},
    updateConfig: () => {},
    updateConfigSync: () => ({}),
    loadConfigFromApi: async () => {},
    resetConfig: () => {},
    saveConfigToApi: async () => {},
    defaultConfig: {},
    setDefaultConfig: () => {},
});

export const useTableConfig = () => useContext(TableConfigContext);

export const getFullConfigDiff = (customTableDiff?: Record<string, any>, defaultConfig?: any, config?: any) => {
    const layout = useLayoutStore.getState();
    const typography = useTypographyStore.getState();
    const viewAndContent = useViewAndContentStore.getState();
    const theme = useThemeStore.getState();
    const settings = useSettingsStore.getState();

    const layoutDiff = layout.getLayoutDiff?.() ?? {};
    const typographyDiff = typography.getTypographyDiff?.() ?? {};
    const viewAndContentDiff = viewAndContent.getViewAndContentDiff?.() ?? {};
    const themeDiff = theme.getThemeDiff?.() ?? {};
    const personalizationDiff = getPersonalizationDiff(settings.navigationLinks, settings.initialNavigationLinks);
    const tableDiff = customTableDiff ?? getUserDiffFromConfig(defaultConfig, config);

    return {
        ...tableDiff,
        ...layoutDiff,
        ...typographyDiff,
        ...viewAndContentDiff,
        ...themeDiff,
        ...personalizationDiff,
    };
};

export const TableConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<TableConfigMap>({});
    const [defaultConfig, setDefaultConfig] = useState<TableConfigMap>({});

    // userConfigRef: istifadəçiyə aid dəyişiklikləri yadda saxlamaq üçün ref (yenidən render olmadan istifadə olunur).
    const userConfigRef = React.useRef<Record<string, any> | null>(null);

    const saveConfigToApi = async (diff?: Record<string, any>) => {
        try {
            const computedDiff = getUserDiffFromConfig(defaultConfig, config);

            const tableDiff = diff ? { ...computedDiff, ...diff } : computedDiff;
            const fullDiff = getFullConfigDiff(tableDiff, defaultConfig, config);

            if (!fullDiff || Object.keys(fullDiff).length === 0) {
                return;
            }

            await configService.createOrUpdateConfig(fullDiff);
            // console.log('✅ Bütün konfiqurasiya serverə göndərildi:', fullDiff);
        } catch (err) {
            console.error('❌ Config POST zamanı xəta:', err);
        }
    };

    const loadConfigFromApi = async () => {
        try {
            const response = await configService.getDefaultAndUserConfig();

            const { defaultConfig, userConfig } = response;
            setDefaultConfig(defaultConfig);
            userConfigRef.current = userConfig ?? null;

            const finalConfig =
                userConfig && Object.keys(userConfig).length > 0
                    ? mergeWithEval(defaultConfig, userConfig)
                    : defaultConfig;

            setConfig(finalConfig);
        } catch (error) {
            console.error('Config yüklənərkən xəta:', error);
        }
    };

    const updateConfig = (tableKey: string, path: string, value: any) => {
        const fullPath = `tables.${tableKey}.${path}`;
        setConfig((prev) => {
            const newConfig = structuredClone(prev);
            setNestedValue(newConfig, fullPath, value);
            return newConfig;
        });
    };

    const updateConfigSync = (tableKey: string, path: string, value: any): TableConfigMap => {
        const fullPath = `tables.${tableKey}.${path}`;
        const nextConfig = structuredClone(config);
        setNestedValue(nextConfig, fullPath, value);
        setConfig(nextConfig);
        return nextConfig;
    };

    const resetConfig = () => {
        setConfig(
            userConfigRef.current && Object.keys(userConfigRef.current).length > 0
                ? mergeWithEval(defaultConfig, userConfigRef.current)
                : structuredClone(defaultConfig)
        );
    };

    return (
        <TableConfigContext.Provider
            value={{
                config,
                defaultConfig,
                updateConfig,
                loadConfigFromApi,
                resetConfig,
                saveConfigToApi,
                setDefaultConfig,
                updateConfigSync,
            }}
        >
            {children}
        </TableConfigContext.Provider>
    );
};
