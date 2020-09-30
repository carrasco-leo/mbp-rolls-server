//
// streaming.ts — mbp-rolls-server
// ~/src
//

import { request } from 'websocket';

import { isOriginAllowed } from './origin-allowed';
import { log, errorlog } from './logging';
import { generateId, ids } from './connected-users';
import { closeEvent, messageEvent, errorEvent } from './events';
import { User } from './user';
import { MessageError } from './messages';

export function streaming(req: request): void {
	if (!isOriginAllowed(req.origin)) {
		errorlog('Connection from %s rejected', req.origin);
		req.reject();
		return;
	}

	const connection = req.accept(null, req.origin);
	const user: User = { id: generateId(), name: null };

	ids.add(user.id);
	log('Client %s connected', user.id);

	connection.on('error', (error) => errorEvent(user, error));
	connection.on('close', () => closeEvent(connection, user));

	connection.on('message', (event) => messageEvent(connection, user, event)
		.catch((error) => {
			if (error instanceof MessageError) {
				errorlog('Client %s (%s) error in %s:', user.id, user.name, error.label, error);
			} else {
				errorlog('Client %s (%s) error:', user.id, user.name, error);
			}

			connection.sendUTF(JSON.stringify({
				type: 'error',
				reason: error.message,
			}));
		})
	);
}
