import { GetSocket } from '../client';

import type { IServerUserLogin } from '../../types/server-response';
import { SessionState } from '../../types/session';
import { RoomState } from '../../types/room';
import { GamePhase } from '../../types/game';
import { useSessionStore } from '../../stores/sessionStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useRoomStore } from '../../stores/roomStore';
import { useGameStore } from '../../stores/gameStore';
import { useNoticeStore } from '../../stores/noticeStore';
import { normalizeNickname } from '../../constants/nickname';
import { persistUserId } from '../../constants/storage';

interface RenameGate {
	state: SessionState,
	renameLocked: boolean,
	roomState: RoomState,
	phase: GamePhase,
}

export const isRenameAllowed = (gate?: RenameGate): boolean => {
	const state = gate?.state ?? useSessionStore.getState().state;
	const renameLocked = gate?.renameLocked ?? useSessionStore.getState().renameLocked;
	if (renameLocked) {
		return false;
	}

	if (state !== SessionState.InRoom) {
		return true;
	}

	const roomState = gate?.roomState ?? useRoomStore.getState().room.roomState;
	const phase = gate?.phase ?? useGameStore.getState().phase;
	return roomState === RoomState.Prepare && phase === GamePhase.Idle;
};

export const UserLogin = (userId: string): boolean => {
	const name = normalizeNickname(userId);
	if (!name) {
		return false;
	}

	const current = usePlayerStore.getState().userId;
	if (current && current !== name && !isRenameAllowed()) {
		return false;
	}

	useSessionStore.getState().setAwaitingSnapshot(true);
	GetSocket().emit('User:Login', { userId: name });
	return true;
};

export const SubmitRename = (rawName: string) => {
	const name = normalizeNickname(rawName);
	const current = usePlayerStore.getState().userId;
	if (!name || !current || name === current || !isRenameAllowed()) {
		return;
	}

	useNoticeStore.getState().clear();
	UserLogin(name);
};

export const OnUserLogin = () => {
	GetSocket().on('User:Login', (data: IServerUserLogin) => {
		const userId = normalizeNickname(data.userId);
		usePlayerStore.getState().setUserId(userId);
		usePlayerStore.getState().setNicknameDraft(userId);
		persistUserId(userId);

		if (useSessionStore.getState().state !== SessionState.InRoom) {
			useSessionStore.getState().setState(SessionState.LoggedIn);
		}
	});
};
