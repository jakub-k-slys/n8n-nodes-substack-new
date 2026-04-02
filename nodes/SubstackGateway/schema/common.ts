import * as Schema from 'effect/Schema';

export const ProfileResponseSchema = Schema.Struct({
	id: Schema.Number,
	handle: Schema.String,
	name: Schema.String,
	url: Schema.String,
	avatar_url: Schema.String,
	bio: Schema.optional(Schema.NullOr(Schema.String)),
});

export const FollowingUserResponseSchema = Schema.Struct({
	id: Schema.Number,
	handle: Schema.String,
});

export const NoteAuthorSchema = Schema.Struct({
	id: Schema.Number,
	name: Schema.String,
	handle: Schema.String,
	avatar_url: Schema.String,
});

export const NoteResponseSchema = Schema.Struct({
	id: Schema.Number,
	body: Schema.String,
	likes_count: Schema.Number,
	author: NoteAuthorSchema,
	published_at: Schema.String,
});

export const PostResponseSchema = Schema.Struct({
	id: Schema.Number,
	title: Schema.String,
	subtitle: Schema.optional(Schema.NullOr(Schema.String)),
	truncated_body: Schema.optional(Schema.NullOr(Schema.String)),
	published_at: Schema.String,
});

export const FullPostResponseSchema = Schema.Struct({
	id: Schema.Number,
	title: Schema.String,
	slug: Schema.String,
	url: Schema.String,
	published_at: Schema.String,
	subtitle: Schema.optional(Schema.NullOr(Schema.String)),
	html_body: Schema.optional(Schema.NullOr(Schema.String)),
	markdown: Schema.optional(Schema.NullOr(Schema.String)),
	truncated_body: Schema.optional(Schema.NullOr(Schema.String)),
	reactions: Schema.optional(
		Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.Number })),
	),
	restacks: Schema.optional(Schema.NullOr(Schema.Number)),
	tags: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
	cover_image: Schema.optional(Schema.NullOr(Schema.String)),
});

export const DraftResponseSchema = Schema.Struct({
	title: Schema.optional(Schema.NullOr(Schema.String)),
	subtitle: Schema.optional(Schema.NullOr(Schema.String)),
	body: Schema.optional(Schema.NullOr(Schema.String)),
});

export const DraftSummaryResponseSchema = Schema.Struct({
	id: Schema.Number,
	uuid: Schema.String,
	title: Schema.optional(Schema.NullOr(Schema.String)),
	updated: Schema.optional(Schema.NullOr(Schema.String)),
});

export const CommentResponseSchema = Schema.Struct({
	id: Schema.Number,
	body: Schema.String,
	is_admin: Schema.Boolean,
});

export const CreateNoteResponseSchema = Schema.Struct({
	id: Schema.Number,
});

export const CreateDraftResponseSchema = Schema.Struct({
	id: Schema.Number,
	uuid: Schema.String,
});
