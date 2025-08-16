import { createRoot } from 'react-dom/client';

import App from './app';
import { TableConfigProvider } from './shared/table/tableConfigContext';

createRoot(document.getElementById('root')!).render(
    <TableConfigProvider>
        <App />
    </TableConfigProvider>
);
