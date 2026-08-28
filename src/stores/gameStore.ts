import { create } from 'zustand';

import { GamePhase, type IAnswerRevealData, type IQuestionData, type ISettleData } from '../types/game';

interface GameSnapshotHydrate {
	phase: GamePhase,
	question: IQuestionData,
	settle: ISettleData | null,
	answerReveal: IAnswerRevealData | null,
	quizCount: number,
	phaseEndsAt: number | null,
}

interface GameStore {
	phase: GamePhase,
	question: IQuestionData,
	settle: ISettleData | null,
	answerReveal: IAnswerRevealData | null,
	quizCount: number,
	phaseEndsAt: number | null,
	setPhase: (phase: GamePhase) => void,
	setQuestion: (question: IQuestionData, phaseEndsAt?: number | null) => void,
	setSettle: (settle: ISettleData, phaseEndsAt?: number | null) => void,
	setAnswerReveal: (answerReveal: IAnswerRevealData) => void,
	setQuizCount: (quizCount: number) => void,
	setPhaseEndsAt: (phaseEndsAt: number | null) => void,
	hydrateFromSnapshot: (next: GameSnapshotHydrate) => void,
	resetRound: () => void,
}

const emptyQuestion: IQuestionData = {
	questionIndex: 0,
	question: '',
	options: [],
	votingTime: 0,
	totalQuestions: 0,
};

export const useGameStore = create<GameStore>((set) => ({
	phase: GamePhase.Idle,
	question: emptyQuestion,
	settle: null,
	answerReveal: null,
	quizCount: 0,
	phaseEndsAt: null,
	setPhase: (phase: GamePhase) => set({ phase }),
	setQuestion: (question: IQuestionData, phaseEndsAt: number | null = null) => set({
		question,
		phase: GamePhase.Voting,
		settle: null,
		answerReveal: null,
		phaseEndsAt,
	}),
	setSettle: (settle: ISettleData, phaseEndsAt: number | null = null) => set({
		settle,
		phase: GamePhase.Settle,
		phaseEndsAt,
	}),
	setAnswerReveal: (answerReveal: IAnswerRevealData) => set({
		answerReveal,
		phase: GamePhase.ShowAnswer,
	}),
	setQuizCount: (quizCount: number) => set({ quizCount }),
	setPhaseEndsAt: (phaseEndsAt: number | null) => set({ phaseEndsAt }),
	hydrateFromSnapshot: (next: GameSnapshotHydrate) => set(next),
	resetRound: () => set({
		phase: GamePhase.Idle,
		settle: null,
		answerReveal: null,
		question: emptyQuestion,
		quizCount: 0,
		phaseEndsAt: null,
	}),
}));
