//
// connected-users.ts — mbp-rolls-server
// ~/src
//

import { connection } from 'websocket';

import { User } from './user';
import { log } from './logging';

export const ids = new Set<string>();
export const usernames = new Set<string>();
export const connected = new Map<connection, User>();

export function generateId(): string {
	let id: string;
	do {
		id = Math.random().toString(32).slice(2);
	} while (ids.has(id));

	return id;
}

export function broadcast(data: any): void;
export function broadcast(ignore: connection, data: any): void;
export function broadcast(ignore: connection, data?: any): void {
	if (!data) {
		data = ignore;
		ignore = null;
	}

	const message = JSON.stringify(data);
	log('broadcast:', data);

	connected.forEach((user, connection) => {
		if (connection === ignore) {
			return;
		}

		connection.sendUTF(message);
	});
}
