import React from 'react';

interface IOptionProps {
	label: string,
	text: string,
	highlighted?: boolean,
	picked?: boolean,
	dimmed?: boolean,
	disabled?: boolean,
	align?: 'center' | 'start',
	onSelect?: () => void,
}

const Option = ({
	label,
	text,
	highlighted = false,
	picked = false,
	dimmed = false,
	disabled = false,
	align = 'center',
	onSelect,
}: IOptionProps) => {
	const alignStart = align === 'start';
	const className = [
		'relative h-full w-full overflow-hidden rounded-sm border p-3 sm:p-4',
		'backdrop-blur-sm transition-all duration-300',
		picked ? 'bg-amber-200/10' : 'bg-white/5',
		highlighted
			? 'border-white shadow-[0_0_0_1px_rgba(255,255,255,0.55),0_0_24px_rgba(255,255,255,0.35)]'
			: picked
				? 'border-amber-200/80 shadow-[0_0_0_1px_rgba(253,230,138,0.4),0_0_18px_rgba(251,191,36,0.22)]'
				: 'border-white/25',
		dimmed ? 'opacity-45' : 'opacity-100',
		onSelect && !disabled ? 'cursor-pointer active:scale-[0.98]' : '',
		disabled ? 'cursor-not-allowed' : '',
	].join(' ');

	const inner = (
		<div className={`relative z-10 grid h-full grid-cols-[32px_1fr] sm:grid-cols-[40px_1fr] ${alignStart ? 'items-start' : 'items-center'}`}>
			<div className={`flex justify-center text-xl font-semibold tracking-[0.2em] text-white sm:text-3xl ${alignStart ? 'items-start' : 'items-center'}`}>
				{label}
			</div>
			<div className={`flex text-base leading-snug tracking-[0.08em] text-white/80 sm:text-2xl ${alignStart ? 'items-start justify-start text-left' : 'items-center justify-center text-center'}`}>
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
