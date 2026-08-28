import React from 'react';

import { useSessionStore } from '../stores/sessionStore';
import { usePlayerStore } from '../stores/playerStore';
import { SessionState } from '../types/session';
import { COPY } from '../constants/copy';
import JoinRoomButton from './buttons/JoinRoomButton';
import Notice from './Notice';
import StageFrame from './StageFrame';

const Lobby = () => {
	const session = useSessionStore((s) => s.state);
	const pendingJoin = useSessionStore((s) => s.pendingJoin);
	const isReconnecting = useSessionStore((s) => s.isReconnecting);
	const awaitingSnapshot = useSessionStore((s) => s.awaitingSnapshot);
	const nicknameDraft = usePlayerStore((s) => s.nicknameDraft);
	const userId = usePlayerStore((s) => s.userId);
	const loggedIn = session === SessionState.LoggedIn;
	const connecting = session === SessionState.Initialize || isReconnecting || awaitingSnapshot;
	const locked = loggedIn || pendingJoin || isReconnecting || awaitingSnapshot || userId.length > 0;

	return (
		<StageFrame>
			<div className='flex h-full min-h-0 flex-col'>
				<div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-2'>
					<input
						value={loggedIn ? userId : nicknameDraft}
						onChange={(event) => {
							usePlayerStore.getState().setNicknameDraft(event.target.value);
						}}
						disabled={locked}
						maxLength={16}
						placeholder={COPY.nicknamePlaceholder}
						autoComplete='nickname'
						className='w-full rounded-sm border border-white/25 bg-white/5 px-4 py-3.5 text-center text-lg tracking-[0.15em] text-white/90 outline-none backdrop-blur-sm placeholder:text-white/35 focus:border-white/50 disabled:opacity-60'
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
