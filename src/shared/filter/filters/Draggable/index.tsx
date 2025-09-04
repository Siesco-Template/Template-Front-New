import React from 'react';

import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { DragIcon, EyeIcon, EyeOffIcon } from '../../shared/icons';
import { FilterConfig } from '../../types';
import styles from './style.module.css';

interface DraggableProps {
    savedFilters: FilterConfig[];
    setSavedFilters: React.Dispatch<React.SetStateAction<FilterConfig[]>>;
    searchText?: string;
    storageKey: string;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const highlightMatch = (text: string, search?: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${escapeRegex(search)})`, 'gi');
    return text.replace(regex, (m) => `<span class="${styles.highlight}">${m}</span>`);
};

const SortableItem: React.FC<{
    item: FilterConfig;
    id: string;
    searchText?: string;
    onToggleVisibility: (key: string) => void;
}> = ({ item, id, searchText, onToggleVisibility }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            className={`${styles.savedFilterRow} ${isDragging ? styles.draggingItem : ''}`}
            style={style}
        >
            <div className={styles.dragIcon} {...attributes} {...listeners}>
                <DragIcon color="var(--content-tertiary)" />
                <span
                    dangerouslySetInnerHTML={{
                        __html: highlightMatch(String(item.label ?? item.column), searchText),
                    }}
                />
            </div>

            <div
                className={styles.visibilityToggle}
                style={{ cursor: 'pointer' }}
                onClick={() => onToggleVisibility(item.key)}
            >
                {item.visible !== false ? (
                    <EyeIcon color="var(--content-brand)" width={18} height={18} />
                ) : (
                    <EyeOffIcon color="var(--content-brand)" width={18} height={18} />
                )}
            </div>
        </div>
    );
};

const DraggableItems: React.FC<DraggableProps> = ({ savedFilters, setSavedFilters, searchText, storageKey }) => {
    const orderKey = `filter_order_${storageKey}`;
    const visibilityKey = `filter_visibility_${storageKey}`;

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor)
    );

    const ids = savedFilters.map((f) => String(f.key ?? f.column));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = ids.indexOf(String(active.id));
        const newIndex = ids.indexOf(String(over.id));
        if (oldIndex === -1 || newIndex === -1) return;

        const items = arrayMove(savedFilters, oldIndex, newIndex);
        setSavedFilters(items);
        localStorage.setItem(orderKey, JSON.stringify(items.map((i) => i.key)));
    };

    const toggleVisibility = (key: string) => {
        const updated = savedFilters.map((f) =>
            f.key === key ? { ...f, visible: f.visible === false ? true : false } : f
        );
        setSavedFilters(updated);

        const visibilityMap = updated.reduce<Record<string, boolean>>((acc, curr: any) => {
            acc[curr.key] = curr.visible !== false;
            return acc;
        }, {});
        localStorage.setItem(visibilityKey, JSON.stringify(visibilityMap));
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                <div className={styles.savesavedFilterRowContainer}>
                    {savedFilters.map((filter) => (
                        <SortableItem
                            key={String(filter.key)}
                            id={String(filter.key ?? filter.column)}
                            item={filter}
                            searchText={searchText}
                            onToggleVisibility={toggleVisibility}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default DraggableItems;
