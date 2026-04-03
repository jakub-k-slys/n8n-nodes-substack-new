import * as HttpClient from '@effect/platform/HttpClient';
import { Either, Effect } from 'effect';

import type { GatewayError } from '../../../domain/error';
import type { PostOperation } from '../../../domain/operation';
import type { GatewayResult } from '../../../domain/result';
import type { GatewayUrl } from '../../../schema';
import { decodeGatewayOperation } from '../../decode-operation';
import { executeGatewayRequest } from '../../execute-request';
import { NodeInput } from '../../node-input';
import { buildPostRequest } from './build';
import { decodePostCommand } from './decode';
import { decodePostResponse } from './decode-response';

const fromEither = <A>(result: Either.Either<A, GatewayError>): Effect.Effect<A, GatewayError> =>
	Either.isRight(result) ? Effect.succeed(result.right) : Effect.fail(result.left);

const decodePostOperation = (operation: string): Effect.Effect<PostOperation, GatewayError> =>
	Effect.flatMap(fromEither(decodeGatewayOperation('post', operation)), (decoded) =>
		decoded._tag === 'Post'
			? Effect.succeed(decoded.operation)
			: Effect.fail({
					_tag: 'UnsupportedOperation',
					resource: 'post',
					operation,
				} satisfies GatewayError),
	);

export const executePostOperation = (
	itemIndex: number,
	gatewayUrl: GatewayUrl,
	operation: string,
): Effect.Effect<GatewayResult, GatewayError, HttpClient.HttpClient | NodeInput> =>
	decodePostOperation(operation).pipe(
		Effect.bindTo('postOperation'),
		Effect.bind('nodeInput', () => NodeInput),
		Effect.bind('input', ({ nodeInput, postOperation }) =>
			nodeInput.getPostInput({
				_tag: 'Post',
				operation: postOperation,
			}),
		),
		Effect.bind('command', ({ input }) => fromEither(decodePostCommand(input))),
		Effect.tap(({ command }) =>
			Effect.logDebug('Decoded post command').pipe(
			Effect.annotateLogs({
				itemIndex,
				operation: command._tag,
			}),
			),
		),
		Effect.bind('request', ({ command }) => Effect.succeed(buildPostRequest(gatewayUrl, command))),
		Effect.tap(({ command, request }) =>
			Effect.logDebug('Built post request').pipe(
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
			fromEither(decodePostResponse(command, rawResponse)),
		),
		Effect.tap(({ result }) =>
			Effect.logDebug('Decoded post response').pipe(
			Effect.annotateLogs({
				itemIndex,
				resultType: result.result._tag,
			}),
			),
		),
		Effect.map(({ result }) => result),
	);
