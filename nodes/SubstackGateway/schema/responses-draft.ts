import * as Schema from 'effect/Schema';

import {
	CreateDraftResponseSchema,
	DraftResponseSchema,
	DraftSummaryResponseSchema,
} from './common';

export const DraftListResponseSchema = Schema.Struct({
	items: Schema.Array(DraftSummaryResponseSchema),
});

export const DraftCreateResponseSchema = CreateDraftResponseSchema;

export const DraftGetResponseSchema = DraftResponseSchema;

export const DraftUpdateResponseSchema = DraftResponseSchema;

export const DraftDeleteResponseSchema = Schema.Struct({
	success: Schema.Boolean,
	draftId: Schema.Number,
});
