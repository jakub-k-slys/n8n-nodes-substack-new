import type { IDataObject } from 'n8n-workflow';
import * as Schema from 'effect/Schema';

import type { CreatedDraft, DeletedDraft, GatewayDraft, GatewayDraftSummary } from '../../../domain/model';
import { encodeJson, optional } from '../../serialize/shared';

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

const JsonCreatedDraftSchema = Schema.Struct({
	id: Schema.Number,
	uuid: Schema.String,
});

const JsonDeletedDraftSchema = Schema.Struct({
	success: Schema.Boolean,
	draftId: Schema.Number,
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

export const toJsonCreatedDraft = (draft: CreatedDraft): IDataObject => ({
	...encodeJson(JsonCreatedDraftSchema)(draft),
});

export const toJsonDeletedDraft = (draft: DeletedDraft): IDataObject => ({
	...encodeJson(JsonDeletedDraftSchema)(draft),
});
