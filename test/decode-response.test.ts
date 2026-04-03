import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Either } from 'effect';

import { decodeGatewayResponse } from '../dist/nodes/SubstackGateway/runtime/decode-response.js';

describe('decodeGatewayResponse', () => {
	it('should decode own profile responses', () => {
		const result = decodeGatewayResponse(
			{
				_tag: 'OwnPublication',
				command: { _tag: 'OwnProfile' },
			},
			{
				id: 1,
				handle: 'substack',
				name: 'Substack',
				url: 'https://substack.com',
				avatar_url: 'https://cdn.example/avatar.png',
			},
		);

		assert.equal(Either.isRight(result), true);
		assert.deepEqual(result.right, {
			_tag: 'OwnPublication',
			result: {
				_tag: 'Profile',
				item: {
					id: 1,
					handle: 'substack',
					name: 'Substack',
					url: 'https://substack.com',
					avatarUrl: 'https://cdn.example/avatar.png',
				},
			},
		});
	});

	it('should fail on invalid note response payloads', () => {
		const result = decodeGatewayResponse(
			{
				_tag: 'Note',
				command: { _tag: 'Get', noteId: 1 },
			},
			{
				id: 1,
				body: 123,
			},
		);

		assert.equal(Either.isLeft(result), true);
		assert.equal(result.left._tag, 'ResponseDecodeError');
	});
});
