import { Either } from 'effect';
import type { OwnPublicationCommand } from '../../domain/command';
import type { GatewayError } from '../../domain/error';
import type { GatewayResult } from '../../domain/result';
import {
	OwnFollowingResponseSchema,
	OwnNotesResponseSchema,
	OwnPostsResponseSchema,
	OwnProfileResponseSchema,
} from '../../schema';
import {
	toGatewayFollowingUser,
	toGatewayNote,
	toGatewayPostSummary,
	toGatewayProfile,
} from './map';
import { decodeResponseSchema } from './shared';

export const decodeOwnPublicationResponse = (
	command: OwnPublicationCommand,
	response: unknown,
): Either.Either<GatewayResult, GatewayError> => {
	switch (command._tag) {
		case 'OwnProfile':
			return Either.map(decodeResponseSchema(OwnProfileResponseSchema, response), (item) => ({
				_tag: 'OwnPublication',
				result: { _tag: 'Profile', item: toGatewayProfile(item) },
			}));
		case 'OwnNotes':
			return Either.map(decodeResponseSchema(OwnNotesResponseSchema, response), ({ items }) => ({
				_tag: 'OwnPublication',
				result: { _tag: 'Notes', items: items.map(toGatewayNote) },
			}));
		case 'OwnPosts':
			return Either.map(decodeResponseSchema(OwnPostsResponseSchema, response), ({ items }) => ({
				_tag: 'OwnPublication',
				result: { _tag: 'Posts', items: items.map(toGatewayPostSummary) },
			}));
		case 'OwnFollowing':
			return Either.map(
				decodeResponseSchema(OwnFollowingResponseSchema, response),
				({ items }) => ({
					_tag: 'OwnPublication',
					result: { _tag: 'Following', items: items.map(toGatewayFollowingUser) },
				}),
			);
	}
};
