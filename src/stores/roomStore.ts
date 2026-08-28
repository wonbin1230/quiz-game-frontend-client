import { create } from 'zustand';

import { RoomState, type IRoom } from '../types/room';
import { ROOM_NAME } from '../constants/copy';

interface RoomStore {
	room: IRoom,
	setRoom: (room: IRoom) => void,
	setRoomId: (roomId: string) => void,
	setRoomState: (roomState: RoomState) => void,
	reset: () => void,
}

const emptyRoom: IRoom = {
	roomId: '',
	roomName: ROOM_NAME,
	roomState: RoomState.Prepare,
};

export const useRoomStore = create<RoomStore>((set) => ({
	room: emptyRoom,
	setRoom: (room: IRoom) => set({ room }),
	setRoomId: (roomId: string) => set((state) => ({ room: { ...state.room, roomId } })),
	setRoomState: (roomState: RoomState) => set((state) => ({ room: { ...state.room, roomState } })),
	reset: () => set({ room: emptyRoom }),
}));
