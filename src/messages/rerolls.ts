//
// rerolls.ts — mbp-rolls-server
// ~/src/messages
//

import { connection } from 'websocket';
import * as joi from 'joi';

import { MessageError } from './error';
import { User, generateAction } from '../user';
import { usernames, connected, broadcast } from '../connected-users';
import { log } from '../logging';
import { d6, generateId } from '../util';
import { ids, history } from '../history';

interface RerollsData {
	type: 'rerolls';
	selected: boolean[];
}

const schema = joi.object({
	type: joi.string().valid('rerolls').required(),
	selected: joi.array().items(joi.bool()).required(),
});

export function rerolls(connection: connection, user: User, data: any): Promise<void> {
	if (user.step !== 'rerolls') {
		return Promise.reject(new MessageError('rerolls', 'Impossible to reroll dices'));
	}

	return schema.validateAsync(data)
		.catch((error: joi.ValidationError) => {
			return Promise.reject(new MessageError('rerolls', error.message));
		})
		.then((data: RerollsData) => {
			if (data.selected.length !== user.action.dices) {
				return Promise.reject(new MessageError('rerolls', 'Invalid data'));
			} else if (checkSelected(data.selected, user.action.rolls, user.action.discarded)) {
				return Promise.reject(new MessageError('rerolls', 'Must select only dices with value of 5 that were not discarded'));
			}

			user.action.rolls = user.action.rolls.map((value, index) => {
				if (!data.selected[index]) {
					return value;
				}

				const roll = d6();
				return (roll === 0) ? 0 : value + roll;
			});
			user.step = 'last-modifiers';

			broadcast({
				type: 'update',
				id: user.action.id,
				rolls: user.action.rolls,
				discarded: user.action.discarded,
				resolved: false,
			});

			connection.sendUTF(JSON.stringify({
				type: 'ack',
				rolls: user.action.rolls,
				discarded: user.action.discarded,
				bonus: user.currentBonus,
			}));
		})
}

function checkSelected(selected: boolean[], rolls: number[], discarded: number[]) {
	return !!selected.find((value, index) => {
		return value && (rolls[index] !== 5 || discarded[index] !== 0);
	});
}
