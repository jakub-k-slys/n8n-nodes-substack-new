import assert from 'node:assert/strict';

import { Given, Then, When } from '@cucumber/cucumber';
import { Either, Effect } from 'effect';

import { buildGatewayRequest } from '../../../dist/nodes/SubstackGateway/runtime/build-request.js';
import { decodeGatewayCommand } from '../../../dist/nodes/SubstackGateway/runtime/decode-command.js';
import { decodeGatewayOperation } from '../../../dist/nodes/SubstackGateway/runtime/decode-operation.js';
import { decodeGatewayResponse } from '../../../dist/nodes/SubstackGateway/runtime/decode-response.js';
import {
	GatewayClient,
	makeGatewayClientLayer,
} from '../../../dist/nodes/SubstackGateway/runtime/gateway-client.js';
import { executeGatewayRequest } from '../../../dist/nodes/SubstackGateway/runtime/execute-request.js';
import { readGatewayInput } from '../../../dist/nodes/SubstackGateway/runtime/read-input.js';
import { gatewayResultToJsonItems } from '../../../dist/nodes/SubstackGateway/runtime/to-json.js';

type TestContext = {
	getNodeParameter: (name: string, itemIndex?: number, fallback?: unknown) => unknown;
};

type State = {
	command?: any;
	context?: TestContext;
	resource?: string;
	operation?: string;
	typedOperation?: any;
	request?: any;
	rawResponse?: any;
	result?: any;
	error?: unknown;
	serviceResponse?: any;
	capturedRequest?: any;
	liveCall?: any;
};

const state: State = {};

const parseJson = (value: string) => JSON.parse(value);

const createContext = (parameters: Record<string, unknown>): TestContext => ({
	getNodeParameter: (name, _itemIndex, fallback) => (name in parameters ? parameters[name] : fallback),
});

Given('the gateway command:', function (docString: string) {
	state.command = parseJson(docString);
});

Given('the gateway request:', function (docString: string) {
	state.request = parseJson(docString);
});

Given('the gateway resource {string} and operation {string}', function (resource: string, operation: string) {
	state.resource = resource;
	state.operation = operation;
});

Given('the gateway context parameters:', function (docString: string) {
	state.context = createContext(parseJson(docString));
});

Given('the typed gateway operation:', function (docString: string) {
	state.typedOperation = parseJson(docString);
});

Given('the gateway response command:', function (docString: string) {
	state.command = parseJson(docString);
});

Given('the gateway raw response:', function (docString: string) {
	state.rawResponse = parseJson(docString);
});

Given('a GatewayClient service response:', function (docString: string) {
	state.serviceResponse = parseJson(docString);
});

Given('the gateway result:', function (docString: string) {
	state.result = parseJson(docString);
});

When('I build the gateway request for {string}', function (gatewayUrl: string) {
	state.request = buildGatewayRequest(gatewayUrl as never, state.command);
});

When('I decode the gateway operation', function () {
	const decoded = decodeGatewayOperation(state.resource!, state.operation!);
	if (Either.isRight(decoded)) {
		state.result = decoded.right;
		state.error = undefined;
		return;
	}

	state.result = undefined;
	state.error = decoded.left;
});

When('I decode the gateway command', async function () {
	try {
		state.result = await Effect.runPromise(decodeGatewayCommand(state.context as never, 0));
		state.error = undefined;
	} catch (error) {
		state.result = undefined;
		state.error = error;
	}
});

When('I decode the gateway response', function () {
	const decoded = decodeGatewayResponse(state.command, state.rawResponse);
	if (Either.isRight(decoded)) {
		state.result = decoded.right;
		state.error = undefined;
		return;
	}

	state.result = undefined;
	state.error = decoded.left;
});

When('I read gateway input', async function () {
	state.result = await Effect.runPromise(
		readGatewayInput(state.context as never, 0, state.typedOperation),
	);
});

When('I execute the gateway request through the service', async function () {
	state.result = await Effect.runPromise(
		Effect.provideService(executeGatewayRequest(state.request), GatewayClient, {
			execute: (request) => {
				state.capturedRequest = request;
				return Effect.succeed(state.serviceResponse);
			},
		}),
	);
});

When('I execute the gateway request through the live layer', async function () {
	const calls: Array<{ credentialName: string; request: unknown; self: unknown }> = [];
	const context = {
		helpers: {
			httpRequestWithAuthentication(this: unknown, credentialName: string, request: unknown) {
				calls.push({ credentialName, request, self: this });
				return Promise.resolve({ ok: true });
			},
		},
	};

	state.result = await Effect.runPromise(
		Effect.provide(executeGatewayRequest(state.request), makeGatewayClientLayer(context as never)),
	);
	state.liveCall = {
		credentialName: calls[0].credentialName,
		request: calls[0].request,
	};
});

When('I serialize the gateway result', function () {
	state.result = gatewayResultToJsonItems(state.result);
});

Then('the built gateway request should equal:', function (docString: string) {
	assert.deepEqual(state.request, parseJson(docString));
});

Then('the decoded gateway operation should equal:', function (docString: string) {
	assert.deepEqual(state.result, parseJson(docString));
});

Then('the gateway operation error should equal:', function (docString: string) {
	assert.deepEqual(state.error, parseJson(docString));
});

Then('the decoded gateway command should equal:', function (docString: string) {
	assert.deepEqual(state.result, parseJson(docString));
});

Then('the gateway command error should match {string}', function (text: string) {
	assert.match(String(state.error), new RegExp(text));
});

Then('the decoded gateway response should equal:', function (docString: string) {
	assert.deepEqual(state.result, parseJson(docString));
});

Then('the gateway response error should match {string}', function (text: string) {
	assert.match(String(state.error?._tag ?? state.error), new RegExp(text));
});

Then('the read gateway input should equal:', function (docString: string) {
	assert.deepEqual(state.result, parseJson(docString));
});

Then('the executed gateway response should equal:', function (docString: string) {
	assert.deepEqual(state.result, parseJson(docString));
});

Then('the executed gateway request should equal:', function (docString: string) {
	assert.deepEqual(state.capturedRequest, parseJson(docString));
});

Then('the live gateway call should equal:', function (docString: string) {
	assert.deepEqual(state.liveCall, parseJson(docString));
});

Then('the serialized gateway items should equal:', function (docString: string) {
	assert.deepEqual(state.result, parseJson(docString));
});
