import React from 'react';

import Option from './Option';
import { useGameStore } from '../stores/gameStore';
import { usePlayerStore } from '../stores/playerStore';
import { OPTION_LABELS } from '../constants/copy';

const OptionArea = () => {
	const question = useGameStore((s) => s.question);
	const selectedOption = usePlayerStore((s) => s.selectedOption);
	const submitted = usePlayerStore((s) => s.submitted);

	return (
		<div className='min-h-0 flex-[4]'>
			<div className='grid h-full w-full grid-cols-2 grid-rows-2 gap-2'>
				{question.options.map((opt, index) => (
					<Option
						key={OPTION_LABELS[index] ?? index}
						label={OPTION_LABELS[index] ?? String(index + 1)}
						text={opt}
						highlighted={selectedOption === index}
						dimmed={submitted && selectedOption !== index}
						disabled={submitted}
						onSelect={() => {
							if (!submitted) {
								usePlayerStore.getState().setSelectedOption(index);
							}
						}}
					/>
				))}
			</div>
		</div>
	);
};

export default OptionArea;
