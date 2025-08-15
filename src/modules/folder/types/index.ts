export type ViewMode = 'list' | 'small' | 'medium' | 'large' | 'tree';

export type SelectionAction = 'select' | 'selectAll' | 'clear' | 'toggle';

export interface FolderItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    path: string;
    icon?: string;
    updateDate?: Date;
    createDate?: Date;
    children?: FolderItem[];
    isExpanded?: boolean;
    permissions?: {
        canView: boolean;
        canEdit: boolean;
        canDelete: boolean;
        canMove: boolean;
        canCopy: boolean;
        canDownload: boolean;
        canComment: boolean;
        canChangeIcon: boolean;
    };
    contextMenu?: {
        actions: Array<{
            label: string;
            onClick: () => void;
        }>;
    };
}

export interface FolderProps {
    items: FolderItem[];
    currentPath: string;
    viewMode?: ViewMode;
    onPathChange?: (path: string) => void;
    onSearch?: (query: string) => void;
    onViewModeChange?: (mode: ViewMode) => void;
    onItemClick?: (item: FolderItem | null, event: React.MouseEvent, action?: SelectionAction) => void;
    onItemDoubleClick?: (item: FolderItem) => void;
    selectedItems?: Set<string>;
    className?: string;
    onItemsChange?: (items: FolderItem[]) => void;
    addressBarProps?: Partial<AddressBarProps>;
    onMove?: () => void;
}

export interface AddressBarProps {
    path: string;
    onPathChange: (path: string) => void;
    className?: string;
}

export interface SearchBarProps {
    onSearch: (query: string) => void;
    className?: string;
}

export interface ViewStyleSelectorProps {
    currentMode: ViewMode;
    onChange: (mode: ViewMode) => void;
    className?: string;
}

export interface FolderGridProps {
    items: FolderItem[];
    viewMode: ViewMode;
    onItemClick: (item: FolderItem | null, event: React.MouseEvent, action?: SelectionAction) => void;
    onItemDoubleClick?: (item: FolderItem) => void;
    selectedItems: FolderItem[];
    isDragging?: boolean;
    dragStartPoint?: { x: number; y: number } | null;
    className?: string;
    onRename?: () => void;
    onDelete?: () => void;
    onCopy?: () => void;
    onMove?: () => void;
    onDetails?: (item: FolderItem) => void;
    onCopyPath?: (item: FolderItem) => void;
    onComment?: (item: FolderItem) => void;
    onChangeIcon?: (item: FolderItem) => void;
    hideContextMenu?: boolean;
    itemRefs?: { el: HTMLDivElement; item: FolderItem }[];
    onItemsChange?: (path: string, isAppend?: boolean) => Promise<void>;
    isSearchMode?: boolean;
}
