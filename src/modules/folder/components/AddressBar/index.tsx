import { useRef, useState } from 'react';

import { cls } from '@/shared/utils';

import ChevronRightIcon from '../../shared/icons/chevron-right.svg?react';
import FolderOutlineIcon from '../../shared/icons/folder-outline.svg?react';
import HomeIcon from '../../shared/icons/home.svg?react';
import { AddressBarProps } from '../../types';
import styles from './style.module.css';

interface AddressBarExtendedProps extends AddressBarProps {
    onPathNotFound?: (path: string) => void;
    validatePath?: (path: string) => Promise<boolean>;
}

export function AddressBar({ path, onPathChange, className, onPathNotFound, validatePath }: AddressBarExtendedProps) {
    const pathSegments = path.split('/').filter(Boolean).slice(1);
    const [editMode, setEditMode] = useState(false);
    const [inputValue, setInputValue] = useState(path);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSegmentClick = (index: number) => {
        const targetSegments = pathSegments.slice(0, index + 1);
        const newPath = '/Organizations/' + targetSegments.join('/');
        onPathChange(newPath);
    };

    const handleHomeClick = () => {
        onPathChange('/Organizations/');
    };

    const handleBarClick = (e: React.MouseEvent) => {
        // Only trigger edit mode if clicking on the bar background, not a segment or button
        if (e.target === e.currentTarget) {
            setEditMode(true);
            setInputValue(path);
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    };

    const handleInputBlur = () => {
        setEditMode(false);
    };

    const handleInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const isValid = await validatePath?.(inputValue);
            if (validatePath && !isValid) {
                e.preventDefault();
                onPathNotFound?.(inputValue);
                setEditMode(false);
                return;
            }
            onPathChange(inputValue);
            setEditMode(false);
        } else if (e.key === 'Escape') {
            setEditMode(false);
        }
    };

    return (
        <div className={cls(styles.container, className)}>
            <button onClick={handleHomeClick} className={styles.homeBtn} title="Go home" tabIndex={editMode ? -1 : 0}>
                <HomeIcon width={16} height={16} className={styles.homeIcon} />
            </button>

            {editMode ? (
                <input
                    ref={inputRef}
                    className={styles.input}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    autoFocus
                />
            ) : (
                <div className={styles.path}>
                    {pathSegments.map((segment, index) => (
                        <div key={index} className={styles.segmentGroup}>
                            <ChevronRightIcon className={styles.chevron} />
                            <button
                                onClick={() => handleSegmentClick(index)}
                                className={styles.segmentBtn}
                                tabIndex={0}
                            >
                                <FolderOutlineIcon width={16} height={16} className={styles.folderIcon} />
                                {segment}
                            </button>
                        </div>
                    ))}
                    <div className={styles.tailGroup}>
                        <ChevronRightIcon className={styles.tailChevron} />
                        <button onClick={handleBarClick} className={styles.tailBtn} tabIndex={0}>
                            Type...
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
