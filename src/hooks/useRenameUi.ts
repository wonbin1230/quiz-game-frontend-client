import { useGameStore } from '../stores/gameStore';
import { usePlayerStore } from '../stores/playerStore';
import { useRoomStore } from '../stores/roomStore';
import { useSessionStore } from '../stores/sessionStore';
import { isRenameAllowed } from '../socket/events/login';
import { normalizeNickname } from '../constants/nickname';

export const useRenameUi = (): {
	locked: boolean,
	allowed: boolean,
	canConfirm: boolean,
	nickname: string,
} => {
	const session = useSessionStore((s) => s.state);
	const pendingJoin = useSessionStore((s) => s.pendingJoin);
	const isReconnecting = useSessionStore((s) => s.isReconnecting);
	const awaitingSnapshot = useSessionStore((s) => s.awaitingSnapshot);
	const renameLocked = useSessionStore((s) => s.renameLocked);
	const roomState = useRoomStore((s) => s.room.roomState);
	const phase = useGameStore((s) => s.phase);
	const userId = usePlayerStore((s) => s.userId);
	const nicknameDraft = usePlayerStore((s) => s.nicknameDraft);

	const locked = pendingJoin || isReconnecting || awaitingSnapshot;
	const allowed = isRenameAllowed({
		state: session,
		renameLocked,
		roomState,
		phase,
	});
	const nickname = normalizeNickname(nicknameDraft);
	const dirty = nickname.length > 0 && nickname !== userId;
	const canConfirm = Boolean(userId) && allowed && dirty && !locked;

	return { locked, allowed, canConfirm, nickname };
};
