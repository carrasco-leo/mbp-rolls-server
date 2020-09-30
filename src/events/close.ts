//
// close.ts — mbp-rolls-server
// ~/src/events
//

import { User } from '../user';
import { log } from '../logging';
import { ids, usernames, broadcast } from '../connected-users';

export function closeEvent(user: User): void {
	log('Client %s (%s) disconnected', user.id, user.name);

	ids.delete(user.id);
	usernames.delete(user.name);

	broadcast({ type: 'disconnection', id: user.id });
}
