import { GetSocket } from '../client';

import type { IServerError } from '../../types/server-response';
import { SessionState } from '../../types/session';
import { useSessionStore } from '../../stores/sessionStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useNoticeStore } from '../../stores/noticeStore';
import { COPY } from '../../constants/copy';

const mapError = (data: IServerError) => {
	switch (data.code) {
		case 'NOT_FOUND':
			return '婚禮尚未開始，請稍候再試';
		case 'INVALID_STATE':
			return data.event === 'UserGame:SubmitAnswer' ? '此時無法作答' : '此時無法入場';
		case 'CONFLICT':
			return '你已在婚禮現場';
		case 'VALIDATION':
			return COPY.retry;
		case 'UNAUTHORIZED':
		case 'LOCKED':
			return `${COPY.connecting}，${COPY.retry}`;
		default:
			return `${COPY.connecting}，${COPY.retry}`;
	}
};

const handleError = (data: IServerError) => {
	useSessionStore.getState().setPendingJoin(false);
	usePlayerStore.getState().setSubmitting(false);
	if (data.event === 'User:Login') {
		useSessionStore.getState().setAwaitingSnapshot(false);
	}

	const inRoom = useSessionStore.getState().state === SessionState.InRoom;
	if (inRoom && (data.code === 'LOCKED' || data.code === 'UNAUTHORIZED')) {
		return;
	}

	useNoticeStore.getState().setNotice(mapError(data));
};

export const OnSocketErrors = () => {
	const socket = GetSocket();

	socket.on('error', handleError);
	socket.on('User:Login:error', handleError);
	socket.on('UserGame:JoinRoom:error', handleError);
	socket.on('UserGame:LeaveRoom:error', handleError);
	socket.on('UserGame:SubmitAnswer:error', handleError);
};
