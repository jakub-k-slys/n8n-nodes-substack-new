import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const { buildGatewayRequest } = require('../dist/nodes/SubstackGateway/runtime/build-request.js');

test('buildGatewayRequest builds note create requests', () => {
	const request = buildGatewayRequest('http://localhost:5001/api/v1', {
		_tag: 'Note',
		command: {
			_tag: 'Create',
			content: 'hello',
			attachment: 'https://example.com/file.png',
		},
	});

	assert.deepEqual(request, {
		method: 'POST',
		url: 'http://localhost:5001/api/v1/notes',
		body: {
			content: 'hello',
			attachment: 'https://example.com/file.png',
		},
		responseMode: 'single',
	});
});

test('buildGatewayRequest builds profile posts requests with pagination', () => {
	const request = buildGatewayRequest('http://localhost:5001/api/v1', {
		_tag: 'Profile',
		command: {
			_tag: 'GetPosts',
			profileSlug: 'substack',
			limit: 10,
			offset: 20,
		},
	});

	assert.deepEqual(request, {
		method: 'GET',
		url: 'http://localhost:5001/api/v1/profiles/substack/posts',
		qs: {
			limit: 10,
			offset: 20,
		},
		responseMode: 'items',
	});
});
