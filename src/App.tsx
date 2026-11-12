import React, { useEffect } from 'react';

import { InitializeSocketSystem } from './socket';
import { HydratePersistedUser } from './socket/client';
import { SessionState } from './types/session';
import { useSessionStore } from './stores/sessionStore';

import './App.css';
import QuizGame from './pages/QuizGame';
import Lobby from './components/Lobby';
import StartGameIntro from './components/transitions/StartGameIntro';
import PortraitLock from './components/PortraitLock';
import { ANSWER_ROSE_LAYER_ID } from './components/AnswerRose';

const BACKGROUND_URL = `${import.meta.env.BASE_URL}background.png`;

const App = () => {
	const session = useSessionStore((s) => s.state);
	const inRoom = session === SessionState.InRoom;

	useEffect(() => {
		HydratePersistedUser();
		InitializeSocketSystem();
	}, []);

	return (
		<div className='relative min-h-screen overflow-hidden bg-paper text-ink'>
			<div
				className='pointer-events-none absolute inset-0 z-0'
				aria-hidden
				style={{
					backgroundImage: `url(${BACKGROUND_URL})`,
					backgroundSize: '100% 100%',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			/>
			<div id={ANSWER_ROSE_LAYER_ID} className='pointer-events-none absolute inset-0 z-30 overflow-visible' />

			<div className='relative z-10'>
				{inRoom ? <QuizGame /> : <Lobby />}
			</div>
			<StartGameIntro />
			<PortraitLock />
		</div>
	);
};

export default App;
