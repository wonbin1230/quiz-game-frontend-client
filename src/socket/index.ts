import { ConnectToServer } from './client';
import { OnUserLogin } from './events/login';
import { OnJoinRoom, OnLeaveRoom, OnRoomClosed } from './events/room';
import { OnSessionSnapshot } from './events/session';
import {
	OnAnswerReveal,
	OnFinished,
	OnGameStarted,
	OnGetQuestion,
	OnNextQuestion,
	OnPersonalResult,
	OnSettle,
	OnSubmitAnswer,
} from './events/game';
import { OnSocketErrors } from './events/error';

let initialized = false;

export const InitializeSocketSystem = () => {
	if (initialized) {
		return;
	}

	initialized = true;

	ConnectToServer();

	OnUserLogin();
	OnJoinRoom();
	OnLeaveRoom();
	OnRoomClosed();
	OnSessionSnapshot();
	OnSubmitAnswer();
	OnGameStarted();
	OnGetQuestion();
	OnSettle();
	OnAnswerReveal();
	OnNextQuestion();
	OnPersonalResult();
	OnFinished();
	OnSocketErrors();
};
