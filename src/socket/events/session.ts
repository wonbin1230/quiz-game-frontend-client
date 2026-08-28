import { ExitRoomToLobby, GetSocket } from '../client';

import type { IServerSessionSnapshot, IServerSessionSnapshotIn } from '../../types/server-response';
import { GamePhase, GameState, type IQuestionData, type RevealFeedback } from '../../types/game';
import { SessionState } from '../../types/session';
import { useSessionStore } from '../../stores/sessionStore';
import { useRoomStore } from '../../stores/roomStore';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useNoticeStore } from '../../stores/noticeStore';
import { COPY } from '../../constants/copy';
import { JoinRoom } from './room';

const emptyQuestion: IQuestionData = {
	questionIndex: 0,
	question: '',
	options: [],
	votingTime: 0,
	totalQuestions: 0,
};

const mapGameStateToPhase = (gameState: GameState): GamePhase => {
	switch (gameState) {
		case GameState.Prepare:
			return GamePhase.Idle;
		case GameState.StartGame:
			return GamePhase.Lobby;
		case GameState.Voting:
			return GamePhase.Voting;
		case GameState.Settle:
			return GamePhase.Settle;
		case GameState.ShowAnswer:
			return GamePhase.ShowAnswer;
		case GameState.ShowRanking:
			return GamePhase.ShowRanking;
		case GameState.Finished:
			return GamePhase.Finished;
	}
};

const resolveFeedback = (data: IServerSessionSnapshotIn): RevealFeedback | null => {
	const inReveal =
		data.gameState === GameState.Settle || data.gameState === GameState.ShowAnswer;
	if (!inReveal) {
		return null;
	}

	const correctAnswer = data.settle?.correctAnswer ?? data.answerReveal?.correctAnswer;
	if (correctAnswer === undefined) {
		return null;
	}

	const submitted = Boolean(data.myAnswer);
	const selectedOption = data.myAnswer?.selectedOption ?? null;
	return submitted && selectedOption === correctAnswer ? 'correct' : 'wrong';
};

const applyInRoomSnapshot = (data: IServerSessionSnapshotIn) => {
	useSessionStore.getState().setIsReconnecting(false);
	useSessionStore.getState().setPendingJoin(false);
	useSessionStore.getState().setState(SessionState.InRoom);
	useRoomStore.getState().setRoom({
		roomId: data.roomId,
		roomName: data.roomName,
		roomState: data.roomState,
	});

	const question: IQuestionData = data.question
		? {
			questionIndex: data.question.questionIndex,
			question: data.question.question,
			options: data.question.options,
			votingTime: data.question.votingTime,
			totalQuestions: data.question.totalQuestions,
		}
		: emptyQuestion;

	useGameStore.getState().hydrateFromSnapshot({
		phase: mapGameStateToPhase(data.gameState),
		question,
		settle: data.settle
			? {
				questionIndex: data.settle.questionIndex,
				correctAnswer: data.settle.correctAnswer,
				answers: data.settle.answers,
			}
			: null,
		answerReveal: data.answerReveal
			? {
				questionIndex: data.answerReveal.questionIndex,
				correctAnswer: data.answerReveal.correctAnswer,
				totalAnswers: data.answerReveal.totalAnswers,
			}
			: null,
		quizCount: data.quizCount,
		phaseEndsAt: data.phaseEndsAt ?? null,
	});

	usePlayerStore.getState().hydrateFromSnapshot({
		selectedOption: data.myAnswer?.selectedOption ?? null,
		submitted: Boolean(data.myAnswer),
		feedback: resolveFeedback(data),
		personalResult: data.personalResult
			? {
				rank: data.personalResult.rank,
				correctCount: data.personalResult.correctCount,
				totalTime: data.personalResult.totalTime,
			}
			: null,
	});
	useNoticeStore.getState().clear();
};

export const OnSessionSnapshot = () => {
	GetSocket().on('UserGame:SessionSnapshot', (data: IServerSessionSnapshot) => {
		if (!data.inRoom) {
			const wasInRoom = useSessionStore.getState().state === SessionState.InRoom;
			const pendingJoin = useSessionStore.getState().pendingJoin;
			useSessionStore.getState().setIsReconnecting(false);
			useSessionStore.getState().setAwaitingSnapshot(false);

			if (wasInRoom) {
				ExitRoomToLobby();
				useNoticeStore.getState().setNotice(COPY.rejoinExpired);
				return;
			}

			useSessionStore.getState().setState(SessionState.LoggedIn);
			if (pendingJoin) {
				JoinRoom();
			}
			return;
		}

		useSessionStore.getState().setAwaitingSnapshot(false);
		applyInRoomSnapshot(data);
	});
};
