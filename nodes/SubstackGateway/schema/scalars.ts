import { pipe } from 'effect';
import * as Schema from 'effect/Schema';

export const PositiveIntSchema = pipe(Schema.Int, Schema.greaterThan(0));

export const NonNegativeIntSchema = pipe(Schema.Int, Schema.greaterThanOrEqualTo(0));

export const NonEmptyStringSchema = pipe(Schema.String, Schema.minLength(1));

export const OptionalStringSchema = Schema.optional(Schema.String);

export const NoteIdSchema = pipe(PositiveIntSchema, Schema.brand('NoteId'));

export const DraftIdSchema = pipe(PositiveIntSchema, Schema.brand('DraftId'));

export const PostIdSchema = pipe(PositiveIntSchema, Schema.brand('PostId'));

export const ProfileSlugSchema = pipe(NonEmptyStringSchema, Schema.brand('ProfileSlug'));

export const CursorSchema = pipe(NonEmptyStringSchema, Schema.brand('Cursor'));

export const LimitSchema = pipe(PositiveIntSchema, Schema.brand('Limit'));

export const OffsetSchema = pipe(NonNegativeIntSchema, Schema.brand('Offset'));

export const GatewayUrlSchema = pipe(
	NonEmptyStringSchema,
	Schema.pattern(/^https?:\/\/.+/),
	Schema.brand('GatewayUrl'),
);
