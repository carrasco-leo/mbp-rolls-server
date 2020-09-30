//
// slugify.ts — mbp-rolls-server
// ~/src/util
//

import { paramCase } from 'param-case';

export function slugify(value: string): string {
	return paramCase((value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
}
