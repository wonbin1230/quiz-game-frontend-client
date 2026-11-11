import { useEffect, useRef } from 'react';

import { SubmitAnswer } from '../socket/events/game';
import { useGameStore } from '../stores/gameStore';
import { usePlayerStore } from '../stores/playerStore';
import { GamePhase } from '../types/game';

const AUTO_SUBMIT_LEAD_MS = 500;

const submitSelectedIfPending = () => {
	const { selectedOption, submitted, submitting } = usePlayerStore.getState();
	if (selectedOption === null || submitted || submitting) {
		return;
	}

	SubmitAnswer(selectedOption);
};

export const useAutoSubmitAnswer = () => {
	const phase = useGameStore((s) => s.phase);
	const phaseEndsAt = useGameStore((s) => s.phaseEndsAt);
	const votingTime = useGameStore((s) => s.question.votingTime);
	const questionIndex = useGameStore((s) => s.question.questionIndex);
	const selectedOption = usePlayerStore((s) => s.selectedOption);
	const deadlineRef = useRef<number | null>(null);

	useEffect(() => {
		if (phase !== GamePhase.Voting) {
			deadlineRef.current = null;
			return;
		}

		const deadline = phaseEndsAt ?? (votingTime > 0 ? Date.now() + votingTime * 1000 : null);
		deadlineRef.current = deadline;
		if (deadline === null) {
			return;
		}

		const delay = Math.max(deadline - Date.now() - AUTO_SUBMIT_LEAD_MS, 0);
		const timer = window.setTimeout(submitSelectedIfPending, delay);
		return () => window.clearTimeout(timer);
	}, [phase, phaseEndsAt, votingTime, questionIndex]);

	useEffect(() => {
		if (phase !== GamePhase.Voting || selectedOption === null) {
			return;
		}

		const deadline = deadlineRef.current;
		if (deadline === null || Date.now() < deadline - AUTO_SUBMIT_LEAD_MS) {
			return;
		}

		submitSelectedIfPending();
	}, [phase, selectedOption, phaseEndsAt, votingTime, questionIndex]);
};
