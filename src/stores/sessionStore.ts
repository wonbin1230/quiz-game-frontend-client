import { create } from 'zustand';

import { SessionState } from '../types/session';

interface SessionStore {
	state: SessionState,
	pendingJoin: boolean,
	isReconnecting: boolean,
	awaitingSnapshot: boolean,
	setState: (state: SessionState) => void,
	setPendingJoin: (pendingJoin: boolean) => void,
	setIsReconnecting: (isReconnecting: boolean) => void,
	setAwaitingSnapshot: (awaitingSnapshot: boolean) => void,
}

export const useSessionStore = create<SessionStore>((set) => ({
	state: SessionState.Initialize,
	pendingJoin: false,
	isReconnecting: false,
	awaitingSnapshot: false,
	setState: (state: SessionState) => set({ state }),
	setPendingJoin: (pendingJoin: boolean) => set({ pendingJoin }),
	setIsReconnecting: (isReconnecting: boolean) => set({ isReconnecting }),
	setAwaitingSnapshot: (awaitingSnapshot: boolean) => set({ awaitingSnapshot }),
}));
