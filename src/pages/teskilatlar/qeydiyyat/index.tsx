import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { fakeEndpointsService } from '@/services/fakeEndpoints/fakeEndpoints.service';

import PageHeader from '@/ui/page-header';

const Qeydiyyat = () => {
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        const checkPermission = async () => {
            try {
                await fakeEndpointsService.getAllOrganizations();
                setHasPermission(true);
            } catch (error) {
                // @ts-expect-error
                if (error.status === 403) {
                    toast.error('Bu səhifəyə giriş icazəniz yoxdur.');
                    setHasPermission(false);
                    return;
                }
                setHasPermission(true);
                return;
            }
        };

        checkPermission();
    }, []);

    if (!hasPermission) {
        return null;
    }

    return <PageHeader title="Təşkilatlar" />;
};

export default Qeydiyyat;
