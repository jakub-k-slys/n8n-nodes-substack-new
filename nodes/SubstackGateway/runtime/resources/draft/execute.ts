import * as HttpClient from '@effect/platform/HttpClient';
import { Effect } from 'effect';

import type { GatewayError } from '../../../domain/error';
import type { GatewayResult } from '../../../domain/result';
import type { GatewayUrl } from '../../../schema';
import { NodeInput } from '../../node-input';
import { decodeTaggedOperation, executeResourceOperation, fromEither } from '../../resource-executor';
import { buildDraftRequest } from './build';
import { decodeDraftCommand } from './decode';
import { decodeDraftResponse } from './decode-response';

export const executeDraftOperation = (
	itemIndex: number,
	gatewayUrl: GatewayUrl,
	operation: string,
): Effect.Effect<GatewayResult, GatewayError, HttpClient.HttpClient | NodeInput> =>
	executeResourceOperation({
		itemIndex,
		gatewayUrl,
		operation,
		logLabel: 'draft',
		decodeOperation: (operation) =>
			decodeTaggedOperation<
				'listDrafts' | 'createDraft' | 'getDraft' | 'updateDraft' | 'deleteDraft'
			>('draft', 'Draft', operation),
		readInput: (nodeInput, operation) =>
			nodeInput.getDraftInput({
				_tag: 'Draft',
				operation,
			}),
		decodeCommand: (input) => fromEither(decodeDraftCommand(input)),
		buildRequest: buildDraftRequest,
		decodeResponse: (command, rawResponse) => fromEither(decodeDraftResponse(command, rawResponse)),
	});
