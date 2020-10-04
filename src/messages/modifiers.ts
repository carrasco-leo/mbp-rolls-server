//
// modifiers.ts — mbp-rolls-server
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

interface ModifiersData {
	type: 'modifiers';
	modifiers: number[];
	discarded: number[];
}

const schema = joi.object({
	type: joi.string().valid('modifiers').required(),
	modifiers: joi.array().items(joi.number().integer().min(0)).required(),
	discarded: joi.array().items(joi.number().integer().valid(0, 1, 3)).required(),
});

export function modifiers(connection: connection, user: User, data: any): Promise<void> {
	if (user.step !== 'primary-modifiers' && user.step !== 'last-modifiers') {
		return Promise.reject(new MessageError('modifiers', 'Impossible to modify rolls'));
	}

	return schema.validateAsync(data)
		.catch((error: joi.ValidationError) => {
			return Promise.reject(new MessageError('modifiers', error.message));
		})
		.then((data: ModifiersData) => {
			if (data.modifiers.length !== user.action.dices || data.discarded.length !== user.action.dices) {
				return Promise.reject(new MessageError('modifiers', 'Invalid data'));
			}

			const bonus = user.currentBonus + data.discarded.reduce((x, y) => x + y, 0);
			const bonusLeft = bonus - data.modifiers.reduce((x, y) => x + y, 0);

			if (bonusLeft < 0) {
				return Promise.reject(new MessageError('modifiers', 'Too many increases'));
			} else if (checkModifiers(data.modifiers, user.action.discarded)) {
				return Promise.reject(new MessageError('modifiers', 'Increased a discarded dice'));
			} else if (checkDiscarded(data.discarded, user.action.discarded)) {
				return Promise.reject(new MessageError('modifiers', 'Discarded an already discarded dice'));
			}

			user.action.rolls = user.action.rolls.map((value, index) => value + data.modifiers[index]);
			user.action.discarded = user.action.discarded.map((value, index) => value || data.discarded[index]);
			user.currentBonus = bonusLeft;
			user.action.resolved = user.step === 'last-modifiers';
			user.step = (user.action.resolved) ? 'start' : 'rerolls';

			broadcast({
				type: 'update',
				id: user.action.id,
				rolls: user.action.rolls,
				discarded: user.action.discarded,
				resolved: user.action.resolved,
			});
			connection.sendUTF(JSON.stringify({ type: 'ack' }));

			if (user.action.resolved) {
				user.action = null;
			}
		})
}

function checkDiscarded(discarded: number[], prev: number[]): boolean {
	return !!discarded.find((value, index) => value !== 0 && prev[index] !== 0);
}

function checkModifiers(modifiers: number[], discarded: number[]): boolean {
	return !!modifiers.find((value, index) => value !== 0 && discarded[index] !== 0);
}
