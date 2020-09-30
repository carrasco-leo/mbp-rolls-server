//
// close.ts — mbp-rolls-server
// ~/src/events
//

import { connection } from 'websocket';

import { User } from '../user';
import { log } from '../logging';
import { slugify } from '../util';
import { ids, usernames, connected, broadcast } from '../connected-users';

export function closeEvent(connection: connection, user: User): void {
	log('Client %s (%s) disconnected', user.id, user.name);

	ids.delete(user.id);
	usernames.delete(slugify(user.name));
	connected.delete(connection);

	if (user.name) {
		broadcast({ type: 'disconnection', id: user.id });
	}
}
