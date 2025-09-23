import { Checkbox } from 'antd';
import React, { useMemo, useState } from 'react';

import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';

import { CloseIcon } from '@/shared/icons';

import { exportToExcel } from '../exportToExcel';
import styles from './style.module.css';

interface Column {
    accessorKey: string;
    header: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    columns: Column[];
    data: any[];
}

const ExportColumnModal: React.FC<Props> = ({ isOpen, onClose, columns, data }) => {
    const visibleColumns = useMemo(() => columns.filter((c) => c.accessorKey !== 'actions'), [columns]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(visibleColumns.map((c) => c.accessorKey));
    const [searchTerm, setSearchTerm] = useState('');
    const [columnOrder, setColumnOrder] = useState(visibleColumns);

    const filteredColumns = useMemo(
        () => columnOrder.filter((col) => col.header.toLowerCase().includes(searchTerm.toLowerCase())),
        [searchTerm, columnOrder]
    );

    const toggleColumn = (key: string) => {
        setSelectedColumns((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    };

    const handleExport = () => {
        const selected = columnOrder.filter((col) => selectedColumns.includes(col.accessorKey));
        exportToExcel(selected, () => Promise.resolve(data));
        onClose();
    };

    const handleSelectAll = () => {
        setSelectedColumns(visibleColumns.map((c) => c.accessorKey));
    };

    const handleClearAll = () => {
        setSelectedColumns([]);
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const reordered = Array.from(columnOrder);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);
        setColumnOrder(reordered);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Endir</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <CloseIcon color="#667085" width={18} height={18} />
                    </button>
                </div>
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder="Axtar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchTerm && (
                        <button className={styles.clearSearch} onClick={() => setSearchTerm('')}>
                            <CloseIcon color="#667085" width={10} height={10} />
                        </button>
                    )}
                </div>

                <div className={styles.selectionControls}>
                    <Checkbox
                        checked={selectedColumns.length === visibleColumns.length}
                        onChange={(e) => {
                            if (e.target.checked) handleSelectAll();
                            else handleClearAll();
                        }}
                        className={styles.customCheckbox}
                    ></Checkbox>
                    <span className={styles.option}> Hamısını seç</span>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="columns-list">
                        {(provided) => (
                            <div className={styles.columnList} ref={provided.innerRef} {...provided.droppableProps}>
                                {filteredColumns.map((col, index) => (
                                    <Draggable draggableId={col.accessorKey} index={index} key={col.accessorKey}>
                                        {(provided, snapshot) => (
                                            <label
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`${styles.columnItem} ${snapshot.isDragging ? styles.dragging : ''}`}
                                            >
                                                <Checkbox
                                                    checked={selectedColumns.includes(col.accessorKey)}
                                                    onChange={() => toggleColumn(col.accessorKey)}
                                                ></Checkbox>

                                                <span className={styles.option}> {col.header}</span>
                                            </label>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <div className={styles.modalActions}>
                    <button onClick={onClose} className={styles.cancelBtn}>Ləğv et</button>
                    <button onClick={handleExport} className={styles.downloadBtn}>Endirməyə hazırla</button>
                </div>
            </div>
        </div>
    );
};

export default ExportColumnModal;
