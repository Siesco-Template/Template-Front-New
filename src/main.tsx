import { createRoot } from 'react-dom/client';
import 'react-loading-skeleton/dist/skeleton.css';

import App from './app';
import { TableConfigProvider } from './shared/table/tableConfigContext';

createRoot(document.getElementById('root')!).render(
    <TableConfigProvider>
        <App />
    </TableConfigProvider>
);
