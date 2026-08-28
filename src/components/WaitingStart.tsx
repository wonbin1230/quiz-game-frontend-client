import React from 'react';

import { useGameStore } from '../stores/gameStore';
import { useTypingText } from '../hooks/useTypingText';
import { useRenameUi } from '../hooks/useRenameUi';
import { COPY } from '../constants/copy';
import { GamePhase } from '../types/game';
import { SubmitRename } from '../socket/events/login';
import LeaveRoomButton from './buttons/LeaveRoomButton';
import NicknameField from './NicknameField';
import Notice from './Notice';

const WaitingStart = () => {
	const phase = useGameStore((s) => s.phase);
	const started = phase === GamePhase.Lobby;
	const title = started ? COPY.startSoon : COPY.waitingTitle;
	const displayText = useTypingText(title, 100);
	const renameUi = useRenameUi();

	return (
		<div className='flex h-full min-h-0 flex-col'>
			<div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 text-center'>
				<div className='text-2xl tracking-[0.15em] text-white/90 sm:text-4xl'>
					{displayText}
				</div>
				{!started && (
					<div className='text-sm tracking-[0.2em] text-white/55 sm:text-lg'>
						{COPY.waitingSubtitle}
					</div>
				)}
				{renameUi.allowed && (
					<div className='mt-2 flex w-full flex-col items-center'>
						<NicknameField
							disabled={renameUi.locked}
							showConfirm={renameUi.canConfirm}
							confirmDisabled={!renameUi.canConfirm}
							onConfirm={() => {
								SubmitRename(renameUi.nickname);
							}}
						/>
					</div>
				)}
				<Notice />
			</div>
			<div className='flex h-14 shrink-0 items-center justify-center'>
				{!started && <LeaveRoomButton />}
			</div>
		</div>
	);
};

export default WaitingStart;
