import React from 'react';

import { useGameStore } from '../stores/gameStore';
import { useTypingText } from '../hooks/useTypingText';

const Question = () => {
	const question = useGameStore((s) => s.question);
	const displayText = useTypingText(question.question, 100);

	return (
		<div className='flex min-h-0 flex-[3] flex-col items-center justify-center gap-3 px-2 sm:flex-[6]'>
			<div className='text-xs tracking-[0.2em] text-white/45'>
				{question.questionIndex} / {question.totalQuestions}
			</div>
			<div className='flex w-full items-center justify-center text-center text-2xl tracking-[0.15em] text-white/90 sm:text-4xl'>
				{displayText}
			</div>
		</div>
	);
};

export default Question;
