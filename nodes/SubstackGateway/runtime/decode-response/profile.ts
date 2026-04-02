import { Either } from 'effect';
import type { GatewayResult } from '../../domain/result';
import type { GatewayError } from '../../domain/error';
import type { ProfileCommand } from '../../domain/command';
import {
	ProfileGetResponseSchema,
	ProfileNotesResponseSchema,
	ProfilePostsResponseSchema,
} from '../../schema';
import { decodeResponseSchema, manyItems, singleItem } from './shared';

export const decodeProfileResponse = (
	command: ProfileCommand,
	response: unknown,
): Either.Either<GatewayResult, GatewayError> => {
	switch (command._tag) {
		case 'Get':
			return Either.map(decodeResponseSchema(ProfileGetResponseSchema, response), (item) => ({
				_tag: 'Profile',
				result: { _tag: 'Fetched', item: singleItem(item) },
			}));
		case 'GetNotes':
			return Either.map(
				decodeResponseSchema(ProfileNotesResponseSchema, response),
				({ items }) => ({
					_tag: 'Profile',
					result: { _tag: 'Notes', items: manyItems(items) },
				}),
			);
		case 'GetPosts':
			return Either.map(
				decodeResponseSchema(ProfilePostsResponseSchema, response),
				({ items }) => ({
					_tag: 'Profile',
					result: { _tag: 'Posts', items: manyItems(items) },
				}),
			);
	}
};
