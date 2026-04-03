import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Effect } from 'effect';

import { readGatewayInput, readGatewaySelection } from '../dist/nodes/SubstackGateway/runtime/read-input.js';

type TestContext = {
	getNodeParameter: (name: string, itemIndex?: number, fallback?: unknown) => unknown;
};

const createContext = (parameters: Record<string, unknown>): TestContext => ({
	getNodeParameter: (name, _itemIndex, fallback) => (name in parameters ? parameters[name] : fallback),
});

describe('readGatewayInput', () => {
	it('should read resource and operation as strings', async () => {
		const selection = await Effect.runPromise(
			readGatewaySelection(
				createContext({
					resource: 'draft',
					operation: 'createDraft',
				}) as never,
				0,
			),
		);

		assert.deepEqual(selection, {
			resource: 'draft',
			operation: 'createDraft',
		});
	});

	it('should read typed note creation input', async () => {
		const input = await Effect.runPromise(
			readGatewayInput(
				createContext({
					content: 'hello',
					attachment: 'https://example.com/file.png',
				}) as never,
				0,
				{
					_tag: 'Note',
					operation: 'createNote',
				},
			),
		);

		assert.deepEqual(input, {
			_tag: 'createNote',
			content: 'hello',
			attachment: 'https://example.com/file.png',
		});
	});

	it('should normalize blank optional strings', async () => {
		const input = await Effect.runPromise(
			readGatewayInput(
				createContext({
					profileSlug: 'substack',
					cursor: '   ',
				}) as never,
				0,
				{
					_tag: 'Profile',
					operation: 'getProfileNotes',
				},
			),
		);

		assert.deepEqual(input, {
			_tag: 'getProfileNotes',
			profileSlug: 'substack',
		});
	});
});
