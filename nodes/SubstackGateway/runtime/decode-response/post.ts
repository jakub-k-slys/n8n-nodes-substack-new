import { Either } from 'effect';
import type { PostCommand } from '../../domain/command';
import type { GatewayError } from '../../domain/error';
import type { GatewayResult } from '../../domain/result';
import { PostCommentsResponseSchema, PostGetResponseSchema } from '../../schema';
import { toGatewayComment, toGatewayPost } from './map';
import { decodeResponseSchema } from './shared';

export const decodePostResponse = (
	command: PostCommand,
	response: unknown,
): Either.Either<GatewayResult, GatewayError> => {
	switch (command._tag) {
		case 'Get':
			return Either.map(decodeResponseSchema(PostGetResponseSchema, response), (item) => ({
				_tag: 'Post',
				result: { _tag: 'Fetched', item: toGatewayPost(item) },
			}));
		case 'GetComments':
			return Either.map(
				decodeResponseSchema(PostCommentsResponseSchema, response),
				({ items }) => ({
					_tag: 'Post',
					result: { _tag: 'Comments', items: items.map(toGatewayComment) },
				}),
			);
	}
};
