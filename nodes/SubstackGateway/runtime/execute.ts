import { Effect, Layer, Match } from 'effect';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import type { GatewayUrl } from '../schema';
import { makeGatewayClientLayer } from './live/gateway-client';
import { makeNodeInputLayer } from './live/node-input';
import { NodeInput } from './node-input';
import { toNodeExecutionData } from './to-node-data';
import {
	executeDraftOperation,
	executeNoteOperation,
	executeOwnPublicationOperation,
	executePostOperation,
	executeProfileOperation,
} from './resources';

export const runGatewayOperation = (
	context: IExecuteFunctions,
	itemIndex: number,
	gatewayUrl: GatewayUrl,
): Promise<INodeExecutionData[]> =>
	Effect.runPromise(
		Effect.provide(
			Effect.flatMap(NodeInput, (nodeInput) => nodeInput.getSelection).pipe(
				Effect.flatMap((selection) =>
					Match.value(selection).pipe(
						Match.when({ _tag: 'OwnPublication' }, ({ operation }) =>
							executeOwnPublicationOperation(itemIndex, gatewayUrl, operation),
						),
						Match.when({ _tag: 'Note' }, ({ operation }) =>
							executeNoteOperation(itemIndex, gatewayUrl, operation),
						),
						Match.when({ _tag: 'Draft' }, ({ operation }) =>
							executeDraftOperation(itemIndex, gatewayUrl, operation),
						),
						Match.when({ _tag: 'Post' }, ({ operation }) =>
							executePostOperation(itemIndex, gatewayUrl, operation),
						),
						Match.when({ _tag: 'Profile' }, ({ operation }) =>
							executeProfileOperation(itemIndex, gatewayUrl, operation),
						),
						Match.exhaustive,
					),
				),
				Effect.map((result) => toNodeExecutionData(itemIndex, result)),
				Effect.tapError((error) =>
					Effect.logError('Gateway operation failed').pipe(
						Effect.annotateLogs({
							itemIndex,
							errorTag: error._tag,
						}),
					),
				),
			),
			Layer.merge(makeNodeInputLayer(context, itemIndex), makeGatewayClientLayer(context)),
		),
	);
