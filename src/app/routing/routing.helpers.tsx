import { ReactNode, Suspense } from 'react';
import { LoaderIcon } from 'react-hot-toast';

export const Loading = () => (
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            height: '100%',
            width: '100%',
        }}
    >
        <LoaderIcon style={{ width: '70px', height: '70px' }} />
    </div>
);

export const LazyLoadable = ({ page }: { page: ReactNode }) => {
    return <Suspense fallback={<Loading />}>{page}</Suspense>;
};
