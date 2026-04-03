import * as HttpClient from '@effect/platform/HttpClient';
import { Effect } from 'effect';

import type { GatewayError } from '../../../domain/error';
import type { GatewayResult } from '../../../domain/result';
import type { GatewayUrl } from '../../../schema';
import { NodeInput } from '../../node-input';
import { decodeTaggedOperation, executeResourceOperation, fromEither } from '../../resource-executor';
import { buildProfileRequest } from './build';
import { decodeProfileCommand } from './decode';
import { decodeProfileResponse } from './decode-response';

export const executeProfileOperation = (
	itemIndex: number,
	gatewayUrl: GatewayUrl,
	operation: string,
): Effect.Effect<GatewayResult, GatewayError, HttpClient.HttpClient | NodeInput> =>
	executeResourceOperation({
		itemIndex,
		gatewayUrl,
		operation,
		logLabel: 'profile',
		decodeOperation: (operation) =>
			decodeTaggedOperation<'getProfile' | 'getProfileNotes' | 'getProfilePosts'>(
				'profile',
				'Profile',
				operation,
			),
		readInput: (nodeInput, operation) =>
			nodeInput.getProfileInput({
				_tag: 'Profile',
				operation,
			}),
		decodeCommand: (input) => fromEither(decodeProfileCommand(input)),
		buildRequest: buildProfileRequest,
		decodeResponse: (command, rawResponse) =>
			fromEither(decodeProfileResponse(command, rawResponse)),
	});
