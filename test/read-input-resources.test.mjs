import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const { Effect } = require('effect');
const { readDraftInput } = require('../dist/nodes/SubstackGateway/runtime/read-input/draft.js');
const { readNoteInput } = require('../dist/nodes/SubstackGateway/runtime/read-input/note.js');
const {
	readOwnPublicationInput,
} = require('../dist/nodes/SubstackGateway/runtime/read-input/own-publication.js');
const { readPostInput } = require('../dist/nodes/SubstackGateway/runtime/read-input/post.js');
const { readProfileInput } = require('../dist/nodes/SubstackGateway/runtime/read-input/profile.js');

const createContext = (parameters) => ({
	getNodeParameter: (name, _itemIndex, fallback) => (name in parameters ? parameters[name] : fallback),
});

test('readOwnPublicationInput returns a simple passthrough input', async () => {
	const input = await Effect.runPromise(
		readOwnPublicationInput(
			createContext({}),
			0,
			{ _tag: 'OwnPublication', operation: 'ownFollowing' },
		),
	);

	assert.deepEqual(input, { _tag: 'ownFollowing' });
});

test('readNoteInput reads getNote parameters', async () => {
	const input = await Effect.runPromise(
		readNoteInput(
			createContext({ noteId: 42 }),
			0,
			{ _tag: 'Note', operation: 'getNote' },
		),
	);

	assert.deepEqual(input, {
		_tag: 'getNote',
		noteId: 42,
	});
});

test('readDraftInput reads updateDraft payloads', async () => {
	const input = await Effect.runPromise(
		readDraftInput(
			createContext({
				draftId: 7,
				title: 'Hello',
				subtitle: '',
				body: 'World',
			}),
			0,
			{ _tag: 'Draft', operation: 'updateDraft' },
		),
	);

	assert.deepEqual(input, {
		_tag: 'updateDraft',
		draftId: 7,
		title: 'Hello',
		subtitle: null,
		body: 'World',
	});
});

test('readPostInput reads comment operations', async () => {
	const input = await Effect.runPromise(
		readPostInput(
			createContext({ postId: 99 }),
			0,
			{ _tag: 'Post', operation: 'getPostComments' },
		),
	);

	assert.deepEqual(input, {
		_tag: 'getPostComments',
		postId: 99,
	});
});

test('readProfileInput reads profile posts pagination', async () => {
	const input = await Effect.runPromise(
		readProfileInput(
			createContext({
				profileSlug: 'substack',
				limit: 10,
				offset: 20,
			}),
			0,
			{ _tag: 'Profile', operation: 'getProfilePosts' },
		),
	);

	assert.deepEqual(input, {
		_tag: 'getProfilePosts',
		profileSlug: 'substack',
		limit: 10,
		offset: 20,
	});
});
