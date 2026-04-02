import * as Schema from 'effect/Schema';

import { NoteResponseSchema, PostResponseSchema, ProfileResponseSchema } from './common';

export const ProfileGetResponseSchema = ProfileResponseSchema;

export const ProfileNotesResponseSchema = Schema.Struct({
	items: Schema.Array(NoteResponseSchema),
	next_cursor: Schema.optional(Schema.NullOr(Schema.String)),
});

export const ProfilePostsResponseSchema = Schema.Struct({
	items: Schema.Array(PostResponseSchema),
	next_cursor: Schema.optional(Schema.NullOr(Schema.String)),
});
