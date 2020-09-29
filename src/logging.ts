//
// logging.ts — mbp-rolls-server
// ~/src
//

export function log(message: string, ...args: any[]): void {
	const date = new Date().toISOString();
	console.log('[%s] ' + message, date, ...args);
}

export function errorlog(message: string, ...args: any[]): void {
	const date = new Date().toISOString();
	console.error('[%s] ' + message, date, ...args);
}
