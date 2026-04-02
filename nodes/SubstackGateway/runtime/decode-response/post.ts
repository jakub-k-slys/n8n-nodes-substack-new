import type { PostCommand } from '../../domain/command';
import type { GatewayResult } from '../../domain/result';
import { PostCommentsResponseSchema, PostGetResponseSchema } from '../../schema';
import { decodeResponseSchema, manyResult, singleResult } from './shared';

export const decodePostResponse = (command: PostCommand, response: unknown): GatewayResult => {
	switch (command._tag) {
		case 'Get':
			return singleResult(decodeResponseSchema(PostGetResponseSchema, response));
		case 'GetComments':
			return manyResult(decodeResponseSchema(PostCommentsResponseSchema, response).items);
	}
};
