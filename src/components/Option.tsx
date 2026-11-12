import React from 'react';

interface IOptionProps {
	label: string,
	text: string,
	highlighted?: boolean,
	picked?: boolean,
	dimmed?: boolean,
	disabled?: boolean,
	showAnswerFrame?: boolean,
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
	showAnswerFrame = false,
	align = 'center',
	onSelect,
}: IOptionProps) => {
	const alignStart = align === 'start';
	const className = [
		'relative h-full w-full overflow-hidden rounded-xl border-2 bg-white/70 p-3 backdrop-blur-sm sm:p-4',
		showAnswerFrame ? 'answer-frame-glow' : 'transition-all duration-300',
		showAnswerFrame
			? 'border-[#c98996]'
			: highlighted
				? 'border-gold shadow-[0_0_0_1px_rgba(176,138,88,0.45),0_0_24px_rgba(231,180,190,0.55)]'
				: picked
					? 'border-rose shadow-[0_0_0_1px_rgba(165,107,120,0.45)]'
					: 'border-blush/80',
		dimmed ? 'opacity-45' : 'opacity-100',
		onSelect && !disabled ? 'cursor-pointer active:scale-[0.98]' : '',
		disabled ? 'cursor-not-allowed' : '',
	].join(' ');

	const inner = (
		<div className={`relative z-10 grid h-full grid-cols-[32px_1fr] sm:grid-cols-[40px_1fr] ${alignStart ? 'items-start' : 'items-center'}`}>
			<div className={`flex justify-center text-xl font-bold tracking-[0.2em] text-gold sm:text-3xl ${alignStart ? 'items-start' : 'items-center'}`}>
				{label}
			</div>
			<div className={`flex text-base font-bold leading-snug tracking-[0.08em] text-ink sm:text-2xl ${alignStart ? 'items-start justify-start text-left' : 'items-center justify-center text-center'}`}>
				<span className='block'>{text}</span>
			</div>
		</div>
	);

	const frame = showAnswerFrame ? (
		<div className='answer-frame-ring pointer-events-none absolute inset-0 rounded-[10px] border-2 border-[#f0c4cb]' />
	) : null;

	if (onSelect) {
		return (
			<button
				type='button'
				className={className}
				disabled={disabled}
				onClick={onSelect}
			>
				{frame}
				{inner}
			</button>
		);
	}

	return (
		<div className={className}>
			{frame}
			{inner}
		</div>
	);
};

export default Option;
