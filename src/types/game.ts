export enum GamePhase {
	Idle = 'Idle',
	Lobby = 'Lobby',
	Voting = 'Voting',
	Settle = 'Settle',
	ShowAnswer = 'ShowAnswer',
	ShowRanking = 'ShowRanking',
	Finished = 'Finished',
}

export enum GameState {
	Prepare = 'Prepare',
	StartGame = 'StartGame',
	Voting = 'Voting',
	Settle = 'Settle',
	ShowAnswer = 'ShowAnswer',
	ShowRanking = 'ShowRanking',
	Finished = 'Finished',
}

export interface IQuestionData {
	questionIndex: number,
	question: string,
	options: string[],
	votingTime: number,
	totalQuestions: number,
}

export interface ISettleData {
	questionIndex: number,
	correctAnswer: number,
	answers: ISettleAnswer[],
}

export interface ISettleAnswer {
	userId: string,
	optionIndex: number,
	isCorrect: boolean,
}

export interface IAnswerRevealData {
	questionIndex: number,
	correctAnswer: number,
	totalAnswers: number,
}

export interface IPersonalResult {
	rank: number,
	correctCount: number,
	totalTime: number,
}

export type RevealFeedback = 'correct' | 'wrong';
