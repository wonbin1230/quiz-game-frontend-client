import React, { type ReactNode } from 'react';

interface IStageFrameProps {
	children: ReactNode,
}

const StageFrame = ({ children }: IStageFrameProps) => {
	return (
		<div className='relative flex h-[100dvh] min-h-[100dvh] flex-col pb-[env(safe-area-inset-bottom)]'>
			<div className='relative flex h-full items-center justify-center p-2 sm:p-8'>
				<div className='relative flex h-full min-h-0 w-full max-w-md flex-col gap-2 overflow-hidden p-2 sm:w-[70%] sm:max-w-none sm:p-4'>
					{children}
				</div>
			</div>
		</div>
	);
};

export default StageFrame;
