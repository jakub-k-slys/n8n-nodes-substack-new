import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildGatewayRequest } from '../dist/nodes/SubstackGateway/runtime/build-request.js';

describe('buildGatewayRequest', () => {
	it('should build note create requests', () => {
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

	it('should build profile posts requests with pagination', () => {
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
});
