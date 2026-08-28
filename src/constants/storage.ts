export const USER_ID_STORAGE_KEY = 'quiz.userId';

export const loadPersistedUserId = (): string => {
	try {
		return localStorage.getItem(USER_ID_STORAGE_KEY) ?? '';
	}
	catch {
		return '';
	}
};

export const persistUserId = (userId: string): void => {
	try {
		localStorage.setItem(USER_ID_STORAGE_KEY, userId);
	}
	catch {
		return;
	}
};
