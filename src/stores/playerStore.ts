import { create } from 'zustand';

import type { IPersonalResult, RevealFeedback } from '../types/game';

interface PlayerStore {
	userId: string,
	nicknameDraft: string,
	selectedOption: number | null,
	submitted: boolean,
	submitting: boolean,
	feedback: RevealFeedback | null,
	personalResult: IPersonalResult | null,
	setUserId: (userId: string) => void,
	setNicknameDraft: (nicknameDraft: string) => void,
	setSelectedOption: (selectedOption: number) => void,
	setSubmitted: (submitted: boolean) => void,
	setSubmitting: (submitting: boolean) => void,
	setFeedback: (feedback: RevealFeedback | null) => void,
	setPersonalResult: (personalResult: IPersonalResult) => void,
	hydrateFromSnapshot: (next: {
		selectedOption: number | null,
		submitted: boolean,
		feedback: RevealFeedback | null,
		personalResult: IPersonalResult | null,
	}) => void,
	resetRound: () => void,
	resetSession: () => void,
}

export const usePlayerStore = create<PlayerStore>((set) => ({
	userId: '',
	nicknameDraft: '',
	selectedOption: null,
	submitted: false,
	submitting: false,
	feedback: null,
	personalResult: null,
	setUserId: (userId: string) => set({ userId }),
	setNicknameDraft: (nicknameDraft: string) => set({ nicknameDraft }),
	setSelectedOption: (selectedOption: number) => set({ selectedOption }),
	setSubmitted: (submitted: boolean) => set({ submitted }),
	setSubmitting: (submitting: boolean) => set({ submitting }),
	setFeedback: (feedback: RevealFeedback | null) => set({ feedback }),
	setPersonalResult: (personalResult: IPersonalResult) => set({ personalResult }),
	hydrateFromSnapshot: (next) => set({
		selectedOption: next.selectedOption,
		submitted: next.submitted,
		submitting: false,
		feedback: next.feedback,
		personalResult: next.personalResult,
	}),
	resetRound: () => set({
		selectedOption: null,
		submitted: false,
		submitting: false,
		feedback: null,
	}),
	resetSession: () => set({
		selectedOption: null,
		submitted: false,
		submitting: false,
		feedback: null,
		personalResult: null,
	}),
}));
