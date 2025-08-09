// import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';

// import { getSizesOnStore } from './sizes.utils';

// export type SidebarWidthSizeState = 'sidebar-980' | 'sidebar-1400';
// export type NavbarHeightSizeState = 'navbar';
// export type SizesState = {
//     sidebarSize: Record<SidebarWidthSizeState, string>;
//     previousSidebarSize?: Record<SidebarWidthSizeState, string>;

//     navbarSize: Record<NavbarHeightSizeState, string>;
//     previousNavbarSize?: Record<NavbarHeightSizeState, string>;
// };

// export const useSizesStore = create<SizesState>()(
//     devtools((set, get) => ({
//         ...getSizesOnStore(),
//     }))
// );
