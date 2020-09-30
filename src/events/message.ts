//
// message.ts — mbp-rolls-server
// ~/src/events
//

import { IMessage, connection } from 'websocket';

import { User } from '../user';
import { log, errorlog } from '../logging';
import { usernames, connected } from '../connected-users';
import { slugify } from '../util';
import { messagesFn } from '../messages';

export function messageEvent(connection: connection, user: User, event: IMessage): Promise<any> {
	// Ignore non-utf8 messages
	if (event.type !== 'utf8') {
		errorlog(
			'Client %s (%s) error: ignore received %s message',
			user.id,
			user.name,
			event.type,
		);

		return Promise.resolve();
	}

	try {
		const data = JSON.parse(event.utf8Data);

		if (!data || !data.type) {
			throw new Error('invalid message format');
		} else if (!messagesFn[data.type]) {
			throw new Error('unknown message type');
		}

		return messagesFn[data.type](connection, user, data)
	} catch (error) {
		return Promise.reject(error);
	}
}
