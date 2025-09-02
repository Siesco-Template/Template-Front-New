import { FC } from 'react';

import { Toaster, ToasterProps } from 'sonner';

const S_Toast: FC<ToasterProps> = (props) => {
    return <Toaster {...props} />;
};

export default S_Toast;
