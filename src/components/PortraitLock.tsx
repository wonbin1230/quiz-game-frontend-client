import React from 'react';

import { COPY } from '../constants/copy';

/** 手機橫向時蓋住畫面。瀏覽器無法可靠鎖定方向，尤其是 iOS。 */
const PortraitLock = () => {
	return (
		<div className='portrait-lock' role='alertdialog' aria-modal='true' aria-label={COPY.rotatePortrait}>
			<div className='portrait-lock-phone' aria-hidden />
			<p>{COPY.rotatePortrait}</p>
		</div>
	);
};

export default PortraitLock;
