import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Schema } from 'effect';

import {
	canonicalizeSubscriptions,
	hashSubscriptions,
} from '../nodes/BatchFeed/subscriptions.ts';
import {
	BatchFeedRegistrationSchema,
	BatchFeedSubscriptionsSchema,
} from '../nodes/SubstackGateway/schema/index.ts';

describe('Batch feed subscriptions', () => {
	it('trims, deduplicates and sorts handles', () => {
		const result = canonicalizeSubscriptions([
			'  bob  ',
			'alice',
			'bob',
			'',
			'carol',
			'alice',
		]);

		assert.deepEqual(result, ['alice', 'bob', 'carol']);
	});

	it('produces the same hash for equivalent unordered lists', () => {
		const first = canonicalizeSubscriptions(['bob', 'alice', 'carol']);
		const second = canonicalizeSubscriptions(['carol', 'alice', 'alice', '  bob ']);

		assert.deepEqual(first, second);
		assert.equal(hashSubscriptions(first), hashSubscriptions(second));
	});

	it('produces a different hash when the set changes', () => {
		const first = canonicalizeSubscriptions(['alice', 'bob']);
		const second = canonicalizeSubscriptions(['alice', 'bob', 'dave']);

		assert.notEqual(hashSubscriptions(first), hashSubscriptions(second));
	});

	it('rejects empty subscription requests via the schema', () => {
		const decoded = Schema.decodeUnknownEither(BatchFeedSubscriptionsSchema)({
			subscriptions: [],
		});

		assert.equal(decoded._tag, 'Left');
	});

	it('accepts non-empty subscription requests via the schema', async () => {
		const decoded = await Schema.decodeUnknownPromise(BatchFeedSubscriptionsSchema)({
			subscriptions: ['alice', 'bob'],
		});

		assert.deepEqual(decoded.subscriptions, ['alice', 'bob']);
	});

	it('decodes a registration response carrying a uuid', async () => {
		const decoded = await Schema.decodeUnknownPromise(BatchFeedRegistrationSchema)({
			uuid: '7f9b2d24-1a8c-4f8a-91c1-9a9b1f6c8b35',
		});

		assert.equal(decoded.uuid, '7f9b2d24-1a8c-4f8a-91c1-9a9b1f6c8b35');
	});

	it('rejects registration responses without a uuid', () => {
		const decoded = Schema.decodeUnknownEither(BatchFeedRegistrationSchema)({});

		assert.equal(decoded._tag, 'Left');
	});
});
