import { PropsWithChildren } from 'react';

import SettingsProvider from '@/modules/_settings/settings.providers';
import { PermissionProvider } from '@/modules/permission/PermissionContext';

import { composeProviders } from '@/shared/utils';

import { ConfirmProvider } from '@/ui/dialog/confirm';

// @ts-expect-error
const CombinedProviders = composeProviders([ConfirmProvider, PermissionProvider, ...SettingsProvider]);

const Providers = ({ children }: PropsWithChildren) => {
    return <CombinedProviders>{children}</CombinedProviders>;
};

export default Providers;
