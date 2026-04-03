import * as HttpClient from '@effect/platform/HttpClient';
import { Either, Effect } from 'effect';

import type { GatewayError } from '../../../domain/error';
import type { DraftOperation } from '../../../domain/operation';
import type { GatewayResult } from '../../../domain/result';
import type { GatewayUrl } from '../../../schema';
import { decodeGatewayOperation } from '../../decode-operation';
import { executeGatewayRequest } from '../../execute-request';
import { NodeInput } from '../../node-input';
import { buildDraftRequest } from './build';
import { decodeDraftCommand } from './decode';
import { decodeDraftResponse } from './decode-response';

const fromEither = <A>(result: Either.Either<A, GatewayError>): Effect.Effect<A, GatewayError> =>
	Either.isRight(result) ? Effect.succeed(result.right) : Effect.fail(result.left);

const decodeDraftOperation = (operation: string): Effect.Effect<DraftOperation, GatewayError> =>
	Effect.flatMap(fromEither(decodeGatewayOperation('draft', operation)), (decoded) =>
		decoded._tag === 'Draft'
			? Effect.succeed(decoded.operation)
			: Effect.fail({
					_tag: 'UnsupportedOperation',
					resource: 'draft',
					operation,
				} satisfies GatewayError),
	);

export const executeDraftOperation = (
	itemIndex: number,
	gatewayUrl: GatewayUrl,
	operation: string,
): Effect.Effect<GatewayResult, GatewayError, HttpClient.HttpClient | NodeInput> =>
	decodeDraftOperation(operation).pipe(
		Effect.bindTo('draftOperation'),
		Effect.bind('nodeInput', () => NodeInput),
		Effect.bind('input', ({ nodeInput, draftOperation }) =>
			nodeInput.getDraftInput({
				_tag: 'Draft',
				operation: draftOperation,
			}),
		),
		Effect.bind('command', ({ input }) => fromEither(decodeDraftCommand(input))),
		Effect.tap(({ command }) =>
			Effect.logDebug('Decoded draft command').pipe(
			Effect.annotateLogs({
				itemIndex,
				operation: command._tag,
			}),
			),
		),
		Effect.bind('request', ({ command }) => Effect.succeed(buildDraftRequest(gatewayUrl, command))),
		Effect.tap(({ command, request }) =>
			Effect.logDebug('Built draft request').pipe(
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
			fromEither(decodeDraftResponse(command, rawResponse)),
		),
		Effect.tap(({ result }) =>
			Effect.logDebug('Decoded draft response').pipe(
			Effect.annotateLogs({
				itemIndex,
				resultType: result.result._tag,
			}),
			),
		),
		Effect.map(({ result }) => result),
	);
