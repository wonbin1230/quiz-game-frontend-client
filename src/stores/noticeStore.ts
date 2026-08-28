import { create } from 'zustand';

interface NoticeStore {
	notice: string | null,
	setNotice: (notice: string | null) => void,
	clear: () => void,
}

export const useNoticeStore = create<NoticeStore>((set) => ({
	notice: null,
	setNotice: (notice: string | null) => set({ notice }),
	clear: () => set({ notice: null }),
}));
