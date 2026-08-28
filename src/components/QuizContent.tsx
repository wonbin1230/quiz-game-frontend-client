import React from 'react';

import { useSessionStore } from '../stores/sessionStore';
import { useGameStore } from '../stores/gameStore';
import { SessionState } from '../types/session';
import { GamePhase } from '../types/game';
import { COPY } from '../constants/copy';

import Question from './Question';
import OptionArea from './OptionArea';
import Countdown from './Countdown';
import WaitingStart from './WaitingStart';
import RevealOptions from './RevealOptions';
import PersonalResult from './PersonalResult';
import SubmitAnswerButton from './buttons/SubmitAnswerButton';
import Notice from './Notice';
import StageFrame from './StageFrame';

const QuizContent = () => {
	const session = useSessionStore((s) => s.state);
	const isReconnecting = useSessionStore((s) => s.isReconnecting);
	const phase = useGameStore((s) => s.phase);

	const inLobby =
		session === SessionState.InRoom &&
		(phase === GamePhase.Idle || phase === GamePhase.Lobby);

	const inSettle =
		phase === GamePhase.Settle || phase === GamePhase.ShowAnswer;

	const inRanking =
		phase === GamePhase.ShowRanking || phase === GamePhase.Finished;

	return (
		<>
			{isReconnecting && (
				<div className='absolute inset-0 z-30 flex items-center justify-center bg-black/60'>
					<p className='text-sm tracking-[0.2em] text-white/70 sm:text-lg'>
						{COPY.reconnecting}
					</p>
				</div>
			)}
			<StageFrame>
				{inLobby && <WaitingStart />}
				{phase === GamePhase.Voting && (
					<div className='relative flex h-full min-h-0 flex-col gap-2'>
						<Countdown />
						<Question />
						<OptionArea />
						<div className='flex h-14 shrink-0 flex-col items-center justify-center gap-1'>
							<Notice />
							<SubmitAnswerButton />
						</div>
					</div>
				)}
				{inSettle && <RevealOptions />}
				{inRanking && <PersonalResult />}
			</StageFrame>
		</>
	);
};

export default QuizContent;
