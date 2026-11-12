import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Option from './Option';
import AnswerRose, { ANSWER_ROSE_DURATION } from './AnswerRose';
import { useGameStore } from '../stores/gameStore';
import { usePlayerStore } from '../stores/playerStore';
import { COPY, OPTION_LABELS, ROMANTIC_EASE } from '../constants/copy';
import { GamePhase } from '../types/game';

const CORRECT_SRC = `${import.meta.env.BASE_URL}correct.png`;
const CHOICE_SRC = `${import.meta.env.BASE_URL}choice.png`;

const RevealOptions = () => {
	const question = useGameStore((s) => s.question);
	const phase = useGameStore((s) => s.phase);
	const answerReveal = useGameStore((s) => s.answerReveal);
	const selectedOption = usePlayerStore((s) => s.selectedOption);
	const submitted = usePlayerStore((s) => s.submitted);
	const feedback = usePlayerStore((s) => s.feedback);
	const [showFrame, setShowFrame] = useState(false);

	const revealed = phase === GamePhase.ShowAnswer && answerReveal !== null;

	useEffect(() => {
		if (!revealed) {
			setShowFrame(false);
			return;
		}

		setShowFrame(false);
		const timer = window.setTimeout(() => setShowFrame(true), ANSWER_ROSE_DURATION * 1000);
		return () => window.clearTimeout(timer);
	}, [revealed, question.questionIndex, answerReveal?.correctAnswer]);

	return (
		<div className='flex min-h-0 flex-1 flex-col gap-4 pt-14!'>
			<div className='min-h-0 flex-1'>
				<div className='grid h-full w-full grid-cols-2 grid-rows-2 gap-2'>
					{question.options.map((opt, index) => {
						const isCorrect = revealed && answerReveal.correctAnswer === index;
						const isSelected = submitted && selectedOption === index;
						const showPick = revealed && isSelected;

						return (
							<div
								key={OPTION_LABELS[index] ?? index}
								className={`relative h-full min-h-0 overflow-visible ${isCorrect || showPick ? 'z-10' : 'z-0'}`}
							>
								<Option
									label={OPTION_LABELS[index] ?? String(index + 1)}
									text={opt}
									picked={showPick && !isCorrect}
									dimmed={revealed && !isCorrect && !isSelected}
									showAnswerFrame={showFrame && isCorrect}
								/>
								{isCorrect && (
									<motion.img
										src={CORRECT_SRC}
										alt='正確答案'
										draggable={false}
										className='pointer-events-none absolute left-1/2 top-0 z-40 w-[27%] max-w-[115px] -translate-x-1/2 -translate-y-[30%] select-none'
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.9, ease: 'easeOut', delay: ANSWER_ROSE_DURATION * 0.6 }}
									/>
								)}
								{showPick && (
									<motion.img
										src={CHOICE_SRC}
										alt={COPY.yourPick}
										draggable={false}
										className='pointer-events-none absolute bottom-0 left-1/2 z-30 w-[42%] max-w-[140px] -translate-x-1/2 translate-y-[22%] select-none'
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.45, ease: 'easeOut' }}
									/>
								)}
								{isCorrect && <AnswerRose active />}
							</div>
						);
					})}
				</div>
			</div>
			<div className='flex h-14 shrink-0 items-center justify-center'>
				{revealed && !submitted ? (
					<motion.div
						className='text-lg font-bold tracking-[0.35em] text-ink'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							delay: ANSWER_ROSE_DURATION,
							duration: 1,
							ease: ROMANTIC_EASE,
						}}
					>
						{COPY.noAnswer}
					</motion.div>
				) : revealed && feedback ? (
					<motion.div
						className='text-lg font-bold tracking-[0.35em] text-ink'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							delay: ANSWER_ROSE_DURATION,
							duration: 1,
							ease: ROMANTIC_EASE,
						}}
					>
						{feedback === 'correct' ? COPY.correct : COPY.wrong}
					</motion.div>
				) : (
					<div className='text-lg font-bold tracking-[0.35em] text-ink'>
						{COPY.waitingReveal}
					</div>
				)}
			</div>
		</div>
	);
};

export default RevealOptions;
