import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	getAvailableOperations,
	getAvailableResources,
	buildGatewayOperation,
	getOperationDescription,
	getRequiredFeatureForOperation,
	getStaticDiscoveryOperations,
	getStaticDiscoveryResources,
} from '../nodes/SubstackGateway/domain/operation.ts';
import {
	GatewayCapabilitiesSchema,
	describeGatewayModules,
	getGatewayFeatures,
} from '../nodes/SubstackGateway/schema/index.ts';
import { Schema } from 'effect';

describe('gateway capabilities metadata', () => {
	it('should not require a feature for OSS-supported operations', () => {
		assert.equal(
			getRequiredFeatureForOperation(buildGatewayOperation('note', 'createNote')),
			undefined,
		);
	});

	it('should require a feature for gated operations', () => {
		assert.equal(
			getRequiredFeatureForOperation(buildGatewayOperation('draft', 'createDraft')),
			'api:drafts:create',
		);
	});

	it('should annotate gated operations in the editor description', () => {
		assert.equal(
			getOperationDescription('post', 'likePost'),
			'Add a heart like to a Substack post by its ID. Requires gateway feature support and is not available in OSS',
		);
	});

	it('should hide resources without any available operations', () => {
		assert.deepEqual(
			getAvailableResources([
				'api:me:get',
				'api:me:notes:list',
				'api:me:posts:list',
				'api:me:following:list',
				'api:notes:create',
				'api:notes:delete',
				'api:notes:get',
				'api:posts:get',
				'api:posts:comments:list',
				'api:profiles:get',
				'api:profiles:notes:list',
				'api:profiles:posts:list',
			]).map((resource) => resource.resource),
			['note', 'ownPublication', 'post', 'profile'],
		);
	});

	it('should hide gated operations that are not available', () => {
		assert.deepEqual(
			getAvailableOperations('post', ['api:posts:get', 'api:posts:comments:list']).map(
				(operation) => operation.value,
			),
			['getPost', 'getPostComments'],
		);
	});

	it('should keep only OSS-safe resources in static discovery metadata', () => {
		assert.deepEqual(
			getStaticDiscoveryResources().map((resource) => resource.resource),
			['note', 'ownPublication', 'post', 'profile'],
		);
	});

	it('should keep only OSS-safe operations in static discovery metadata', () => {
		assert.deepEqual(
			getStaticDiscoveryOperations('note').map((operation) => operation.value),
			['createNote', 'deleteNote', 'getNote'],
		);
	});

	it('should decode module-based capability responses and flatten their features', async () => {
		const decoded = await Schema.decodeUnknownPromise(GatewayCapabilitiesSchema)({
			application: 'substack-gateway',
			modules: [
				{
					name: 'gateway-oss',
					version: '3.0.0',
					features: ['api:notes:create', 'api:profiles:get'],
				},
				{
					name: 'gateway-pro',
					version: '2.0.1',
					features: ['api:me:following:feed', 'api:profiles:feed'],
				},
			],
		});

		assert.deepEqual(getGatewayFeatures(decoded), [
			'api:notes:create',
			'api:profiles:get',
			'api:me:following:feed',
			'api:profiles:feed',
		]);
		assert.equal(describeGatewayModules(decoded), 'gateway-oss@3.0.0, gateway-pro@2.0.1');
	});
});
