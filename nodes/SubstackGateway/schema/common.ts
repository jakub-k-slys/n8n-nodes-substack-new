import * as Schema from 'effect/Schema';

export const ProfileResponseSchema = Schema.Struct({
	id: Schema.Number,
	handle: Schema.String,
	name: Schema.String,
	url: Schema.String,
	avatar_url: Schema.String,
	bio: Schema.optional(Schema.NullOr(Schema.String)),
});
export type ProfileResponse = Schema.Schema.Type<typeof ProfileResponseSchema>;

export const FollowingUserResponseSchema = Schema.Struct({
	id: Schema.Number,
	handle: Schema.String,
});
export type FollowingUserResponse = Schema.Schema.Type<typeof FollowingUserResponseSchema>;

export const NoteAuthorSchema = Schema.Struct({
	id: Schema.Number,
	name: Schema.String,
	handle: Schema.String,
	avatar_url: Schema.String,
});
export type NoteAuthor = Schema.Schema.Type<typeof NoteAuthorSchema>;

export const NoteResponseSchema = Schema.Struct({
	id: Schema.Number,
	body: Schema.String,
	likes_count: Schema.Number,
	author: NoteAuthorSchema,
	published_at: Schema.String,
});
export type NoteResponse = Schema.Schema.Type<typeof NoteResponseSchema>;

export const PostResponseSchema = Schema.Struct({
	id: Schema.Number,
	title: Schema.String,
	subtitle: Schema.optional(Schema.NullOr(Schema.String)),
	truncated_body: Schema.optional(Schema.NullOr(Schema.String)),
	published_at: Schema.String,
});
export type PostResponse = Schema.Schema.Type<typeof PostResponseSchema>;

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
export type FullPostResponse = Schema.Schema.Type<typeof FullPostResponseSchema>;

export const DraftResponseSchema = Schema.Struct({
	title: Schema.optional(Schema.NullOr(Schema.String)),
	subtitle: Schema.optional(Schema.NullOr(Schema.String)),
	body: Schema.optional(Schema.NullOr(Schema.String)),
});
export type DraftResponse = Schema.Schema.Type<typeof DraftResponseSchema>;

export const DraftSummaryResponseSchema = Schema.Struct({
	id: Schema.Number,
	uuid: Schema.String,
	title: Schema.optional(Schema.NullOr(Schema.String)),
	updated: Schema.optional(Schema.NullOr(Schema.String)),
});
export type DraftSummaryResponse = Schema.Schema.Type<typeof DraftSummaryResponseSchema>;

export const CommentResponseSchema = Schema.Struct({
	id: Schema.Number,
	body: Schema.String,
	is_admin: Schema.Boolean,
});
export type CommentResponse = Schema.Schema.Type<typeof CommentResponseSchema>;

export const CreateNoteResponseSchema = Schema.Struct({
	id: Schema.Number,
});
export type CreateNoteResponse = Schema.Schema.Type<typeof CreateNoteResponseSchema>;

export const CreateDraftResponseSchema = Schema.Struct({
	id: Schema.Number,
	uuid: Schema.String,
});
export type CreateDraftResponse = Schema.Schema.Type<typeof CreateDraftResponseSchema>;
