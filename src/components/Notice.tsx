import React from 'react';

import { useNoticeStore } from '../stores/noticeStore';

const Notice = () => {
	const notice = useNoticeStore((s) => s.notice);

	if (!notice) {
		return null;
	}

	return (
		<p className='text-center text-sm tracking-[0.2em] text-white/55'>
			{notice}
		</p>
	);
};

export default Notice;
