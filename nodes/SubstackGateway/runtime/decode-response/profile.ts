import type { GatewayResult } from '../../domain/result';
import type { ProfileCommand } from '../../domain/command';
import {
	ProfileGetResponseSchema,
	ProfileNotesResponseSchema,
	ProfilePostsResponseSchema,
} from '../../schema';
import { decodeResponseSchema, manyResult, singleResult } from './shared';

export const decodeProfileResponse = (
	command: ProfileCommand,
	response: unknown,
): GatewayResult => {
	switch (command._tag) {
		case 'Get':
			return singleResult(decodeResponseSchema(ProfileGetResponseSchema, response));
		case 'GetNotes':
			return manyResult(decodeResponseSchema(ProfileNotesResponseSchema, response).items);
		case 'GetPosts':
			return manyResult(decodeResponseSchema(ProfilePostsResponseSchema, response).items);
	}
};
