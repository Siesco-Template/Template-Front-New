import { MRT_ColumnDef } from 'material-react-table';
import * as XLSX from 'xlsx';

export const exportToExcel = async <T extends object>(
    columns: MRT_ColumnDef<T>[],
    fetchData: () => Promise<T[]>
) => {
    try {
        const data = await fetchData();
        
        const formattedData = data.map(row => {
            const formattedRow: Record<string, any> = {};
            columns.forEach(column => {
                formattedRow[column.header as string] = row[column.accessorKey as keyof T];
            });
            return formattedRow;
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');

        XLSX.writeFile(workbook, 'data.xlsx');
    } catch (error) {
        console.error('error:', error);
    }
};
