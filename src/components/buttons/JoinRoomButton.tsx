import React from 'react';

import { useSessionStore } from '../../stores/sessionStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useNoticeStore } from '../../stores/noticeStore';
import { SessionState } from '../../types/session';
import { UserLogin } from '../../socket/events/login';
import { JoinRoom } from '../../socket/events/room';
import { COPY } from '../../constants/copy';
import { normalizeNickname } from '../../constants/nickname';
import GameButton from './GameButton';

const JoinRoomButton = () => {
	const session = useSessionStore((s) => s.state);
	const pendingJoin = useSessionStore((s) => s.pendingJoin);
	const isReconnecting = useSessionStore((s) => s.isReconnecting);
	const awaitingSnapshot = useSessionStore((s) => s.awaitingSnapshot);
	const nicknameDraft = usePlayerStore((s) => s.nicknameDraft);
	const userId = usePlayerStore((s) => s.userId);

	const name = normalizeNickname(nicknameDraft);
	const connected =
		session === SessionState.ServerConnected || session === SessionState.LoggedIn;
	const canJoin =
		connected &&
		name.length > 0 &&
		!pendingJoin &&
		!isReconnecting &&
		!awaitingSnapshot;

	const onClick = () => {
		if (!canJoin) {
			return;
		}

		useNoticeStore.getState().clear();
		useSessionStore.getState().setPendingJoin(true);

		if (session === SessionState.LoggedIn && userId === name) {
			JoinRoom();
			return;
		}

		if (!UserLogin(name)) {
			useSessionStore.getState().setPendingJoin(false);
		}
	};

	return (
		<div className='flex items-center justify-center'>
			<GameButton onClick={onClick} disabled={!canJoin}>
				{COPY.joinCta}
			</GameButton>
		</div>
	);
};

export default JoinRoomButton;
