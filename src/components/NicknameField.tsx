import React from 'react';

import { usePlayerStore } from '../stores/playerStore';
import { COPY } from '../constants/copy';
import { NICKNAME_MAX_LENGTH, nicknameLength } from '../constants/nickname';

interface NicknameFieldProps {
	disabled: boolean,
	showConfirm: boolean,
	confirmDisabled: boolean,
	onConfirm: () => void,
}

const NicknameField = ({
	disabled,
	showConfirm,
	confirmDisabled,
	onConfirm,
}: NicknameFieldProps) => {
	const nicknameDraft = usePlayerStore((s) => s.nicknameDraft);
	const atNicknameLimit = nicknameLength(nicknameDraft) >= NICKNAME_MAX_LENGTH;

	return (
		<div className='flex w-8/12 flex-col items-center'>
			<input
				value={nicknameDraft}
				onChange={(event) => {
					usePlayerStore.getState().setNicknameDraft(event.target.value);
				}}
				onKeyDown={(event) => {
					if (event.key === 'Enter' && showConfirm && !confirmDisabled) {
						event.preventDefault();
						onConfirm();
					}
				}}
				disabled={disabled}
				maxLength={NICKNAME_MAX_LENGTH}
				placeholder={COPY.nicknamePlaceholder}
				autoComplete='nickname'
				className='w-full rounded-sm border border-white/25 bg-white/5 px-4 py-3.5 text-center text-lg tracking-[0.15em] text-white/90 outline-none backdrop-blur-sm placeholder:text-white/35 focus:border-white/50 disabled:opacity-60'
			/>
			<p
				className={`mt-2 text-sm tracking-[0.2em] text-white/50 ${atNicknameLimit ? 'visible' : 'invisible'}`}
			>
				{COPY.nicknameMaxHint}
			</p>
			<button
				type='button'
				onClick={onConfirm}
				disabled={confirmDisabled}
				className={`mt-1 text-sm tracking-[0.2em] text-white/70 hover:enabled:text-white disabled:opacity-35 ${showConfirm ? 'visible' : 'invisible'}`}
			>
				{COPY.nicknameConfirm}
			</button>
		</div>
	);
};

export default NicknameField;
