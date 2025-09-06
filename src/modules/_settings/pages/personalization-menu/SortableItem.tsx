import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { DragIcon, EyeIcon, EyeSlashIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import { NewNavigationItem } from '.';
import styles from './personalization-menu.module.css';

interface Props {
    item: NewNavigationItem;
    level?: number;
    onToggleVisible: (id: string) => void;
    containerClassName?: string;
    labelClassName?: string;
}

export default function SortableItem({ item, level = 0, onToggleVisible, containerClassName, labelClassName }: Props) {
    if (!item.id) return null;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        paddingLeft: level * 24 + 8,
        zIndex: isDragging ? 999 : undefined,
        boxShadow: isDragging ? '0 2px 8px rgba(0,0,0,0.2)' : undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cls(styles.sortableItem, containerClassName)}
            {...attributes}
            role="button"
            tabIndex={0}
            aria-label={`Drag to reorder ${item.title}`}
        >
            <div className={styles.submenuItem}>
                <div className="flex items-center gap-2">
                    <span {...listeners} role="button" tabIndex={0} aria-label="Drag handle">
                        <DragIcon width={16} height={16} color="var(--content-tertiary)" />
                    </span>
                    <span className={cls(styles.label, labelClassName)}>{item.title}</span>
                </div>

                {item.show ? (
                    <EyeIcon
                        width={15}
                        height={15}
                        color="var(--content-brand)"
                        onClick={() => item.id && onToggleVisible(item.id)}
                    />
                ) : (
                    <EyeSlashIcon
                        width={15}
                        height={15}
                        color="var(--content-brand)"
                        onClick={() => item.id && onToggleVisible(item.id)}
                    />
                )}
            </div>
        </div>
    );
}
