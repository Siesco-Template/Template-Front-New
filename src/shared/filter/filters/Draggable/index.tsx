import React, { useEffect, useState } from 'react';

import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';

import { DragIcon, EyeIcon, EyeOffIcon } from '../../shared/icons';
import { FilterConfig } from '../../types';
import styles from './style.module.css';

interface DraggableProps {
    savedFilters: FilterConfig[];
    setSavedFilters: React.Dispatch<React.SetStateAction<FilterConfig[]>>;
    searchText?: string;
    storageKey: string;
}

const DraggableItems: React.FC<DraggableProps> = ({ savedFilters, setSavedFilters, searchText, storageKey }) => {
    const orderKey = `filter_order_${storageKey}`;
    const visibilityKey = `filter_visibility_${storageKey}`;

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(savedFilters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSavedFilters(items);

        const newOrder = items.map((item) => item.key);
        localStorage.setItem(orderKey, JSON.stringify(newOrder));
    };

    const highlightMatch = (text: string, search: string) => {
        if (!search) return text;
        const regex = new RegExp(`(${search})`, 'gi');
        return text.replace(regex, (match) => `<span class=${styles.highlight}>${match}</span>`);
    };

    const toggleVisibility = (key: string) => {
        const updatedFilters = savedFilters.map((filter) =>
            filter.key === key ? { ...filter, visible: filter.visible === false ? true : false } : filter
        );

        setSavedFilters(updatedFilters);

        const visibilityMap = updatedFilters.reduce(
            (acc, curr) => {
                acc[curr.key] = curr.visible !== false;
                return acc;
            },
            {} as Record<string, boolean>
        );
        localStorage.setItem(visibilityKey, JSON.stringify(visibilityMap));
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="savedFilters">
                {(provided) => (
                    <div
                        className={styles.savesavedFilterRowContainer}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {savedFilters.map((filter, index) => {
                            return (
                                <Draggable
                                    key={filter.key}
                                    draggableId={filter?.key?.toString() || filter?.column?.toString()}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`${styles.savedFilterRow} ${snapshot.isDragging ? styles.draggingItem : ''}`}
                                            style={{ ...provided.draggableProps.style }}
                                        >
                                            <div className={styles.dragIcon}>
                                                <DragIcon color="#546881" />
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: highlightMatch(
                                                            filter.label || filter.column,
                                                            searchText || ''
                                                        ),
                                                    }}
                                                />
                                            </div>

                                            <div
                                                className={styles.visibilityToggle}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => toggleVisibility(filter.key)}
                                            >
                                                {filter.visible !== false ? (
                                                    <EyeIcon color="#909DAD" width={18} height={18} />
                                                ) : (
                                                    <EyeOffIcon color="#909DAD" width={18} height={18} />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};
export default DraggableItems;
