import * as HttpClient from '@effect/platform/HttpClient';
import { Effect } from 'effect';

import type { GatewayError } from '../../../domain/error';
import type { GatewayResult } from '../../../domain/result';
import type { GatewayUrl } from '../../../schema';
import { NodeInput } from '../../node-input';
import { decodeTaggedOperation, executeResourceOperation, fromEither } from '../../resource-executor';
import { buildOwnPublicationRequest } from './build';
import { decodeOwnPublicationCommand } from './decode';
import { decodeOwnPublicationResponse } from './decode-response';

export const executeOwnPublicationOperation = (
	itemIndex: number,
	gatewayUrl: GatewayUrl,
	operation: string,
): Effect.Effect<GatewayResult, GatewayError, HttpClient.HttpClient | NodeInput> =>
	executeResourceOperation({
		itemIndex,
		gatewayUrl,
		operation,
		logLabel: 'own publication',
		decodeOperation: (operation) =>
			decodeTaggedOperation<'ownProfile' | 'ownNotes' | 'ownPosts' | 'ownFollowing'>(
				'ownPublication',
				'OwnPublication',
				operation,
			),
		readInput: (nodeInput, operation) =>
			nodeInput.getOwnPublicationInput({
				_tag: 'OwnPublication',
				operation,
			}),
		decodeCommand: (input) => Effect.succeed(decodeOwnPublicationCommand(input)),
		buildRequest: buildOwnPublicationRequest,
		decodeResponse: (command, rawResponse) =>
			fromEither(decodeOwnPublicationResponse(command, rawResponse)),
	});
