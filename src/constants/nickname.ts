export const NICKNAME_MAX_LENGTH = 6;

export const nicknameLength = (value: string): number => Array.from(value).length;

export const clampNickname = (value: string): string =>
	Array.from(value).slice(0, NICKNAME_MAX_LENGTH).join('');

export const normalizeNickname = (value: string): string => clampNickname(value.trim());
