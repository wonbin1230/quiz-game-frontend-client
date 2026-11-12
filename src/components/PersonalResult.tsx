import React from 'react';
import { motion } from 'framer-motion';

import { useGameStore } from '../stores/gameStore';
import { usePlayerStore } from '../stores/playerStore';
import { COPY, ROMANTIC_EASE } from '../constants/copy';
import { GamePhase } from '../types/game';
import LeaveRoomButton from './buttons/LeaveRoomButton';

const formatTime = (totalTime: number) => `${totalTime.toFixed(2)}s`;

const PersonalResult = () => {
	const phase = useGameStore((s) => s.phase);
	const personalResult = usePlayerStore((s) => s.personalResult);
	const finished = phase === GamePhase.Finished;

	return (
		<div className='flex h-full min-h-0 w-full flex-col gap-6'>
			<motion.div
				className='shrink-0 text-center text-2xl font-bold tracking-[0.35em] text-gold sm:text-3xl'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, ease: ROMANTIC_EASE }}
			>
				{COPY.rankingTitle}
			</motion.div>

			<div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-4'>
				{personalResult ? (
					<motion.div
						className='flex w-full flex-col items-center gap-4 rounded-xl border border-blush/80 bg-white/70 px-6 py-10 backdrop-blur'
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, ease: ROMANTIC_EASE }}
					>
						<div className='text-sm tracking-[0.35em] text-ink/55'>
							{COPY.rankPrefix}
						</div>
						<div className='text-6xl font-bold tracking-[0.2em] text-ink'>
							{personalResult.rank}
						</div>
						<div className='text-sm tracking-[0.35em] text-ink/55'>
							{COPY.rankSuffix}
						</div>
						<div className='mt-4 text-lg tracking-[0.2em] text-ink'>
							{personalResult.correctCount} {COPY.correctUnit}
						</div>
						<div className='text-sm tracking-[0.12em] text-ink/55'>
							{formatTime(personalResult.totalTime)}
						</div>
					</motion.div>
				) : (
					<div className='text-lg font-bold tracking-[0.35em] text-ink/50'>
						{COPY.connecting}
					</div>
				)}
			</div>

			<div className='flex shrink-0 flex-col items-center justify-center gap-3 pb-2'>
				{finished ? (
					<>
						<motion.div
							className='text-lg font-bold tracking-[0.3em] text-ink/50'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							{COPY.finished}
						</motion.div>
						<LeaveRoomButton />
					</>
				) : null}
			</div>
		</div>
	);
};

export default PersonalResult;
