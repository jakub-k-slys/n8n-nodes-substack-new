import { Either, Match } from 'effect';
import type { IExecuteFunctions } from 'n8n-workflow';

import type { PostCommand } from '../../domain/command';
import type { GatewayError } from '../../domain/error';
import { PostIdInputSchema } from '../../schema';
import { decodeInput } from './shared';

export const decodePostCommand = (
	context: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): Either.Either<PostCommand | undefined, GatewayError> =>
	Match.value(operation).pipe(
		Match.when('getPost', () =>
			Either.map(
				decodeInput(PostIdInputSchema, {
					postId: context.getNodeParameter('postId', itemIndex),
				}),
				(input) => ({ _tag: 'Get', ...input }) as const,
			),
		),
		Match.when('getPostComments', () =>
			Either.map(
				decodeInput(PostIdInputSchema, {
					postId: context.getNodeParameter('postId', itemIndex),
				}),
				(input) => ({ _tag: 'GetComments', ...input }) as const,
			),
		),
		Match.orElse(() => Either.right(undefined)),
	);
