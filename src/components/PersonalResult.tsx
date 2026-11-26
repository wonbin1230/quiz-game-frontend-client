import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { useGameStore } from '../stores/gameStore';
import { usePlayerStore } from '../stores/playerStore';
import { COPY, ROMANTIC_EASE } from '../constants/copy';
import { GamePhase } from '../types/game';

const formatTime = (totalTime: number) => `${totalTime.toFixed(2)}${COPY.timeUnit}`;

const PODIUM_LABELS: Record<number, string> = {
	1: COPY.rankChampion,
	2: COPY.rankRunnerUp,
	3: COPY.rankThird,
};

const PODIUM_METAL: Record<number, string> = {
	1: 'podium-metal podium-metal-gold',
	2: 'podium-metal podium-metal-silver',
	3: 'podium-metal podium-metal-copper',
};

const PersonalResult = () => {
	const phase = useGameStore((s) => s.phase);
	const personalResult = usePlayerStore((s) => s.personalResult);
	const userName = usePlayerStore((s) => s.userId);
	const finished = phase === GamePhase.Finished;
	const rankContentRef = useRef<HTMLDivElement>(null);
	const [rankContentHeight, setRankContentHeight] = useState<number>();

	useLayoutEffect(() => {
		const node = rankContentRef.current;
		if (!node) {
			return;
		}

		const updateHeight = () => setRankContentHeight(node.offsetHeight);
		updateHeight();

		const observer = new ResizeObserver(updateHeight);
		observer.observe(node);
		return () => observer.disconnect();
	}, [personalResult]);

	return (
		<div className='flex h-full min-h-0 w-full flex-col gap-6 pt-10!'>
			<div className='flex shrink-0 flex-col items-center gap-2'>
				{userName ? (
					<motion.div
						className='text-center text-xl font-bold tracking-[0.12em] text-gold sm:text-2xl'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, ease: ROMANTIC_EASE }}
					>
						{userName}
					</motion.div>
				) : null}
				<motion.div
					className='text-center text-2xl font-bold tracking-[0.35em] text-gold sm:text-3xl'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, ease: ROMANTIC_EASE }}
				>
					{COPY.rankingTitle}
				</motion.div>
			</div>

			<div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-8!'>
				{personalResult ? (
					<motion.div
						className='flex w-full flex-col items-center justify-center rounded-xl border border-blush/80 bg-white/70 px-6 backdrop-blur'
						style={{
							height: rankContentHeight ? rankContentHeight * 1.5 : undefined,
							marginBlock: rankContentHeight ? rankContentHeight * -0.25 : undefined,
						}}
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, ease: ROMANTIC_EASE }}
					>
						<div ref={rankContentRef} className='flex w-full flex-col items-center justify-center gap-4 py-10 text-center'>
							{PODIUM_LABELS[personalResult.rank] ? (
								<div className={`text-6xl font-bold tracking-[0.2em] ${PODIUM_METAL[personalResult.rank]}`}>
									{PODIUM_LABELS[personalResult.rank]}
								</div>
							) : (
								<div className='flex items-center justify-center gap-3'>
									<span className='text-2xl tracking-[0.2em] text-ink/55'>
										{COPY.rankPrefix}
									</span>
									<span className='text-6xl font-bold tracking-[0.12em] text-ink'>
										{personalResult.rank}
									</span>
									<span className='text-2xl tracking-[0.2em] text-ink/55'>
										{COPY.rankSuffix}
									</span>
								</div>
							)}
							<div className='mt-4 text-lg tracking-[0.2em] text-ink'>
								{COPY.correctPrefix} {personalResult.correctCount} {COPY.correctUnit}
							</div>
							<div className='text-sm tracking-[0.12em] text-ink/55'>
								{COPY.totalTimeLabel} {formatTime(personalResult.totalTime)}
							</div>
						</div>
					</motion.div>
				) : (
					<div className='text-lg font-bold tracking-[0.35em] text-ink/50'>
						{COPY.connecting}
					</div>
				)}
			</div>

			{finished ? (
				<div className='flex h-14 shrink-0 items-center justify-center'>
					<motion.div
						className='text-lg font-bold tracking-[0.3em] text-ink/50'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						{COPY.finished}
					</motion.div>
				</div>
			) : null}
		</div>
	);
};

export default PersonalResult;
