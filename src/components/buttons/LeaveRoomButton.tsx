import React from 'react';

import { LeaveRoom } from '../../socket/events/room';
import { COPY } from '../../constants/copy';
import GameButton from './GameButton';

const LeaveRoomButton = () => {
	return (
		<div className='flex items-center justify-center'>
			<GameButton onClick={LeaveRoom}>
				{COPY.leave}
			</GameButton>
		</div>
	);
};

export default LeaveRoomButton;
