import { GetSocket } from '../client';

import type {
	IServerAnswerReveal,
	IServerGameFinished,
	IServerGetQuestion,
	IServerNextQuestion,
	IServerPersonalResult,
	IServerSettle,
	IServerStartGame,
	IServerSubmitAnswer,
} from '../../types/server-response';
import { GamePhase } from '../../types/game';
import { RoomState } from '../../types/room';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useRoomStore } from '../../stores/roomStore';
import { useSessionStore } from '../../stores/sessionStore';

export const SubmitAnswer = (optionIndex: number) => {
	usePlayerStore.getState().setSubmitting(true);
	GetSocket().emit('UserGame:SubmitAnswer', { optionIndex });
};

export const OnSubmitAnswer = () => {
	GetSocket().on('UserGame:SubmitAnswer', (data: IServerSubmitAnswer) => {
		usePlayerStore.getState().setSelectedOption(data.selectedOption);
		usePlayerStore.getState().setSubmitted(true);
		usePlayerStore.getState().setSubmitting(false);
	});
};

export const OnGameStarted = () => {
	GetSocket().on('QuizGame:GameStarted', (data: IServerStartGame) => {
		useRoomStore.getState().setRoomState(RoomState.InGame);
		useSessionStore.getState().setRenameLocked(true);
		usePlayerStore.getState().setNicknameDraft(usePlayerStore.getState().userId);
		useGameStore.getState().resetRound();
		useGameStore.getState().setQuizCount(data.quizCount);
		useGameStore.getState().setPhase(GamePhase.Lobby);
		useGameStore.getState().setPhaseEndsAt(data.phaseEndsAt ?? null);
		usePlayerStore.getState().resetSession();
	});
};

export const OnGetQuestion = () => {
	GetSocket().on('QuizGame:Question', (data: IServerGetQuestion) => {
		usePlayerStore.getState().resetRound();
		useGameStore.getState().setQuestion({
			questionIndex: data.questionIndex,
			question: data.question,
			options: data.options,
			votingTime: data.votingTime,
			totalQuestions: data.totalQuestions,
		}, data.phaseEndsAt ?? null);
	});
};

export const OnSettle = () => {
	GetSocket().on('QuizGame:Settle', (data: IServerSettle) => {
		useGameStore.getState().setSettle({
			questionIndex: data.questionIndex,
			correctAnswer: data.correctAnswer,
			answers: data.answers,
		}, data.phaseEndsAt ?? null);
	});
};

export const OnAnswerReveal = () => {
	GetSocket().on('QuizGame:AnswerReveal', (data: IServerAnswerReveal) => {
		const { selectedOption, submitted } = usePlayerStore.getState();
		const isCorrect = submitted && selectedOption === data.correctAnswer;
		usePlayerStore.getState().setFeedback(isCorrect ? 'correct' : 'wrong');
		useGameStore.getState().setAnswerReveal({
			questionIndex: data.questionIndex,
			correctAnswer: data.correctAnswer,
			totalAnswers: data.totalAnswers,
		});
	});
};

export const OnNextQuestion = () => {
	GetSocket().on('QuizGame:NextQuestion', (_data: IServerNextQuestion) => {
		usePlayerStore.getState().resetRound();
	});
};

export const OnPersonalResult = () => {
	GetSocket().on('QuizGame:PersonalResult', (data: IServerPersonalResult) => {
		usePlayerStore.getState().setPersonalResult({
			rank: data.rank,
			correctCount: data.correctCount,
			totalTime: data.totalTime,
		});
		useGameStore.getState().setPhase(GamePhase.ShowRanking);
	});
};

export const OnFinished = () => {
	GetSocket().on('QuizGame:Finished', (_data: IServerGameFinished) => {
		useRoomStore.getState().setRoomState(RoomState.Finished);
		useGameStore.getState().setPhase(GamePhase.Finished);
	});
};
