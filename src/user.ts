//
// user.ts — mbp-rolls-server
// ~/src
//

export interface Action {
	id: string;
	uid: string;
	date: string;
	dices: number;
	difficulty: number;
	bonus: number;
	rolls: number[];
	discarded: number[];
	resolved: boolean;
}

export interface User {
	id: string;
	name: string;
	step: 'start'|'primary-modifiers'|'rerolls'|'last-modifiers';
	currentBonus: number;
	action: Action;
}

export function generateUser(id: string): User {
	const value: User = {
		id,
		name: null,
		step: 'start',
		currentBonus: null,
		action: null,
	}

	return value;
}

export function generateAction(id: string, uid: string): Action {
	const value: Action = {
		id,
		uid,
		date: new Date().toISOString(),
		dices: 0,
		difficulty: 0,
		bonus: 0,
		rolls: [],
		discarded: [],
		resolved: false,
	}

	return value;
}
