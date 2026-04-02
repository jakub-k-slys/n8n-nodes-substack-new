import { pipe } from 'effect';
import * as Schema from 'effect/Schema';

export const PositiveIntSchema = pipe(Schema.Int, Schema.greaterThan(0));

export const NonNegativeIntSchema = pipe(Schema.Int, Schema.greaterThanOrEqualTo(0));

export const NonEmptyStringSchema = pipe(Schema.String, Schema.minLength(1));

export const OptionalStringSchema = Schema.optional(Schema.String);

export const NoteIdSchema = pipe(PositiveIntSchema, Schema.brand('NoteId'));
export type NoteId = Schema.Schema.Type<typeof NoteIdSchema>;

export const DraftIdSchema = pipe(PositiveIntSchema, Schema.brand('DraftId'));
export type DraftId = Schema.Schema.Type<typeof DraftIdSchema>;

export const PostIdSchema = pipe(PositiveIntSchema, Schema.brand('PostId'));
export type PostId = Schema.Schema.Type<typeof PostIdSchema>;

export const ProfileSlugSchema = pipe(NonEmptyStringSchema, Schema.brand('ProfileSlug'));
export type ProfileSlug = Schema.Schema.Type<typeof ProfileSlugSchema>;

export const CursorSchema = pipe(NonEmptyStringSchema, Schema.brand('Cursor'));
export type Cursor = Schema.Schema.Type<typeof CursorSchema>;

export const LimitSchema = pipe(PositiveIntSchema, Schema.brand('Limit'));
export type Limit = Schema.Schema.Type<typeof LimitSchema>;

export const OffsetSchema = pipe(NonNegativeIntSchema, Schema.brand('Offset'));
export type Offset = Schema.Schema.Type<typeof OffsetSchema>;

export const GatewayUrlSchema = pipe(
	NonEmptyStringSchema,
	Schema.pattern(/^https?:\/\/.+/),
	Schema.brand('GatewayUrl'),
);
export type GatewayUrl = Schema.Schema.Type<typeof GatewayUrlSchema>;
