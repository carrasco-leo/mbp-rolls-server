//
// index.ts — mbp-rolls-server
// ~/src/messages
//

import { connection } from 'websocket';

import { rename } from './rename';
import { start } from './start';
import { cancel } from './cancel';
import { modifiers } from './modifiers';
import { rerolls } from './rerolls';

import { User } from '../user';

export interface MessageFn {
	(connection: connection, user: User, data: any): Promise<any>;
}

export const messagesFn: { [key: string]: MessageFn; } = {
	rename,
	start,
	cancel,
	modifiers,
	rerolls,
}

export * from './error';
