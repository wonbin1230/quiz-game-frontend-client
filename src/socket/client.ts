import io, { type Socket } from 'socket.io-client';

import { SessionState } from '../types/session';
import { useSessionStore } from '../stores/sessionStore';
import { useGameStore } from '../stores/gameStore';
import { useRoomStore } from '../stores/roomStore';
import { usePlayerStore } from '../stores/playerStore';
import { clampNickname } from '../constants/nickname';
import { loadPersistedUserId, persistUserId } from '../constants/storage';

const host = import.meta.env.VITE_SERVER_SOCKET_URL;
const port = import.meta.env.VITE_SERVER_SOCKET_PORT;
const socketUrl = host.includes('://') ? `${host}:${port}` : `http://${host}:${port}`;

let clientIO: Socket | null = null;

export const HydratePersistedUser = () => {
	const userId = clampNickname(loadPersistedUserId());
	if (!userId) {
		return;
	}

	usePlayerStore.getState().setUserId(userId);
	usePlayerStore.getState().setNicknameDraft(userId);
	persistUserId(userId);
};

export const ExitRoomToLobby = () => {
	useSessionStore.getState().setState(SessionState.LoggedIn);
	useSessionStore.getState().setPendingJoin(false);
	useSessionStore.getState().setIsReconnecting(false);
	useSessionStore.getState().setAwaitingSnapshot(false);
	useSessionStore.getState().setRenameLocked(false);
	useGameStore.getState().resetRound();
	useRoomStore.getState().reset();
	usePlayerStore.getState().resetSession();
};

export const ConnectToServer = () => {
	if (clientIO) {
		return clientIO;
	}

	HydratePersistedUser();

	const socket = io(socketUrl, {
		transports: ['websocket'],
		reconnection: true,
		reconnectionAttempts: Infinity,
		reconnectionDelay: 500,
		reconnectionDelayMax: 3000,
	});
	clientIO = socket;

	socket.on('connect', () => {
		const { state } = useSessionStore.getState();
		if (state !== SessionState.InRoom && state !== SessionState.LoggedIn) {
			useSessionStore.getState().setState(SessionState.ServerConnected);
		}
		if (state !== SessionState.InRoom) {
			useSessionStore.getState().setIsReconnecting(false);
		}

		const { userId } = usePlayerStore.getState();
		if (userId) {
			useSessionStore.getState().setAwaitingSnapshot(true);
			socket.emit('User:Login', { userId });
		}
		console.log('Connected to server');
	});

	socket.on('disconnect', () => {
		useSessionStore.getState().setIsReconnecting(true);
		console.log('Disconnected from server');
	});
};

export const GetSocket = () => {
	if (!clientIO) {
		throw new Error('Socket not connected');
	}

	return clientIO;
};
