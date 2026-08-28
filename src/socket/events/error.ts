import { GetSocket } from '../client';

import type { IServerError } from '../../types/server-response';
import { SessionState } from '../../types/session';
import { useSessionStore } from '../../stores/sessionStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useNoticeStore } from '../../stores/noticeStore';
import { COPY } from '../../constants/copy';

const mapLoginError = (code?: string) => {
	switch (code) {
		case 'CONFLICT':
			return COPY.nicknameTaken;
		case 'INVALID_STATE':
			return COPY.nicknameLocked;
		case 'VALIDATION':
			return COPY.nicknameInvalid;
		case 'LOCKED':
			return `${COPY.connecting}，${COPY.retry}`;
		default:
			return `${COPY.connecting}，${COPY.retry}`;
	}
};

const mapError = (data: IServerError) => {
	if (data.event === 'User:Login') {
		return mapLoginError(data.code);
	}

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

const revertLoginDraft = () => {
	const { userId } = usePlayerStore.getState();
	if (userId) {
		usePlayerStore.getState().setNicknameDraft(userId);
	}
};

const handleError = (data: IServerError) => {
	useSessionStore.getState().setPendingJoin(false);
	usePlayerStore.getState().setSubmitting(false);
	if (data.event === 'User:Login') {
		useSessionStore.getState().setAwaitingSnapshot(false);
		if (data.code === 'CONFLICT' || data.code === 'INVALID_STATE' || data.code === 'VALIDATION') {
			revertLoginDraft();
		}
		if (data.code === 'INVALID_STATE' && useSessionStore.getState().state === SessionState.InRoom) {
			useSessionStore.getState().setRenameLocked(true);
		}
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
