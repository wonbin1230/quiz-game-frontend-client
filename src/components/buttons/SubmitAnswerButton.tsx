import React from 'react';

import { usePlayerStore } from '../../stores/playerStore';
import { SubmitAnswer } from '../../socket/events/game';
import { COPY } from '../../constants/copy';
import GameButton from './GameButton';

const SubmitAnswerButton = () => {
	const selectedOption = usePlayerStore((s) => s.selectedOption);
	const submitted = usePlayerStore((s) => s.submitted);
	const submitting = usePlayerStore((s) => s.submitting);

	const canSubmit = selectedOption !== null && !submitted && !submitting;

	const onClick = () => {
		if (selectedOption === null || !canSubmit) {
			return;
		}

		SubmitAnswer(selectedOption);
	};

	if (submitted) {
		return (
			<div className='text-lg tracking-[0.35em] text-white/80'>
				{COPY.waitingReveal}
			</div>
		);
	}

	return (
		<div className='flex items-center justify-center'>
			<GameButton onClick={onClick} disabled={!canSubmit}>
				{COPY.submit}
			</GameButton>
		</div>
	);
};

export default SubmitAnswerButton;
