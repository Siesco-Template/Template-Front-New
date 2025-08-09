// src/path/to/sizes.store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { DefaultSizes, NavbarSizeOption, SidebarSizeOption } from '../settings.contants';

export type SizesState = {
    sidebarSize: SidebarSizeOption;
    navbarSize: NavbarSizeOption;
    setSidebarSize: (size: SidebarSizeOption) => void;
    setNavbarSize: (size: NavbarSizeOption) => void;
};

export const useSizesStore = create<SizesState>()(
    devtools((set) => ({
        sidebarSize: DefaultSizes.sidebarSize,
        navbarSize: DefaultSizes.navbarSize,

        setSidebarSize: (size) => set({ sidebarSize: size }),
        setNavbarSize: (size) => set({ navbarSize: size }),
    }))
);
