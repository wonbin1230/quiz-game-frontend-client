import React from 'react';

import { useGameStore } from '../stores/gameStore';
import { useTypingText } from '../hooks/useTypingText';

const Question = () => {
	const question = useGameStore((s) => s.question);
	const displayText = useTypingText(question.question, 100);

	return (
		<div className='flex min-h-0 flex-[3] items-center justify-center px-2 sm:flex-[6]'>
			<div className='flex w-full items-center justify-center text-center text-2xl font-bold tracking-[0.15em] text-ink sm:text-4xl'>
				{displayText}
			</div>
		</div>
	);
};

export default Question;
