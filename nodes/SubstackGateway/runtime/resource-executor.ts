import * as HttpClient from '@effect/platform/HttpClient';
import { Either, Effect } from 'effect';

import type { GatewayError } from '../domain/error';
import type { GatewayHttpRequest } from '../domain/http';
import type { GatewayOperation, GatewayResource } from '../domain/operation';
import type { GatewayResult } from '../domain/result';
import type { GatewayUrl } from '../schema';
import { decodeGatewayOperation } from './decode-operation';
import { executeGatewayRequest } from './execute-request';
import { NodeInput, type NodeInput as NodeInputService } from './node-input';

export const fromEither = <A>(
	result: Either.Either<A, GatewayError>,
): Effect.Effect<A, GatewayError> =>
	Either.isRight(result) ? Effect.succeed(result.right) : Effect.fail(result.left);

export const decodeTaggedOperation = <Operation extends string>(
	resource: GatewayResource,
	tag: GatewayOperation['_tag'],
	operation: string,
): Effect.Effect<Operation, GatewayError> =>
	Effect.flatMap(fromEither(decodeGatewayOperation(resource, operation)), (decoded) =>
		decoded._tag === tag
			? Effect.succeed(decoded.operation as Operation)
			: Effect.fail({
					_tag: 'UnsupportedOperation',
					resource,
					operation,
				} satisfies GatewayError),
	);

type ResourceExecutorConfig<Operation, Input, Command extends { readonly _tag: string }> = {
	readonly itemIndex: number;
	readonly gatewayUrl: GatewayUrl;
	readonly operation: string;
	readonly logLabel: string;
	readonly decodeOperation: (operation: string) => Effect.Effect<Operation, GatewayError>;
	readonly readInput: (
		nodeInput: NodeInputService,
		operation: Operation,
	) => Effect.Effect<Input, GatewayError>;
	readonly decodeCommand: (input: Input) => Effect.Effect<Command, GatewayError>;
	readonly buildRequest: (gatewayUrl: GatewayUrl, command: Command) => GatewayHttpRequest;
	readonly decodeResponse: (
		command: Command,
		rawResponse: unknown,
	) => Effect.Effect<GatewayResult, GatewayError>;
};

export const executeResourceOperation = <Operation, Input, Command extends { readonly _tag: string }>({
	itemIndex,
	gatewayUrl,
	operation,
	logLabel,
	decodeOperation,
	readInput,
	decodeCommand,
	buildRequest,
	decodeResponse,
}: ResourceExecutorConfig<Operation, Input, Command>): Effect.Effect<
	GatewayResult,
	GatewayError,
	HttpClient.HttpClient | NodeInput
> =>
	decodeOperation(operation).pipe(
		Effect.bindTo('typedOperation'),
		Effect.bind('nodeInput', () => NodeInput),
		Effect.bind('input', ({ nodeInput, typedOperation }) => readInput(nodeInput, typedOperation)),
		Effect.bind('command', ({ input }) => decodeCommand(input)),
		Effect.tap(({ command }) =>
			Effect.logDebug(`Decoded ${logLabel} command`).pipe(
				Effect.annotateLogs({
					itemIndex,
					operation: command._tag,
				}),
			),
		),
		Effect.bind('request', ({ command }) => Effect.succeed(buildRequest(gatewayUrl, command))),
		Effect.tap(({ request }) =>
			Effect.logDebug(`Built ${logLabel} request`).pipe(
				Effect.annotateLogs({
					itemIndex,
					method: request.method,
					url: request.url,
				}),
			),
		),
		Effect.bind('rawResponse', ({ request }) => executeGatewayRequest(request)),
		Effect.bind('result', ({ command, rawResponse }) => decodeResponse(command, rawResponse)),
		Effect.tap(({ result }) =>
			Effect.logDebug(`Decoded ${logLabel} response`).pipe(
				Effect.annotateLogs({
					itemIndex,
					resultType: result.result._tag,
				}),
			),
		),
		Effect.map(({ result }) => result),
	);
