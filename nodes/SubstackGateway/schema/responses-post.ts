import * as Schema from 'effect/Schema';

import { CommentResponseSchema, FullPostResponseSchema } from './common';

export const PostGetResponseSchema = FullPostResponseSchema;

export const PostCommentsResponseSchema = Schema.Struct({
	items: Schema.Array(CommentResponseSchema),
});

export const PostLikeResponseSchema = Schema.Struct({
	success: Schema.Boolean,
	postId: Schema.Number,
	liked: Schema.Boolean,
});

export const PostRestackResponseSchema = Schema.Struct({
	success: Schema.Boolean,
	postId: Schema.Number,
	restacked: Schema.Boolean,
});
