import { ExitRoomToLobby, GetSocket } from '../client';

import type { IServerJoinRoom, IServerLeaveRoom, IServerRoomClosed } from '../../types/server-response';
import { SessionState } from '../../types/session';
import { RoomState } from '../../types/room';
import { useSessionStore } from '../../stores/sessionStore';
import { useRoomStore } from '../../stores/roomStore';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useNoticeStore } from '../../stores/noticeStore';
import { COPY, ROOM_NAME } from '../../constants/copy';

export const JoinRoom = () => {
	GetSocket().emit('UserGame:JoinRoom', { roomName: ROOM_NAME });
};

export const LeaveRoom = () => {
	GetSocket().emit('UserGame:LeaveRoom');
};

export const OnJoinRoom = () => {
	GetSocket().on('UserGame:JoinRoom', (data: IServerJoinRoom) => {
		useRoomStore.getState().setRoomId(data.roomId);
		useRoomStore.getState().setRoomState(RoomState.Prepare);
		useSessionStore.getState().setPendingJoin(false);
		useSessionStore.getState().setIsReconnecting(false);
		useSessionStore.getState().setState(SessionState.InRoom);
		useGameStore.getState().resetRound();
		usePlayerStore.getState().resetSession();
		useNoticeStore.getState().clear();
	});
};

export const OnLeaveRoom = () => {
	GetSocket().on('UserGame:LeaveRoom', (_data: IServerLeaveRoom) => {
		ExitRoomToLobby();
	});
};

export const OnRoomClosed = () => {
	GetSocket().on('Room:Closed', (_data: IServerRoomClosed) => {
		ExitRoomToLobby();
		useNoticeStore.getState().setNotice(COPY.roomClosed);
	});
};
