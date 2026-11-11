import { create } from 'zustand';

/**
 * 與 Manager `src/transitions/config.ts` 的 startGameIntro 相同。
 * 兩邊都在 QuizGame:GameStarted 之後才開始跑這段。
 */
export const START_INTRO = {
	fadeInSec: 1,
	fadeOutSec: 1,
	typeCharMs: 100,
	typePauseMs: 500,
	typeHoldMs: 1000,
	typeFirst: '讓我們',
	typeSecond: '開始吧',
} as const;

type IntroPhase = 'idle' | 'covering' | 'revealing';
type IntroBeat = 'none' | 'fadeIn' | 'typing' | 'holding';

interface StartIntroStore {
	phase: IntroPhase,
	coverBeat: IntroBeat,
	play: () => void,
	markPerformanceDone: () => void,
	startReveal: () => void,
	finish: () => void,
}

let beatTimer: ReturnType<typeof setTimeout> | null = null;
let finishTimer: ReturnType<typeof setTimeout> | null = null;

function clearTimers() {
	if (beatTimer) {
		clearTimeout(beatTimer);
		beatTimer = null;
	}
	if (finishTimer) {
		clearTimeout(finishTimer);
		finishTimer = null;
	}
}

export const useStartIntroStore = create<StartIntroStore>((set, get) => ({
	phase: 'idle',
	coverBeat: 'none',
	play: () => {
		if (get().phase === 'covering') return;
		clearTimers();
		set({ phase: 'covering', coverBeat: 'fadeIn' });
		beatTimer = setTimeout(() => {
			beatTimer = null;
			if (get().phase !== 'covering') return;
			set({ coverBeat: 'typing' });
		}, START_INTRO.fadeInSec * 1000);
	},
	markPerformanceDone: () => {
		if (get().phase !== 'covering') return;
		set({ coverBeat: 'holding' });
	},
	startReveal: () => {
		if (get().phase !== 'covering') return;
		clearTimers();
		set({ phase: 'revealing', coverBeat: 'none' });
		finishTimer = setTimeout(() => {
			finishTimer = null;
			get().finish();
		}, START_INTRO.fadeOutSec * 1000 + 40);
	},
	finish: () => {
		if (get().phase === 'idle') return;
		clearTimers();
		set({ phase: 'idle', coverBeat: 'none' });
	},
}));
