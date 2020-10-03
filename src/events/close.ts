//
// close.ts — mbp-rolls-server
// ~/src/events
//

import { connection } from 'websocket';

import { User } from '../user';
import { log } from '../logging';
import { slugify } from '../util';
import { ids, usernames, connected, broadcast } from '../connected-users';
import { history, ids as historyIds } from '../history';

export function closeEvent(connection: connection, user: User): void {
	log('Client %s (%s) disconnected', user.id, user.name);

	ids.delete(user.id);
	usernames.delete(slugify(user.name));
	connected.delete(connection);

	if (user.name) {
		broadcast({ type: 'disconnection', id: user.id });
	}

	// remove the active action
	if (user.action) {
		const index = history.indexOf(user.action);
		historyIds.delete(user.action.id);
		if (index !== -1) {
			history.splice(index, 1);
		}

		broadcast({ type: 'cancel', id: user.action.id });
	}
}
