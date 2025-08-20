import { PropsWithChildren } from 'react';

import { Toast, Toaster, createToaster } from '@ark-ui/react/toast';

export const toaster = createToaster({
    placement: 'bottom-end',
    overlap: true,
    gap: 24,
    max: 4,
});

export const S_Toast = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Toaster toaster={toaster}>
                {(toast) => (
                    <Toast.Root key={toast.id}>
                        <Toast.Title>{toast.title}</Toast.Title>
                        <Toast.Description>{toast.description}</Toast.Description>
                        <Toast.CloseTrigger>X</Toast.CloseTrigger>
                    </Toast.Root>
                )}
            </Toaster>
            {children}
        </>
    );
};
