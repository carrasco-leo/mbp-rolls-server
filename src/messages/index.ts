//
// index.ts — mbp-rolls-server
// ~/src/messages
//

import { connection } from 'websocket';

import { rename } from './rename';
import { User } from '../user';

export interface MessageFn {
	(connection: connection, user: User, data: any): Promise<any>;
}

export const messagesFn: { [key: string]: MessageFn; } = {
	rename,
}
