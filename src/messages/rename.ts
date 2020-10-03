//
// rename.ts — mbp-rolls-server
// ~/src/messages
//

import { connection } from 'websocket';
import * as joi from 'joi';

import { MessageError } from './error';
import { User } from '../user';
import { slugify } from '../util';
import { usernames, connected, broadcast } from '../connected-users';
import { log } from '../logging';

interface RenameData {
	type: 'rename';
	value: string;
}

const schema = joi.object({
	type: joi.string().valid('rename').required(),
	value: joi.string().trim().required(),
});

export function rename(connection: connection, user: User, data: any): Promise<void> {
	return schema.validateAsync(data)
		.catch((error: joi.ValidationError) => {
			return Promise.reject(new MessageError('rename', error.message));
		})
		.then((data: RenameData) => {
			const currentSlug = slugify(user.name);
			const slug = slugify(data.value);

			if (slug !== currentSlug && usernames.has(slug)) {
				return Promise.reject(new MessageError('rename', 'The username is already used'));
			}

			// first identification
			if (user.name === null) {
				return identify(connection, user, data.value, slug);
			}

			usernames.delete(currentSlug);
			usernames.add(slug);
			user.name = data.value;

			broadcast({ type: 'rename', id: user.id, value: user.name });
		})
}

function identify(connection: connection, user: User, username: string, slug: string) {
	log('Client %s has identified as %s', user.id, username);
	usernames.add(slug);
	user.name = username;
	connected.set(connection, user);

	connection.sendUTF(JSON.stringify({
		type: 'welcome',
		id: user.id,
		users: ((users: { [key: string]: string; } = {}) => {
			connected.forEach((user) => users[user.id] = user.name);
			return users;
		})(),
	}));

	broadcast(connection, {
		type: 'connection',
		id: user.id,
		username: user.name,
	});
}
