import React from 'react';

import { useSessionStore } from '../stores/sessionStore';
import { SessionState } from '../types/session';
import { COPY } from '../constants/copy';
import { SubmitRename } from '../socket/events/login';
import { useRenameUi } from '../hooks/useRenameUi';
import JoinRoomButton from './buttons/JoinRoomButton';
import NicknameField from './NicknameField';
import Notice from './Notice';
import StageFrame from './StageFrame';

const Lobby = () => {
	const session = useSessionStore((s) => s.state);
	const isReconnecting = useSessionStore((s) => s.isReconnecting);
	const awaitingSnapshot = useSessionStore((s) => s.awaitingSnapshot);
	const renameUi = useRenameUi();
	const connecting = session === SessionState.Initialize || isReconnecting || awaitingSnapshot;

	return (
		<StageFrame>
			<div className='flex h-full min-h-0 flex-col'>
				<div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-2'>
					<img
						src={`${import.meta.env.BASE_URL}yuyu.png`}
						alt=''
						className='w-10/12 object-contain'
					/>
					<NicknameField
						disabled={renameUi.locked}
						showConfirm={renameUi.canConfirm}
						confirmDisabled={!renameUi.canConfirm}
						onConfirm={() => {
							SubmitRename(renameUi.nickname);
						}}
					/>
					{connecting && (
						<p className='text-sm tracking-[0.2em] text-white/50'>
							{COPY.connecting}
						</p>
					)}
					<Notice />
				</div>
				<div className='flex h-14 shrink-0 items-center justify-center'>
					<JoinRoomButton />
				</div>
			</div>
		</StageFrame>
	);
};

export default Lobby;
