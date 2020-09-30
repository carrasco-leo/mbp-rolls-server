//
// error.ts — mbp-rolls-server
// ~/src/messages
//

export class MessageError extends Error {
	constructor(readonly label: string, message: string) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
