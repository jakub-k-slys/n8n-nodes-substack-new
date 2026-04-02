import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const { Effect } = require('effect');
const { decodeGatewayCommand } = require('../dist/nodes/SubstackGateway/runtime/decode-command.js');

const createContext = (parameters) => ({
	getNodeParameter: (name) => parameters[name],
});

test('decodeGatewayCommand decodes note create parameters', async () => {
	const command = await Effect.runPromise(
		decodeGatewayCommand(
			createContext({
				resource: 'note',
				operation: 'createNote',
				content: 'hello world',
				attachment: 'https://example.com/a.png',
			}),
			0,
		),
	);

	assert.deepEqual(command, {
		_tag: 'Note',
		command: {
			_tag: 'Create',
			content: 'hello world',
			attachment: 'https://example.com/a.png',
		},
	});
});

test('decodeGatewayCommand fails on invalid note id', async () => {
	await assert.rejects(
		() =>
			Effect.runPromise(
				decodeGatewayCommand(
					createContext({
						resource: 'note',
						operation: 'getNote',
						noteId: 0,
					}),
					0,
				),
			),
		(error) => {
			assert.match(String(error), /ParameterDecodeError/);
			return true;
		},
	);
});
