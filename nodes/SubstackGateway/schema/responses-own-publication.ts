import * as Schema from 'effect/Schema';

import {
	FollowingUserResponseSchema,
	NoteResponseSchema,
	PostResponseSchema,
	ProfileResponseSchema,
} from './common';

export const OwnProfileResponseSchema = ProfileResponseSchema;

export const OwnNotesResponseSchema = Schema.Struct({
	items: Schema.Array(NoteResponseSchema),
	next_cursor: Schema.optional(Schema.NullOr(Schema.String)),
});

export const OwnPostsResponseSchema = Schema.Struct({
	items: Schema.Array(PostResponseSchema),
	next_cursor: Schema.optional(Schema.NullOr(Schema.String)),
});

export const OwnFollowingResponseSchema = Schema.Struct({
	items: Schema.Array(FollowingUserResponseSchema),
});
