import React from 'react';

interface IOptionProps {
	label: string,
	text: string,
	highlighted?: boolean,
	dimmed?: boolean,
	disabled?: boolean,
	onSelect?: () => void,
}

const Option = ({
	label,
	text,
	highlighted = false,
	dimmed = false,
	disabled = false,
	onSelect,
}: IOptionProps) => {
	const className = [
		'relative h-full w-full overflow-hidden rounded-sm border bg-white/5 p-3 sm:p-4',
		'backdrop-blur-sm transition-all duration-300',
		highlighted
			? 'border-white shadow-[0_0_0_1px_rgba(255,255,255,0.55),0_0_24px_rgba(255,255,255,0.35)]'
			: 'border-white/25',
		dimmed ? 'opacity-45' : 'opacity-100',
		onSelect && !disabled ? 'cursor-pointer active:scale-[0.98]' : '',
		disabled ? 'cursor-not-allowed' : '',
	].join(' ');

	const inner = (
		<div className='relative z-10 grid h-full grid-cols-[32px_1fr] items-center sm:grid-cols-[40px_1fr]'>
			<div className='flex items-center justify-center text-xl font-semibold tracking-[0.2em] text-white sm:text-3xl'>
				{label}
			</div>
			<div className='flex items-center justify-center text-center text-base leading-snug tracking-[0.08em] text-white/80 sm:text-2xl'>
				<span className='block'>{text}</span>
			</div>
		</div>
	);

	if (onSelect) {
		return (
			<button
				type='button'
				className={className}
				disabled={disabled}
				onClick={onSelect}
			>
				{inner}
			</button>
		);
	}

	return (
		<div className={className}>
			{inner}
		</div>
	);
};

export default Option;
