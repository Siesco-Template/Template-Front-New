import { create } from 'zustand';


import { NavigationItem } from './settings.contants';

type SettingsState = {
  navigationLinks: NavigationItem[];
  initialNavigationLinks: NavigationItem[];
};

type SettingsActions = {
  setNavigationLinks: (items: NavigationItem[]) => void;
  setInitialNavigationLinks: (items: NavigationItem[]) => void;
};

export const useSettingsStore = create<SettingsState & SettingsActions>()((set) => ({
  navigationLinks: [],
  initialNavigationLinks: [],

  setNavigationLinks: (items: NavigationItem[]) => set({ navigationLinks: items }),
  setInitialNavigationLinks: (items: NavigationItem[]) => set({ initialNavigationLinks: items }),
}));