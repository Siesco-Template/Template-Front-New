import { ChevronDown } from 'lucide-react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { cls } from '@/shared/utils';

import { S_Button } from '@/ui';

import { ViewMode, ViewStyleSelectorProps } from '../../types';

const viewModeLabels: Record<ViewMode, string> = {
    list: 'Siyahı',
    small: 'Kiçik ikonlar',
    medium: 'Orta ikonlar',
    large: 'Böyük ikonlar',
    tree: 'Ağac görünüşü',
};

export function ViewStyleSelector({ currentMode, onChange, className }: ViewStyleSelectorProps) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <S_Button variant="main-20" color="secondary" className={className}>
                    Görünüş
                    <ChevronDown width={14} height={14} />
                </S_Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="!min-w-[170px] !bg-[#F5F7F9] !text-[#21201C] !rounded-[12px] !py-3"
                    sideOffset={5}
                >
                    {(Object.keys(viewModeLabels) as ViewMode[]).map((mode) => {
                        return (
                            <DropdownMenu.Item
                                key={mode}
                                className={cls(
                                    '!px-5 !py-2 !text-[14px] !text-[#21201C] cursor-pointer transition-all duration-300 outline-none',
                                    '!focus:outline-none !focus:bg-[#EDF2FA]',
                                    mode === currentMode && '!bg-[#EDF2FA]'
                                )}
                                onClick={() => onChange(mode)}
                            >
                                {viewModeLabels[mode]}
                            </DropdownMenu.Item>
                        );
                    })}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
