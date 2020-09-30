//
// error.ts — mbp-rolls-server
// ~/src/events
//

import { User } from '../user';
import { errorlog } from '../logging';

export function errorEvent(user: User, error: Error): void {
	errorlog('Client %s (%s) error:', user.id, user.name, error)
}
