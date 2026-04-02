import { Either, Effect, Match } from 'effect';
import type { IExecuteFunctions } from 'n8n-workflow';

import type { GatewayCommand } from '../domain/command';
import type { GatewayError } from '../domain/error';
import { decodeDraftCommand } from './decode/draft';
import { decodeNoteCommand } from './decode/note';
import { decodeOwnPublicationCommand } from './decode/own-publication';
import { decodePostCommand } from './decode/post';
import { decodeProfileCommand } from './decode/profile';

export const decodeGatewayCommand = (
	context: IExecuteFunctions,
	itemIndex: number,
): Effect.Effect<GatewayCommand, GatewayError> =>
	Effect.try({
		try: () => ({
			resource: context.getNodeParameter('resource', itemIndex) as string,
			operation: context.getNodeParameter('operation', itemIndex) as string,
		}),
		catch: (cause) =>
			({
				_tag: 'UnexpectedError',
				message: cause instanceof Error ? cause.message : 'Unknown error',
				cause,
			}) satisfies GatewayError,
	}).pipe(
		Effect.flatMap(({ resource, operation }) => {
			const decoded: Either.Either<GatewayCommand | undefined, GatewayError> = Match.value(
				resource,
			).pipe(
				Match.when('ownPublication', () =>
					Either.map(decodeOwnPublicationCommand(operation), (command) =>
						command === undefined ? undefined : ({ _tag: 'OwnPublication', command } as const),
					),
				),
				Match.when('note', () =>
					Either.map(decodeNoteCommand(context, itemIndex, operation), (command) =>
						command === undefined ? undefined : ({ _tag: 'Note', command } as const),
					),
				),
				Match.when('draft', () =>
					Either.map(decodeDraftCommand(context, itemIndex, operation), (command) =>
						command === undefined ? undefined : ({ _tag: 'Draft', command } as const),
					),
				),
				Match.when('post', () =>
					Either.map(decodePostCommand(context, itemIndex, operation), (command) =>
						command === undefined ? undefined : ({ _tag: 'Post', command } as const),
					),
				),
				Match.when('profile', () =>
					Either.map(decodeProfileCommand(context, itemIndex, operation), (command) =>
						command === undefined ? undefined : ({ _tag: 'Profile', command } as const),
					),
				),
				Match.orElse(() => Either.right(undefined)),
			);

			return Either.flatMap(decoded, (command) =>
				command !== undefined
					? Either.right(command)
					: Either.left({
							_tag: 'UnsupportedOperation',
							resource,
							operation,
						} satisfies GatewayError),
			);
		}),
	);
