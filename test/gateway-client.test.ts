import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Effect } from 'effect';

import {
	GatewayClient,
	makeGatewayClientLayer,
} from '../dist/nodes/SubstackGateway/runtime/gateway-client.js';
import { executeGatewayRequest } from '../dist/nodes/SubstackGateway/runtime/execute-request.js';

describe('GatewayClient service', () => {
	it('should delegate executeGatewayRequest to GatewayClient', async () => {
		let capturedRequest: unknown;

		const response = await Effect.runPromise(
			Effect.provideService(
				executeGatewayRequest({
					method: 'GET',
					url: 'http://localhost:5001/api/v1/me',
					responseMode: 'single',
				}),
				GatewayClient,
				{
					execute: (request) => {
						capturedRequest = request;
						return Effect.succeed({ ok: true });
					},
				},
			),
		);

		assert.deepEqual(capturedRequest, {
			method: 'GET',
			url: 'http://localhost:5001/api/v1/me',
			responseMode: 'single',
		});
		assert.deepEqual(response, { ok: true });
	});

	it('should build a live client layer from n8n context', async () => {
		const calls: Array<{
			credentialName: string;
			request: unknown;
			self: unknown;
		}> = [];
		const context = {
			helpers: {
				httpRequestWithAuthentication(this: unknown, credentialName: string, request: unknown) {
					calls.push({ credentialName, request, self: this });
					return Promise.resolve({ ok: true });
				},
			},
		};

		const response = await Effect.runPromise(
			Effect.provide(
				executeGatewayRequest({
					method: 'GET',
					url: 'http://localhost:5001/api/v1/me',
					responseMode: 'single',
				}),
				makeGatewayClientLayer(context as never),
			),
		);

		assert.deepEqual(response, { ok: true });
		assert.equal(calls.length, 1);
		assert.equal(calls[0].credentialName, 'substackGatewayApi');
		assert.equal(calls[0].self, context);
		assert.deepEqual(calls[0].request, {
			json: true,
			method: 'GET',
			url: 'http://localhost:5001/api/v1/me',
		});
	});
});
