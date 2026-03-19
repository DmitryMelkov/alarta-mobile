import { create } from 'zustand';

export type DashboardId = 'mechanicAssist' | 'analytics';

type UiState = {
  selectedDashboard: DashboardId;
  setSelectedDashboard: (id: DashboardId) => void;
  isDarkTheme: boolean;
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  selectedDashboard: 'mechanicAssist',
  setSelectedDashboard: (id) => set({ selectedDashboard: id }),
  isDarkTheme: false,
  toggleTheme: () => set((state) => ({ isDarkTheme: !state.isDarkTheme })),
  isSidebarCollapsed: true,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
