//
// start.ts — mbp-rolls-server
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

interface StartData {
	type: 'start';
	dices: number;
	difficulty: number;
	bonus: number;
}

const schema = joi.object({
	type: joi.string().valid('start').required(),
	dices: joi.number().integer().positive().required(),
	difficulty: joi.number().integer().positive().required(),
	bonus: joi.number().integer().min(0).required(),
});

export function start(connection: connection, user: User, data: any): Promise<void> {
	if (user.step !== 'start') {
		return Promise.reject(new MessageError('start', 'Impossible to start a new roll'));
	}

	return schema.validateAsync(data)
		.catch((error: joi.ValidationError) => {
			return Promise.reject(new MessageError('rename', error.message));
		})
		.then((data: StartData) => {
			const id = generateId(ids);
			ids.add(id);

			user.action = generateAction(id, user.id);
			user.action.dices = data.dices;
			user.action.difficulty = data.difficulty;
			user.action.bonus = data.bonus;
			user.action.rolls = Array.from({ length: data.dices }, () => d6());
			user.action.discarded = Array.from({ length: data.dices }, () => 0);
			user.currentBonus = data.bonus;
			user.step = 'primary-modifiers';

			history.push(user.action);
			broadcast({ type: 'roll', ...user.action });
			connection.sendUTF(JSON.stringify({
				type: 'ack',
				rolls: user.action.rolls,
			}));
		})
}
