import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const { Effect } = require('effect');
const { GatewayClient, makeGatewayClientLayer } = require('../dist/nodes/SubstackGateway/runtime/gateway-client.js');
const { executeGatewayRequest } = require('../dist/nodes/SubstackGateway/runtime/execute-request.js');

test('executeGatewayRequest delegates to GatewayClient service', async () => {
	let capturedRequest;

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

test('makeGatewayClientLayer creates a live client from n8n context', async () => {
	const calls = [];
	const context = {
		helpers: {
			httpRequestWithAuthentication(credentialName, request) {
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
			makeGatewayClientLayer(context),
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
