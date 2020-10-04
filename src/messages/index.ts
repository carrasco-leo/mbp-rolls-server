//
// index.ts — mbp-rolls-server
// ~/src/messages
//

import { connection } from 'websocket';

import { rename } from './rename';
import { start } from './start';
import { cancel } from './cancel';
import { modifiers } from './modifiers';

import { User } from '../user';

export interface MessageFn {
	(connection: connection, user: User, data: any): Promise<any>;
}

export const messagesFn: { [key: string]: MessageFn; } = {
	rename,
	start,
	cancel,
	modifiers,
}

export * from './error';
