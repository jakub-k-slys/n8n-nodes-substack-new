import type { IDataObject } from 'n8n-workflow';
import * as Schema from 'effect/Schema';

import type { GatewayFollowingUser, GatewayPostSummary, GatewayProfile } from '../../../domain/model';
import { encodeJson, optional } from '../../serialize/shared';

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

export const toJsonPostSummary = (post: GatewayPostSummary): IDataObject => ({
	...encodeJson(JsonPostSummarySchema)({
		id: post.id,
		title: post.title,
		publishedAt: post.publishedAt,
		...optional('subtitle', post.subtitle),
		...optional('truncatedBody', post.truncatedBody),
	}),
});
