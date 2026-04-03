import * as HttpClient from '@effect/platform/HttpClient';
import { Either, Effect } from 'effect';

import type { GatewayError } from '../../../domain/error';
import type { OwnPublicationOperation } from '../../../domain/operation';
import type { GatewayResult } from '../../../domain/result';
import type { GatewayUrl } from '../../../schema';
import { decodeGatewayOperation } from '../../decode-operation';
import { executeGatewayRequest } from '../../execute-request';
import { NodeInput } from '../../node-input';
import { buildOwnPublicationRequest } from './build';
import { decodeOwnPublicationCommand } from './decode';
import { decodeOwnPublicationResponse } from './decode-response';

const fromEither = <A>(result: Either.Either<A, GatewayError>): Effect.Effect<A, GatewayError> =>
	Either.isRight(result) ? Effect.succeed(result.right) : Effect.fail(result.left);

const decodeOwnPublicationOperation = (
	operation: string,
): Effect.Effect<OwnPublicationOperation, GatewayError> =>
	Effect.flatMap(fromEither(decodeGatewayOperation('ownPublication', operation)), (decoded) =>
		decoded._tag === 'OwnPublication'
			? Effect.succeed(decoded.operation)
			: Effect.fail({
					_tag: 'UnsupportedOperation',
					resource: 'ownPublication',
					operation,
				} satisfies GatewayError),
	);

export const executeOwnPublicationOperation = (
	itemIndex: number,
	gatewayUrl: GatewayUrl,
	operation: string,
): Effect.Effect<GatewayResult, GatewayError, HttpClient.HttpClient | NodeInput> =>
	decodeOwnPublicationOperation(operation).pipe(
		Effect.bindTo('ownPublicationOperation'),
		Effect.bind('nodeInput', () => NodeInput),
		Effect.bind('input', ({ nodeInput, ownPublicationOperation }) =>
			nodeInput.getOwnPublicationInput({
				_tag: 'OwnPublication',
				operation: ownPublicationOperation,
			}),
		),
		Effect.bind('command', ({ input }) => Effect.succeed(decodeOwnPublicationCommand(input))),
		Effect.tap(({ command }) =>
			Effect.logDebug('Decoded own publication command').pipe(
			Effect.annotateLogs({
				itemIndex,
				operation: command._tag,
			}),
			),
		),
		Effect.bind('request', ({ command }) =>
			Effect.succeed(buildOwnPublicationRequest(gatewayUrl, command)),
		),
		Effect.tap(({ command, request }) =>
			Effect.logDebug('Built own publication request').pipe(
			Effect.annotateLogs({
				itemIndex,
				operation: command._tag,
				method: request.method,
				url: request.url,
			}),
			),
		),
		Effect.bind('rawResponse', ({ request }) => executeGatewayRequest(request)),
		Effect.bind('result', ({ command, rawResponse }) =>
			fromEither(decodeOwnPublicationResponse(command, rawResponse)),
		),
		Effect.tap(({ result }) =>
			Effect.logDebug('Decoded own publication response').pipe(
			Effect.annotateLogs({
				itemIndex,
				resultType: result.result._tag,
			}),
			),
		),
		Effect.map(({ result }) => result),
	);
