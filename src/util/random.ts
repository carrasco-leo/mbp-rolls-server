//
// random.ts — mbp-rolls-server
// ~/src/util
//

/**
 * Returns a random integer from interval [0;5]
 */
export function d6(): number {
	return Math.floor(Math.random() * 6 + 1) % 6;
}

/**
 * Generate an unique ID.
 */
export function generateId(excludes: Set<string>) {
	let id: string;
	do {
		id = Math.random().toString(32).slice(2);
	} while (excludes.has(id));
	return id;
}
