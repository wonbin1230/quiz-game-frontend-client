import React from 'react';

import { useGameStore } from '../stores/gameStore';
import { useTypingText } from '../hooks/useTypingText';
import { COPY } from '../constants/copy';
import { GamePhase } from '../types/game';
import LeaveRoomButton from './buttons/LeaveRoomButton';

const WaitingStart = () => {
	const phase = useGameStore((s) => s.phase);
	const started = phase === GamePhase.Lobby;
	const title = started ? COPY.startSoon : COPY.waitingTitle;
	const displayText = useTypingText(title, 100);

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
			</div>
			<div className='flex h-14 shrink-0 items-center justify-center'>
				{!started && <LeaveRoomButton />}
			</div>
		</div>
	);
};

export default WaitingStart;
