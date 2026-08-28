import { GetSocket } from '../client';

import type { IServerUserLogin } from '../../types/server-response';
import { SessionState } from '../../types/session';
import { useSessionStore } from '../../stores/sessionStore';
import { usePlayerStore } from '../../stores/playerStore';
import { persistUserId } from '../../constants/storage';

export const UserLogin = (userId: string) => {
	usePlayerStore.getState().setUserId(userId);
	useSessionStore.getState().setAwaitingSnapshot(true);
	GetSocket().emit('User:Login', { userId });
};

export const OnUserLogin = () => {
	GetSocket().on('User:Login', (data: IServerUserLogin) => {
		usePlayerStore.getState().setUserId(data.userId);
		persistUserId(data.userId);

		if (useSessionStore.getState().state !== SessionState.InRoom) {
			useSessionStore.getState().setState(SessionState.LoggedIn);
		}
	});
};
