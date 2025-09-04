import { ReactNode, Suspense } from 'react';

import SplashScreen from '@/ui/preloader/SplashScreen';

export const Loading = () => <SplashScreen />;

export const LazyLoadable = ({ page }: { page: ReactNode }) => {
    return <Suspense fallback={<Loading />}>{page}</Suspense>;
};
