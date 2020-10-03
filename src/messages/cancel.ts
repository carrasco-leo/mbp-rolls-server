//
// cancel.ts — mbp-rolls-server
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

export function cancel(connection: connection, user: User): Promise<void> {
	if (!user.action) {
		return Promise.resolve();
	}

	const index = history.indexOf(user.action);
	if (index !== -1) {
		history.splice(index, 1);
	}

	ids.delete(user.action.id);
	broadcast({ type: 'cancel', id: user.action.id });
	user.action = null;
	user.step = 'start';

	return Promise.resolve();
}
