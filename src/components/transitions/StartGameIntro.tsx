import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

import { useStagedTypingText } from '../../hooks/useStagedTypingText';
import { START_INTRO, useStartIntroStore } from '../../stores/startIntroStore';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 與 Manager 同一套開局過場。
 * 由 QuizGame:GameStarted 啟動，第一題到達後淡出。
 */
const StartGameIntro = () => {
	const phase = useStartIntroStore((s) => s.phase);
	const coverBeat = useStartIntroStore((s) => s.coverBeat);
	const markPerformanceDone = useStartIntroStore((s) => s.markPerformanceDone);

	const active = phase !== 'idle';
	const typing = coverBeat === 'typing';
	const showText =
		coverBeat === 'typing' || coverBeat === 'holding' || phase === 'revealing';

	const stages = useMemo(
		() => [
			{
				text: START_INTRO.typeFirst,
				charMs: START_INTRO.typeCharMs,
				pauseAfterMs: START_INTRO.typePauseMs,
			},
			{
				text: START_INTRO.typeSecond,
				charMs: START_INTRO.typeCharMs,
				pauseAfterMs: START_INTRO.typeHoldMs,
			},
		],
		[],
	);

	const onPerformanceDone = () => {
		const state = useStartIntroStore.getState();
		if (state.phase !== 'covering' || state.coverBeat !== 'typing') return;
		markPerformanceDone();
	};

	const typed = useStagedTypingText(typing, stages, onPerformanceDone);
	const fullText = `${START_INTRO.typeFirst}${START_INTRO.typeSecond}`;
	const displayText =
		coverBeat === 'holding' || phase === 'revealing' ? fullText : typed;

	if (!active) return null;

	const covering = phase === 'covering';

	return (
		<div
			className='pointer-events-auto fixed inset-0 z-50 overflow-hidden'
			aria-hidden
		>
			<motion.div
				className='absolute inset-0 bg-paper'
				initial={{ opacity: 0 }}
				animate={{ opacity: covering ? 1 : 0 }}
				transition={{
					duration: covering ? START_INTRO.fadeInSec : START_INTRO.fadeOutSec,
					ease: EASE,
				}}
			/>

			{showText && (
				<div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4'>
					<motion.div
						className='text-center text-2xl font-bold tracking-[0.15em] text-gold sm:text-4xl'
						initial={{ opacity: 1 }}
						animate={{ opacity: covering ? 1 : 0 }}
						transition={{
							duration: START_INTRO.fadeOutSec,
							ease: EASE,
						}}
					>
						{displayText}
					</motion.div>
				</div>
			)}
		</div>
	);
};

export default StartGameIntro;
