import type { IDataObject } from 'n8n-workflow';
import * as Schema from 'effect/Schema';

import type {
	CreatedDraft,
	CreatedNote,
	DeletedDraft,
	DeletedNote,
	GatewayComment,
	GatewayDraft,
	GatewayDraftSummary,
	GatewayFollowingUser,
	GatewayNote,
	GatewayNoteAuthor,
	GatewayPost,
	GatewayPostSummary,
	GatewayProfile,
} from '../../domain/model';
import { optional } from './shared';

const JsonNoteAuthorSchema = Schema.Struct({
	id: Schema.Number,
	name: Schema.String,
	handle: Schema.String,
	avatarUrl: Schema.String,
});

const JsonNoteSchema = Schema.Struct({
	id: Schema.Number,
	body: Schema.String,
	likesCount: Schema.Number,
	author: JsonNoteAuthorSchema,
	publishedAt: Schema.String,
});

const JsonCreatedNoteSchema = Schema.Struct({
	id: Schema.Number,
});

const JsonDeletedNoteSchema = Schema.Struct({
	success: Schema.Boolean,
	noteId: Schema.Number,
});

const JsonProfileSchema = Schema.Struct({
	id: Schema.Number,
	handle: Schema.String,
	name: Schema.String,
	url: Schema.String,
	avatarUrl: Schema.String,
	bio: Schema.optional(Schema.NullOr(Schema.String)),
});

const JsonFollowingUserSchema = Schema.Struct({
	id: Schema.Number,
	handle: Schema.String,
});

const JsonPostSummarySchema = Schema.Struct({
	id: Schema.Number,
	title: Schema.String,
	publishedAt: Schema.String,
	subtitle: Schema.optional(Schema.NullOr(Schema.String)),
	truncatedBody: Schema.optional(Schema.NullOr(Schema.String)),
});

const JsonPostSchema = Schema.Struct({
	id: Schema.Number,
	title: Schema.String,
	slug: Schema.String,
	url: Schema.String,
	publishedAt: Schema.String,
	subtitle: Schema.optional(Schema.NullOr(Schema.String)),
	htmlBody: Schema.optional(Schema.NullOr(Schema.String)),
	markdown: Schema.optional(Schema.NullOr(Schema.String)),
	truncatedBody: Schema.optional(Schema.NullOr(Schema.String)),
	reactions: Schema.optional(
		Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.Number })),
	),
	restacks: Schema.optional(Schema.NullOr(Schema.Number)),
	tags: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
	coverImage: Schema.optional(Schema.NullOr(Schema.String)),
});

const JsonDraftSchema = Schema.Struct({
	title: Schema.optional(Schema.NullOr(Schema.String)),
	subtitle: Schema.optional(Schema.NullOr(Schema.String)),
	body: Schema.optional(Schema.NullOr(Schema.String)),
});

const JsonDraftSummarySchema = Schema.Struct({
	id: Schema.Number,
	uuid: Schema.String,
	title: Schema.optional(Schema.NullOr(Schema.String)),
	updated: Schema.optional(Schema.NullOr(Schema.String)),
});

const JsonCommentSchema = Schema.Struct({
	id: Schema.Number,
	body: Schema.String,
	isAdmin: Schema.Boolean,
});

const JsonCreatedDraftSchema = Schema.Struct({
	id: Schema.Number,
	uuid: Schema.String,
});

const JsonDeletedDraftSchema = Schema.Struct({
	success: Schema.Boolean,
	draftId: Schema.Number,
});

const encodeJson = <A>(schema: Schema.Schema<A>) => Schema.encodeSync(schema);

export const toJsonNoteAuthor = (author: GatewayNoteAuthor): IDataObject => ({
	...encodeJson(JsonNoteAuthorSchema)(author),
});

export const toJsonProfile = (profile: GatewayProfile): IDataObject => ({
	...encodeJson(JsonProfileSchema)({
		id: profile.id,
		handle: profile.handle,
		name: profile.name,
		url: profile.url,
		avatarUrl: profile.avatarUrl,
		...optional('bio', profile.bio),
	}),
});

export const toJsonFollowingUser = (user: GatewayFollowingUser): IDataObject => ({
	...encodeJson(JsonFollowingUserSchema)(user),
});

export const toJsonNote = (note: GatewayNote): IDataObject => ({
	...encodeJson(JsonNoteSchema)({
		...note,
		author: encodeJson(JsonNoteAuthorSchema)(note.author),
	}),
});

export const toJsonPostSummary = (post: GatewayPostSummary): IDataObject => ({
	...encodeJson(JsonPostSummarySchema)({
		id: post.id,
		title: post.title,
		publishedAt: post.publishedAt,
		...optional('subtitle', post.subtitle),
		...optional('truncatedBody', post.truncatedBody),
	}),
});

export const toJsonPost = (post: GatewayPost): IDataObject => ({
	...encodeJson(JsonPostSchema)({
		id: post.id,
		title: post.title,
		slug: post.slug,
		url: post.url,
		publishedAt: post.publishedAt,
		...optional('subtitle', post.subtitle),
		...optional('htmlBody', post.htmlBody),
		...optional('markdown', post.markdown),
		...optional('truncatedBody', post.truncatedBody),
		...optional('reactions', post.reactions),
		...optional('restacks', post.restacks),
		...optional('tags', post.tags),
		...optional('coverImage', post.coverImage),
	}),
});

export const toJsonDraft = (draft: GatewayDraft): IDataObject => ({
	...encodeJson(JsonDraftSchema)({
		...optional('title', draft.title),
		...optional('subtitle', draft.subtitle),
		...optional('body', draft.body),
	}),
});

export const toJsonDraftSummary = (draft: GatewayDraftSummary): IDataObject => ({
	...encodeJson(JsonDraftSummarySchema)({
		id: draft.id,
		uuid: draft.uuid,
		...optional('title', draft.title),
		...optional('updated', draft.updated),
	}),
});

export const toJsonComment = (comment: GatewayComment): IDataObject => ({
	...encodeJson(JsonCommentSchema)(comment),
});

export const toJsonCreatedNote = (note: CreatedNote): IDataObject => ({
	...encodeJson(JsonCreatedNoteSchema)(note),
});

export const toJsonCreatedDraft = (draft: CreatedDraft): IDataObject => ({
	...encodeJson(JsonCreatedDraftSchema)(draft),
});

export const toJsonDeletedNote = (note: DeletedNote): IDataObject => ({
	...encodeJson(JsonDeletedNoteSchema)(note),
});

export const toJsonDeletedDraft = (draft: DeletedDraft): IDataObject => ({
	...encodeJson(JsonDeletedDraftSchema)(draft),
});
