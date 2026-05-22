import type {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
} from 'n8n-workflow';
import { Effect, Either } from 'effect';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import {
	executeAuthenticatedGatewayRequest,
	toGatewayApiBaseUrl,
} from '../shared/gateway-transport';
import {
	BatchFeedRegistrationSchema,
	BatchFeedSubscriptionsSchema,
	GatewayUrlSchema,
} from '../SubstackGateway/schema';
import { decodeInput } from '../SubstackGateway/runtime/decode/shared';
import { requireGatewayFeature } from '../SubstackGateway/runtime/live/gateway-capabilities';
import {
	fetchAtomFeed,
	parseAtomFeed,
	readAtomFeedCheckpoint,
	selectNewAtomFeedEntries,
	toNodeExecutionData,
	writeAtomFeedCheckpoint,
} from '../shared/atom-feed';
import { canonicalizeSubscriptions, hashSubscriptions } from './subscriptions';

const BATCH_FEED_REGISTER_PATH = '/feeds';
const BATCH_FEED_FEATURE = 'api:feeds:batch';
const BATCH_FEED_STATE_KEY = 'batchFeedRegistration';
const DEFAULT_MAXIMUM_ENTITY_COUNT = 10000;
const DEFAULT_REQUEST_TIMEOUT_SECONDS = 15 * 60;
const MILLISECONDS_PER_SECOND = 1000;

const getRegisterUrl = (gatewayApiUrl: string): string =>
	`${gatewayApiUrl}${BATCH_FEED_REGISTER_PATH}`;
const getAtomUrl = (gatewayApiUrl: string, uuid: string): string =>
	`${gatewayApiUrl}${BATCH_FEED_REGISTER_PATH}/${encodeURIComponent(uuid)}/atom`;

type BatchFeedOptions = {
	readonly maximumEntityCount?: number;
	readonly requestTimeoutSeconds?: number;
};

type SubscriptionEntry = {
	readonly handle?: string;
};

type SubscriptionsCollection = {
	readonly subscription?: SubscriptionEntry[];
};

type BatchFeedState = {
	readonly hash: string;
	readonly uuid: string;
};

const readBatchFeedState = (staticData: IDataObject): BatchFeedState | undefined => {
	const stored = staticData[BATCH_FEED_STATE_KEY];

	if (
		typeof stored !== 'object' ||
		stored === null ||
		typeof (stored as IDataObject).hash !== 'string' ||
		typeof (stored as IDataObject).uuid !== 'string'
	) {
		return undefined;
	}

	const candidate = stored as { hash: string; uuid: string };

	return { hash: candidate.hash, uuid: candidate.uuid };
};

const writeBatchFeedState = (staticData: IDataObject, state: BatchFeedState): void => {
	staticData[BATCH_FEED_STATE_KEY] = { hash: state.hash, uuid: state.uuid };
};

const clearAtomCheckpoint = (staticData: IDataObject): void => {
	delete staticData.atomFeedLatestTimestamp;
	delete staticData.atomFeedLatestIds;
};

export class BatchFeed implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Substack Gateway Batch Feed',
		name: 'substackGatewayBatchFeed',
		icon: {
			light: 'file:../SubstackGateway/substackGateway.svg',
			dark: 'file:../SubstackGateway/substackGateway.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		description:
			'Poll a Substack Gateway batch Atom feed registered for an explicit list of profiles',
		defaults: {
			name: 'Substack Gateway Batch Feed',
		},
		usableAsTool: true,
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'substackGatewayApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Subscriptions',
				name: 'subscriptions',
				placeholder: 'Add Subscription',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
					sortable: true,
				},
				default: {},
				description: 'Substack profile handles to include in the batch feed',
				options: [
					{
						name: 'subscription',
						displayName: 'Subscription',
						values: [
							{
								displayName: 'Handle',
								name: 'handle',
								type: 'string',
								required: true,
								default: '',
								description: 'Substack profile handle to follow in this batch feed',
							},
						],
					},
				],
			},
			{
				displayName: 'Emit Only New Items',
				name: 'emitOnlyNewItems',
				type: 'boolean',
				default: true,
				description:
					'Whether to skip the existing feed items on the first poll and emit only items discovered later',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Maximum Entity Count',
						name: 'maximumEntityCount',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: DEFAULT_MAXIMUM_ENTITY_COUNT,
						description: 'Maximum number of XML entities to process while parsing the feed',
					},
					{
						displayName: 'Request Timeout',
						name: 'requestTimeoutSeconds',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: DEFAULT_REQUEST_TIMEOUT_SECONDS,
						description: 'Request timeout in seconds',
					},
				],
			},
		],
	};

	poll = async function (
		this: IPollFunctions,
	): Promise<INodeExecutionData[][] | null> {
		const credentials = await this.getCredentials('substackGatewayApi');
		const decodedGatewayUrl = decodeInput(
			GatewayUrlSchema,
			toGatewayApiBaseUrl(String(credentials.gatewayUrl ?? '')),
		);

		if (Either.isLeft(decodedGatewayUrl)) {
			throw new NodeOperationError(this.getNode(), 'Invalid Gateway URL credential');
		}

		const gatewayApiUrl = decodedGatewayUrl.right;

		await requireGatewayFeature(
			this,
			this.getNode(),
			gatewayApiUrl,
			BATCH_FEED_FEATURE,
			'Batch Feed',
		);

		const subscriptionsParam = this.getNodeParameter('subscriptions') as SubscriptionsCollection;
		const rawHandles = (subscriptionsParam.subscription ?? []).map((entry) =>
			String(entry.handle ?? ''),
		);
		const canonicalSubscriptions = canonicalizeSubscriptions(rawHandles);

		if (canonicalSubscriptions.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'At least one subscription handle is required',
			);
		}

		const decodedSubscriptions = decodeInput(BatchFeedSubscriptionsSchema, {
			subscriptions: canonicalSubscriptions,
		});

		if (Either.isLeft(decodedSubscriptions)) {
			throw new NodeOperationError(this.getNode(), 'Invalid subscription handles');
		}

		const emitOnlyNewItems = this.getNodeParameter('emitOnlyNewItems') as boolean;
		const options = this.getNodeParameter('options') as BatchFeedOptions;
		const maximumEntityCount = options.maximumEntityCount ?? DEFAULT_MAXIMUM_ENTITY_COUNT;
		const requestTimeoutSeconds =
			options.requestTimeoutSeconds ?? DEFAULT_REQUEST_TIMEOUT_SECONDS;

		const pollState = this.getWorkflowStaticData('node');
		const subscriptionsHash = hashSubscriptions(canonicalSubscriptions);
		const cachedRegistration = readBatchFeedState(pollState);

		let uuid: string;

		if (cachedRegistration !== undefined && cachedRegistration.hash === subscriptionsHash) {
			uuid = cachedRegistration.uuid;
		} else {
			const registrationResponse = await Effect.runPromise(
				executeAuthenticatedGatewayRequest(this, {
					method: 'PUT',
					url: getRegisterUrl(gatewayApiUrl),
					json: true,
					body: decodedSubscriptions.right,
				}),
			);

			const decodedRegistration = decodeInput(
				BatchFeedRegistrationSchema,
				registrationResponse,
			);

			if (Either.isLeft(decodedRegistration)) {
				throw new NodeOperationError(
					this.getNode(),
					'Invalid batch feed registration response',
				);
			}

			uuid = decodedRegistration.right.uuid;
			clearAtomCheckpoint(pollState);
			writeBatchFeedState(pollState, { hash: subscriptionsHash, uuid });
		}

		const data = await Effect.runPromise(
			Effect.flatMap(
				fetchAtomFeed(this, getAtomUrl(gatewayApiUrl, uuid), {
					timeoutMs: requestTimeoutSeconds * MILLISECONDS_PER_SECOND,
				}),
				(xml) => parseAtomFeed(xml, { maxEntityCount: maximumEntityCount }),
			),
		);

		if (this.getMode() === 'manual') {
			const items = toNodeExecutionData(data.entries);

			return items.length === 0 ? null : [items];
		}

		const nextState = selectNewAtomFeedEntries({
			entries: data.entries,
			checkpoint: readAtomFeedCheckpoint(pollState),
			emitOnlyNewItems,
		});

		if (nextState.checkpoint !== undefined) {
			writeAtomFeedCheckpoint(pollState, nextState.checkpoint);
		}

		const items = toNodeExecutionData(nextState.entries);

		return items.length === 0 ? null : [items];
	};
}
