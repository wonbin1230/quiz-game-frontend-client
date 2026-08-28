import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useGameStore } from '../stores/gameStore';

const remainingSeconds = (phaseEndsAt: number) => Math.ceil((phaseEndsAt - Date.now()) / 1000);

const Countdown = () => {
	const votingTime = useGameStore((s) => s.question.votingTime);
	const questionIndex = useGameStore((s) => s.question.questionIndex);
	const phaseEndsAt = useGameStore((s) => s.phaseEndsAt);
	const [second, setSecond] = useState(-1);

	useEffect(() => {
		if (phaseEndsAt) {
			const tick = () => {
				setSecond(remainingSeconds(phaseEndsAt));
			};

			tick();
			const timer = setInterval(tick, 200);
			return () => clearInterval(timer);
		}

		if (votingTime <= 0) {
			setSecond(-1);
			return;
		}

		setSecond(votingTime);

		const timer = setInterval(() => {
			setSecond((prev) => Math.max(prev - 1, -1));
		}, 1000);

		return () => clearInterval(timer);
	}, [phaseEndsAt, votingTime, questionIndex]);

	if (second < 0) {
		return null;
	}

	return (
		<div className='pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-center sm:top-4'>
			{second > 10 ? (
				<span className='text-5xl font-light tracking-[0.2em] text-white/50 sm:text-7xl'>
					{second}
				</span>
			) : (
				<AnimatePresence mode='wait'>
					<motion.span
						className='text-5xl font-light tracking-[0.2em] text-white sm:text-7xl'
						key={second}
						initial={{ opacity: 0 }}
						animate={{ scale: [2.4, 1], opacity: [0.35, 1] }}
						exit={{ scale: 0.85, opacity: 0 }}
						transition={{ duration: 0.35, ease: 'easeOut' }}
					>
						{second}
					</motion.span>
				</AnimatePresence>
			)}
		</div>
	);
};

export default Countdown;
