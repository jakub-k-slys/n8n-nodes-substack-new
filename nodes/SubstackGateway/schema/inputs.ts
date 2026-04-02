import * as Schema from 'effect/Schema';

import {
	NonEmptyStringSchema,
	CursorSchema,
	DraftIdSchema,
	LimitSchema,
	NoteIdSchema,
	OptionalStringSchema,
	OffsetSchema,
	PostIdSchema,
	ProfileSlugSchema,
} from './scalars';

export const CreateNoteInputSchema = Schema.Struct({
	content: NonEmptyStringSchema,
	attachment: OptionalStringSchema,
});

export const NoteIdInputSchema = Schema.Struct({
	noteId: NoteIdSchema,
});

export const DraftFieldsInputSchema = Schema.Struct({
	title: Schema.NullOr(Schema.String),
	subtitle: Schema.NullOr(Schema.String),
	body: Schema.NullOr(Schema.String),
});

export const DraftIdInputSchema = Schema.Struct({
	draftId: DraftIdSchema,
});

export const DraftWithIdInputSchema = Schema.Struct({
	draftId: DraftIdSchema,
	title: Schema.NullOr(Schema.String),
	subtitle: Schema.NullOr(Schema.String),
	body: Schema.NullOr(Schema.String),
});

export const PostIdInputSchema = Schema.Struct({
	postId: PostIdSchema,
});

export const ProfileSlugInputSchema = Schema.Struct({
	profileSlug: ProfileSlugSchema,
});

export const ProfileNotesInputSchema = Schema.Struct({
	profileSlug: ProfileSlugSchema,
	cursor: Schema.optional(CursorSchema),
});

export const ProfilePostsInputSchema = Schema.Struct({
	profileSlug: ProfileSlugSchema,
	limit: LimitSchema,
	offset: OffsetSchema,
});
