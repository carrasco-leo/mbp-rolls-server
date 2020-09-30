//
// slugify.spec.ts — mbp-rolls-server
// ~/src/util
//

import { slugify } from './slugify';
import { expect } from 'chai';

describe('slugify', () => {
	it('should return an empty string', () => {
		expect(slugify('')).to.be.empty;
		expect(slugify(null)).to.be.empty;
	});

	it('should not return a string that start or end with `-`', () => {
		expect(slugify('--hello world--')).to.be.equal('hello-world');
		expect(slugify('  hello world  ')).to.be.equal('hello-world');
		expect(slugify('[hello world]')).to.be.equal('hello-world');
	});

	it('should not return a string that contains successive `-`', () => {
		expect(slugify('hello -- world]')).to.be.equal('hello-world');
	});
});
