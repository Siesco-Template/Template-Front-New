import { useRef, useState } from 'react';

import { cls } from '@/shared/utils';

import ChevronRightIcon from '../../shared/icons/chevron-right.svg?react';
import FolderOutlineIcon from '../../shared/icons/folder-outline.svg?react';
import HomeIcon from '../../shared/icons/home.svg?react';
import { AddressBarProps } from '../../types';

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
        const newPath = '/Users/' + targetSegments.join('/');
        onPathChange(newPath);
    };

    const handleHomeClick = () => {
        onPathChange('/Users');
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
        <div
            className={cls(
                'flex items-center !gap-2 !mx-2 !my-0.5 !px-2 !py-0.5 !bg-[#F5F5F5] !rounded-[4px] !border-[0.5px] !border-[#B2BBC6]',
                className
            )}
        >
            <button onClick={handleHomeClick} className="!p-1 group" title="Go home" tabIndex={editMode ? -1 : 0}>
                <HomeIcon
                    width={20}
                    height={20}
                    className="!text-[#767676] !group-hover:text-[#1E1E1E] transition-colors"
                />
            </button>
            {editMode ? (
                <input
                    ref={inputRef}
                    className="flex-1 !border-none !outline-none !bg-transparent !text-[#8E8E93] !text-[14px] !leading-5"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    autoFocus
                />
            ) : (
                <div className="flex items-center !gap-2 select-none">
                    {pathSegments.map((segment, index) => (
                        <div key={index} className="flex items-center justify-center !gap-2 !group">
                            <ChevronRightIcon className="!text-[#667085] !group-hover:!text-[#1E1E1E]" />
                            <button
                                onClick={() => handleSegmentClick(index)}
                                className="flex items-center justify-center !gap-1 !text-[14px] leading-5 !text-[#8E8E93] !px-2 !py-1 !group-hover:text-[#1E1E1E]"
                                tabIndex={0}
                            >
                                <FolderOutlineIcon
                                    width={20}
                                    height={20}
                                    className="!text-[#8E8E93] !group-hover:!text-[#1E1E1E] transition-colors"
                                />
                                {segment}
                            </button>
                        </div>
                    ))}
                    <div className="flex items-center justify-center !gap-2 !group">
                        <ChevronRightIcon className="!text-[#667085]" />
                        <button
                            onClick={handleBarClick}
                            className="!text-[14px] leading-5 !text-[#8E8E93] !group-hover:text-[#1E1E1E]"
                            tabIndex={0}
                        >
                            Type...
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
