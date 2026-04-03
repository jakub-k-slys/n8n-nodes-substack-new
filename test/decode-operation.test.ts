import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Either } from 'effect';

import { decodeGatewayOperation } from '../dist/nodes/SubstackGateway/runtime/decode-operation.js';

describe('decodeGatewayOperation', () => {
	it('should decode supported resource operations', () => {
		const result = decodeGatewayOperation('profile', 'getProfilePosts');

		assert.equal(Either.isRight(result), true);
		assert.deepEqual(result.right, {
			_tag: 'Profile',
			operation: 'getProfilePosts',
		});
	});

	it('should reject unsupported combinations', () => {
		const result = decodeGatewayOperation('note', 'getProfile');

		assert.equal(Either.isLeft(result), true);
		assert.deepEqual(result.left, {
			_tag: 'UnsupportedOperation',
			resource: 'note',
			operation: 'getProfile',
		});
	});
});
