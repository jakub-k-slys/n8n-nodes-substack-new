import { Either } from 'effect';
import type { IExecuteFunctions } from 'n8n-workflow';

import type { PostCommand } from '../../domain/command';
import type { GatewayError } from '../../domain/error';
import { PostIdInputSchema } from '../../schema';
import { decodeInput } from './shared';

export const decodePostCommand = (
	context: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): Either.Either<PostCommand | undefined, GatewayError> => {
	switch (operation) {
		case 'getPost':
			return Either.map(
				decodeInput(PostIdInputSchema, {
					postId: context.getNodeParameter('postId', itemIndex),
				}),
				(input) => ({ _tag: 'Get', ...input }) as const,
			);
		case 'getPostComments':
			return Either.map(
				decodeInput(PostIdInputSchema, {
					postId: context.getNodeParameter('postId', itemIndex),
				}),
				(input) => ({ _tag: 'GetComments', ...input }) as const,
			);
		default:
			return Either.right(undefined);
	}
};
