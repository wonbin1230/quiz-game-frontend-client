import type { GameState } from './game';
import type { RoomState } from './room';

export interface IServerError {
	event: string,
	message: string,
	code?: string,
}

export interface IServerUserLogin {
	userId: string,
}

export interface IServerJoinRoom {
	roomId: string,
}

export interface IServerLeaveRoom {
	success: boolean,
}

export interface IServerSubmitAnswer {
	roomId: string,
	questionIndex: number,
	selectedOption: number,
}

export interface IServerStartGame {
	roomId: string,
	quizCount: number,
	phaseEndsAt?: number,
}

export interface IServerGetQuestion {
	roomId: string,
	question: string,
	options: string[],
	questionIndex: number,
	totalQuestions: number,
	votingTime: number,
	phaseEndsAt?: number,
}

export interface IServerSettleAnswer {
	userId: string,
	optionIndex: number,
	isCorrect: boolean,
}

export interface IServerSettle {
	roomId: string,
	questionIndex: number,
	correctAnswer: number,
	answers: IServerSettleAnswer[],
	phaseEndsAt?: number,
}

export interface IServerSnapshotQuestion {
	questionIndex: number,
	question: string,
	options: string[],
	votingTime: number,
	totalQuestions: number,
}

export interface IServerSnapshotAnswer {
	questionIndex: number,
	selectedOption: number,
}

export interface IServerSnapshotSettle {
	questionIndex: number,
	correctAnswer: number,
	answers: IServerSettleAnswer[],
}

export interface IServerSnapshotReveal {
	questionIndex: number,
	correctAnswer: number,
	totalAnswers: number,
}

export interface IServerSnapshotResult {
	rank: number,
	correctCount: number,
	totalTime: number,
}

export interface IServerSessionSnapshotOut {
	inRoom: false,
}

export interface IServerSessionSnapshotIn {
	inRoom: true,
	roomId: string,
	roomName: string,
	roomState: RoomState,
	gameState: GameState,
	quizCount: number,
	phaseEndsAt?: number,
	question?: IServerSnapshotQuestion,
	myAnswer?: IServerSnapshotAnswer,
	settle?: IServerSnapshotSettle,
	answerReveal?: IServerSnapshotReveal,
	personalResult?: IServerSnapshotResult,
}

export type IServerSessionSnapshot = IServerSessionSnapshotOut | IServerSessionSnapshotIn;

export interface IServerAnswerReveal {
	roomId: string,
	questionIndex: number,
	correctAnswer: number,
	totalAnswers: number,
}

export interface IServerNextQuestion {
	roomId: string,
	nextQuestionIndex: number,
}

export interface IServerPersonalResult {
	roomId: string,
	rank: number,
	correctCount: number,
	totalTime: number,
}

export interface IServerGameFinished {
	roomId: string,
	totalQuestions: number,
}

export interface IServerRoomClosed {
	roomName: string,
	roomId: string,
	reason: string,
}
