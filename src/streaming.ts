//
// streaming.ts — mbp-rolls-server
// ~/src
//

import { request } from 'websocket';

import { isOriginAllowed } from './origin-allowed';
import { log, errorlog } from './logging';

export function streaming(req: request): void {
	if (!isOriginAllowed(req.origin)) {
		errorlog('Connection from %s rejected', req.origin);
		req.reject();
		return;
	}

	const connection = req.accept(null, req.origin);
	log('Client connected');

	connection.on('error', (error) => errorlog('connection error:', error));
	connection.on('close', () => log('Client disconnected'));
	connection.on('message', (ev) => log('%s message:', ev.type, ev.utf8Data));
}
