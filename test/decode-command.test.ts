import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Effect } from 'effect';

import { decodeGatewayCommand } from '../dist/nodes/SubstackGateway/runtime/decode-command.js';

type TestContext = {
	getNodeParameter: (name: string) => unknown;
};

const createContext = (parameters: Record<string, unknown>): TestContext => ({
	getNodeParameter: (name) => parameters[name],
});

describe('decodeGatewayCommand', () => {
	it('should decode note create parameters', async () => {
		const command = await Effect.runPromise(
			decodeGatewayCommand(
				createContext({
					resource: 'note',
					operation: 'createNote',
					content: 'hello world',
					attachment: 'https://example.com/a.png',
				}) as never,
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

	it('should fail on invalid note id', async () => {
		await assert.rejects(
			() =>
				Effect.runPromise(
					decodeGatewayCommand(
						createContext({
							resource: 'note',
							operation: 'getNote',
							noteId: 0,
						}) as never,
						0,
					),
				),
			(error) => {
				assert.match(String(error), /ParameterDecodeError/);
				return true;
			},
		);
	});
});
