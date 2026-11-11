import React from 'react';
import { motion } from 'framer-motion';

import Option from './Option';
import AnswerStamp, { ANSWER_STAMP_DURATION } from './AnswerStamp';
import { useGameStore } from '../stores/gameStore';
import { usePlayerStore } from '../stores/playerStore';
import { COPY, OPTION_LABELS, ROMANTIC_EASE } from '../constants/copy';
import { GamePhase } from '../types/game';

const YourPickMark = () => (
	<motion.div
		className='pointer-events-none absolute left-2 top-2 z-20'
		initial={{ opacity: 0, y: -6 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.45, ease: ROMANTIC_EASE }}
	>
		<span
			className='inline-flex items-center rounded-sm border border-amber-200/70 bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold tracking-[0.16em] text-amber-100'
			style={{ fontFamily: '"Noto Serif TC", "Songti TC", "SimSun", serif' }}
		>
			{COPY.yourPick}
		</span>
	</motion.div>
);

const RevealOptions = () => {
	const question = useGameStore((s) => s.question);
	const phase = useGameStore((s) => s.phase);
	const answerReveal = useGameStore((s) => s.answerReveal);
	const selectedOption = usePlayerStore((s) => s.selectedOption);
	const submitted = usePlayerStore((s) => s.submitted);
	const feedback = usePlayerStore((s) => s.feedback);

	const revealed = phase === GamePhase.ShowAnswer && answerReveal !== null;

	return (
		<div className='flex min-h-0 flex-1 flex-col gap-4'>
			<div className='text-center text-xs tracking-[0.2em] text-white/45'>
				{question.questionIndex} / {question.totalQuestions}
			</div>
			<div className='min-h-0 flex-1'>
				<div className='grid h-full w-full grid-cols-2 grid-rows-2 gap-2'>
					{question.options.map((opt, index) => {
						const isCorrect = revealed && answerReveal.correctAnswer === index;
						const isSelected = submitted && selectedOption === index;
						const showPick = revealed && isSelected;

						return (
							<div
								key={OPTION_LABELS[index] ?? index}
								className={`relative h-full min-h-0 ${isCorrect || showPick ? 'z-10 overflow-visible' : 'overflow-hidden'}`}
							>
								<Option
									label={OPTION_LABELS[index] ?? String(index + 1)}
									text={opt}
									highlighted={revealed ? isCorrect : isSelected}
									picked={showPick && !isCorrect}
									dimmed={revealed && !isCorrect && !isSelected}
								/>
								{isCorrect && <AnswerStamp active />}
								{showPick && <YourPickMark />}
							</div>
						);
					})}
				</div>
			</div>
			<div className='flex h-14 shrink-0 items-center justify-center'>
				{revealed && !submitted ? (
					<motion.div
						className='text-lg tracking-[0.35em] text-white/80'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							delay: ANSWER_STAMP_DURATION,
							duration: 1,
							ease: ROMANTIC_EASE,
						}}
					>
						{COPY.noAnswer}
					</motion.div>
				) : revealed && feedback ? (
					<motion.div
						className='text-lg tracking-[0.35em] text-white/80'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							delay: ANSWER_STAMP_DURATION,
							duration: 1,
							ease: ROMANTIC_EASE,
						}}
					>
						{feedback === 'correct' ? COPY.correct : COPY.wrong}
					</motion.div>
				) : (
					<div className='text-lg tracking-[0.35em] text-white/80'>
						{COPY.waitingReveal}
					</div>
				)}
			</div>
		</div>
	);
};

export default RevealOptions;
