import { useEffect, useState } from 'react';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { DragDropContext, Draggable, DropResult, Droppable, DroppableProvided } from '@hello-pangea/dnd';

import TextFilter from '@/shared/filter/filters/TextFilter';
import { DragHorizontalIcon } from '@/shared/icons';

import { S_Input } from '@/ui';

import styles from './style.module.css';

interface ExcelTableModalProps {
    columns: any[];
    data: any[];
    onColumnChange?: (visibleOrderedCols: any[]) => void;
    onExportConfigChange?: (config: {
        visibleColumns: string[];
        orderedColumns: string[];
        headerOverrides: Record<string, string>;
    }) => void;
}

export const ExcelTableModal = ({ columns, data, onColumnChange, onExportConfigChange }: ExcelTableModalProps) => {
    const initialCols = columns.filter((col: any) => col.accessorKey && col.id !== 'actions');

    const [filters, setFilters] = useState<Record<string, string>>({});
    const [visibleColumns, setVisibleColumns] = useState<string[]>(initialCols.map((col: any) => col.accessorKey));
    const [orderedColumns, setOrderedColumns] = useState<any[]>(initialCols);
    const [headerOverrides, setHeaderOverrides] = useState<Record<string, string>>({});

    const handleHeaderChange = (key: string, value: string) => {
        setHeaderOverrides((prev) => ({ ...prev, [key]: value }));
    };

    const toggleColumnVisibility = (key: string) => {
        setVisibleColumns((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(orderedColumns);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setOrderedColumns(items);
    };

    useEffect(() => {
        const visible = orderedColumns.filter((col) => visibleColumns.includes(col.accessorKey));
        onColumnChange?.(visible);
        onExportConfigChange?.({
            visibleColumns,
            orderedColumns: orderedColumns.map((col) => col.accessorKey),
            headerOverrides,
        });
    }, [visibleColumns, orderedColumns, headerOverrides]);

    const filteredData = data?.filter((row: any) =>
        orderedColumns.every((col: any) => {
            const cellValue = row[col.accessorKey];
            return cellValue !== undefined && cellValue !== null
                ? cellValue
                      .toString()
                      .toLowerCase()
                      .includes((filters[col.accessorKey] || '').toLowerCase())
                : true;
        })
    );

    return (
        <table className={styles.table}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="columns" direction="horizontal">
                    {(provided: DroppableProvided) => (
                        <thead>
                            <tr ref={provided.innerRef} {...(provided.droppableProps as any)}>
                                {orderedColumns.map((col: any, index: number) => (
                                    <Draggable key={col.accessorKey} draggableId={col.accessorKey} index={index}>
                                        {(drag) => (
                                            <th ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps}>
                                                <div className={styles.header}>
                                                    <div className={styles.dragIcon}>
                                                        <DragHorizontalIcon width={16} height={16} color="#3D4C5E" />
                                                    </div>
                                                    <span>{col?.header}</span>
                                                    {visibleColumns.includes(col.accessorKey) ? (
                                                        <EyeIcon
                                                            size={14}
                                                            onClick={() => toggleColumnVisibility(col.accessorKey)}
                                                            style={{ cursor: 'pointer' }}
                                                            color="hsl(var(--clr-primary-900))"
                                                        />
                                                    ) : (
                                                        <EyeOffIcon
                                                            size={14}
                                                            color="hsl(var(--clr-primary-900))"
                                                            onClick={() => toggleColumnVisibility(col.accessorKey)}
                                                        />
                                                    )}
                                                </div>
                                                
                                                <TextFilter
                                                    value={headerOverrides[col.accessorKey] ?? col.header}
                                                    onChange={(val) => handleHeaderChange(col.accessorKey, val)}
                                                    placeholder="Başlıq adı"
                                                />
                                            </th>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder ?? null}
                            </tr>
                        </thead>
                    )}
                </Droppable>
            </DragDropContext>
            <tbody>
                {filteredData.map((row: any, idx: any) => (
                    <tr key={idx}>
                        {orderedColumns.map((col: any) => (
                            <td key={col.accessorKey}>{row[col.accessorKey]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
