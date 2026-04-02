import type { OwnPublicationCommand } from '../../domain/command';
import type { GatewayResult } from '../../domain/result';
import {
	OwnFollowingResponseSchema,
	OwnNotesResponseSchema,
	OwnPostsResponseSchema,
	OwnProfileResponseSchema,
} from '../../schema';
import { decodeResponseSchema, manyResult, singleResult } from './shared';

export const decodeOwnPublicationResponse = (
	command: OwnPublicationCommand,
	response: unknown,
): GatewayResult => {
	switch (command._tag) {
		case 'OwnProfile':
			return singleResult(decodeResponseSchema(OwnProfileResponseSchema, response));
		case 'OwnNotes':
			return manyResult(decodeResponseSchema(OwnNotesResponseSchema, response).items);
		case 'OwnPosts':
			return manyResult(decodeResponseSchema(OwnPostsResponseSchema, response).items);
		case 'OwnFollowing':
			return manyResult(decodeResponseSchema(OwnFollowingResponseSchema, response).items);
	}
};
