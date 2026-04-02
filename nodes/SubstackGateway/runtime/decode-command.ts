import { Either, Effect } from 'effect';
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
			const decoded: Either.Either<GatewayCommand | undefined, GatewayError> = (() => {
				switch (resource) {
					case 'ownPublication':
						return Either.map(decodeOwnPublicationCommand(operation), (command) =>
							command === undefined ? undefined : ({ _tag: 'OwnPublication', command } as const),
						);
					case 'note':
						return Either.map(decodeNoteCommand(context, itemIndex, operation), (command) =>
							command === undefined ? undefined : ({ _tag: 'Note', command } as const),
						);
					case 'draft':
						return Either.map(decodeDraftCommand(context, itemIndex, operation), (command) =>
							command === undefined ? undefined : ({ _tag: 'Draft', command } as const),
						);
					case 'post':
						return Either.map(decodePostCommand(context, itemIndex, operation), (command) =>
							command === undefined ? undefined : ({ _tag: 'Post', command } as const),
						);
					case 'profile':
						return Either.map(decodeProfileCommand(context, itemIndex, operation), (command) =>
							command === undefined ? undefined : ({ _tag: 'Profile', command } as const),
						);
					default:
						return Either.right(undefined);
				}
			})();

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
