import React from 'react';

import { useGameStore } from '../stores/gameStore';
import { GamePhase } from '../types/game';
import Countdown from './Countdown';

const QuestionProgress = () => {
	const phase = useGameStore((s) => s.phase);
	const questionIndex = useGameStore((s) => s.question.questionIndex);
	const totalQuestions = useGameStore((s) => s.question.totalQuestions);
	const quizCount = useGameStore((s) => s.quizCount);

	const inQuestion =
		phase === GamePhase.Voting ||
		phase === GamePhase.Settle ||
		phase === GamePhase.ShowAnswer;
	const total = totalQuestions || quizCount;
	const showProgress = inQuestion && questionIndex > 0 && total > 0;

	if (!showProgress && phase !== GamePhase.Voting) {
		return null;
	}

	return (
		<div className='pointer-events-none absolute inset-x-0 top-3 z-40 flex flex-col items-center gap-2'>
			{showProgress && (
				<div className='text-2xl font-bold tracking-[0.12em] text-gold'>
					{questionIndex}/{total}
				</div>
			)}
			{phase === GamePhase.Voting && <Countdown />}
		</div>
	);
};

export default QuestionProgress;
