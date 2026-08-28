import React, { useEffect } from 'react';

import { InitializeSocketSystem } from './socket';
import { HydratePersistedUser } from './socket/client';
import { SessionState } from './types/session';
import { useSessionStore } from './stores/sessionStore';

import './App.css';
import QuizGame from './pages/QuizGame';
import Lobby from './components/Lobby';
import LightRays from './components/backgrounds/LightRays';

const App = () => {
	const session = useSessionStore((s) => s.state);
	const inRoom = session === SessionState.InRoom;

	useEffect(() => {
		HydratePersistedUser();
		InitializeSocketSystem();
	}, []);

	return (
		<div className='relative min-h-screen overflow-hidden bg-black'>
			<div className='pointer-events-none absolute inset-0 z-0'>
				<LightRays
					raysOrigin='top-center'
					raysColor='#ffffff'
					raysSpeed={1}
					lightSpread={2}
					rayLength={3}
					followMouse={false}
					mouseInfluence={0}
					noiseAmount={0}
					distortion={0}
					className='custom-rays'
					fadeDistance={2}
					saturation={2}
				/>
			</div>

			<div className='relative z-10'>
				{inRoom ? <QuizGame /> : <Lobby />}
			</div>
		</div>
	);
};

export default App;
