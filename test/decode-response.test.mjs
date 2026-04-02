import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const { Either } = require('effect');
const { decodeGatewayResponse } = require('../dist/nodes/SubstackGateway/runtime/decode-response.js');

test('decodeGatewayResponse decodes own profile responses', () => {
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

test('decodeGatewayResponse fails on invalid note response payloads', () => {
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
