import * as HttpClient from '@effect/platform/HttpClient';
import { Either, Effect } from 'effect';

import type { GatewayError } from '../../../domain/error';
import type { NoteOperation } from '../../../domain/operation';
import type { GatewayResult } from '../../../domain/result';
import type { GatewayUrl } from '../../../schema';
import { decodeGatewayOperation } from '../../decode-operation';
import { executeGatewayRequest } from '../../execute-request';
import { NodeInput } from '../../node-input';
import { buildNoteRequest } from './build';
import { decodeNoteCommand } from './decode';
import { decodeNoteResponse } from './decode-response';

const fromEither = <A>(result: Either.Either<A, GatewayError>): Effect.Effect<A, GatewayError> =>
	Either.isRight(result) ? Effect.succeed(result.right) : Effect.fail(result.left);

const decodeNoteOperation = (operation: string): Effect.Effect<NoteOperation, GatewayError> =>
	Effect.flatMap(fromEither(decodeGatewayOperation('note', operation)), (decoded) =>
		decoded._tag === 'Note'
			? Effect.succeed(decoded.operation)
			: Effect.fail({
					_tag: 'UnsupportedOperation',
					resource: 'note',
					operation,
				} satisfies GatewayError),
	);

export const executeNoteOperation = (
	itemIndex: number,
	gatewayUrl: GatewayUrl,
	operation: string,
): Effect.Effect<GatewayResult, GatewayError, HttpClient.HttpClient | NodeInput> =>
	decodeNoteOperation(operation).pipe(
		Effect.bindTo('noteOperation'),
		Effect.bind('nodeInput', () => NodeInput),
		Effect.bind('input', ({ nodeInput, noteOperation }) =>
			nodeInput.getNoteInput({
				_tag: 'Note',
				operation: noteOperation,
			}),
		),
		Effect.bind('command', ({ input }) => fromEither(decodeNoteCommand(input))),
		Effect.tap(({ command }) =>
			Effect.logDebug('Decoded note command').pipe(
			Effect.annotateLogs({
				itemIndex,
				operation: command._tag,
			}),
			),
		),
		Effect.bind('request', ({ command }) => Effect.succeed(buildNoteRequest(gatewayUrl, command))),
		Effect.tap(({ command, request }) =>
			Effect.logDebug('Built note request').pipe(
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
			fromEither(decodeNoteResponse(command, rawResponse)),
		),
		Effect.tap(({ result }) =>
			Effect.logDebug('Decoded note response').pipe(
			Effect.annotateLogs({
				itemIndex,
				resultType: result.result._tag,
			}),
			),
		),
		Effect.map(({ result }) => result),
	);
