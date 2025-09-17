import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';

import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    closestCenter,
    defaultDropAnimation,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { DragIcon } from '@/shared/icons';

import { useSettingsStore } from '../../settings.store';
import { getPersonalizationDiff } from '../../settings.utils';
import SortableItem from './SortableItem';
import styles from './personalization-menu.module.css';

export default function PersonalizationMenu() {
    const { navigationLinks, initialNavigationLinks, setNavigationLinks } = useSettingsStore();

    const { setHasChange } = useOutletContext<{ setHasChange: (value: boolean) => void }>();

    const deepEqual = (a: any, b: any): boolean => {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const isSame = deepEqual(navigationLinks, initialNavigationLinks);
        setHasChange(!isSame);
    }, [navigationLinks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 100, // 100ms delay for touch devices
                tolerance: 5, // 5px movement tolerance
            },
        }),
        useSensor(KeyboardSensor)
    );

    const dropAnimation = {
        ...defaultDropAnimation,
        dragSourceOpacity: 0.5,
    };

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        // 1) Try to reorder top-level
        const oldIndex = navigationLinks.findIndex((l) => l.id === active.id);
        const newIndex = navigationLinks.findIndex((l) => l.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            setNavigationLinks(arrayMove(navigationLinks, oldIndex, newIndex));
            setHasChange(true);
            return;
        }

        // 2) Otherwise try to reorder within subLinks
        setNavigationLinks(
            navigationLinks.map((section) => {
                if (!section.subLinks) return section;
                const oldSub = section.subLinks.findIndex((s) => s.id === active.id);
                const newSub = section.subLinks.findIndex((s) => s.id === over.id);
                if (oldSub !== -1 && newSub !== -1 && oldSub !== newSub) {
                    setHasChange(true);
                    return {
                        ...section,
                        subLinks: arrayMove(section.subLinks, oldSub, newSub),
                    };
                }
                return section;
            })
        );
    }

    function toggleVisibility(id: string) {
        const items = navigationLinks.map((item) => {
            if (item.id === id) {
                return { ...item, show: !item.show };
            }
            if (item.subLinks) {
                return {
                    ...item,
                    subLinks: item.subLinks.map((sub) => (sub.id === id ? { ...sub, show: !sub.show } : sub)),
                };
            }
            return item;
        });
        setNavigationLinks(items);
        setHasChange(true);
    }

    const activeItem = activeId
        ? [...navigationLinks, ...navigationLinks.flatMap((l) => l.subLinks || [])].find((item) => item.id === activeId)
        : null;

    const isReady = navigationLinks.length > 0;

    useEffect(() => {
        if (isReady) {
            setNavigationLinks(navigationLinks);
        }
    }, [isReady]);

    useEffect(() => {
        getPersonalizationDiff(navigationLinks, initialNavigationLinks);
    }, [navigationLinks]);

    if (!isReady) {
        return (
            <div className="p-4">
                <p>Yüklənir...</p>
            </div>
        );
    }

    return (
        <div
            className="p-4"
            style={{ width: '100%', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingRight: '16px' }}
        >
            <div className={styles.settingsHeader}>
                <h2 className={styles.headerTitle}>Fərdiləşdirmə menyusu</h2>
                <p className={styles.headerDescription}>
                    Menyuda elementlərin sırası, görünürlüğü və digər parametrlər burada tənzimlənə bilər.
                </p>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            >
                <SortableContext items={navigationLinks.map((l) => l.id!)} strategy={verticalListSortingStrategy}>
                    {navigationLinks.map((section) => (
                        <div key={section.id} style={{ marginBottom: '14px' }}>
                            <SortableItem
                                item={section}
                                level={0}
                                onToggleVisible={toggleVisibility}
                                containerClassName={
                                    section.subLinks && section.subLinks?.length > 0 ? styles.singleItem : ''
                                }
                                labelClassName={styles.singleItemLabel}
                            />

                            {section.subLinks && section.subLinks.length > 0 && (
                                <div className={styles.subLinksContainer}>
                                    <SortableContext
                                        items={section.subLinks.map((s) => s.id!)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {section.subLinks.map((sub) => (
                                            <SortableItem
                                                key={sub.id}
                                                item={sub}
                                                level={1}
                                                onToggleVisible={toggleVisibility}
                                                containerClassName={styles.noborder}
                                            />
                                        ))}
                                    </SortableContext>
                                </div>
                            )}
                        </div>
                    ))}
                </SortableContext>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeItem ? (
                        <div className={styles.sortableItem}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>
                                    <DragIcon width={16} height={16} color="var(--content-tertiary)" />
                                </span>
                                <span className={styles.label}>{activeItem.title}</span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
