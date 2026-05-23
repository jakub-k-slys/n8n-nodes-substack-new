import { pipe } from 'effect';
import * as Schema from 'effect/Schema';

import { NonEmptyStringSchema } from './scalars';

export const BatchFeedSubscriptionsSchema = Schema.Struct({
	slugs: pipe(Schema.Array(NonEmptyStringSchema), Schema.minItems(1)),
});
export type BatchFeedSubscriptions = Schema.Schema.Type<typeof BatchFeedSubscriptionsSchema>;

export const BatchFeedRegistrationSchema = Schema.Struct({
	id: NonEmptyStringSchema,
});
export type BatchFeedRegistration = Schema.Schema.Type<typeof BatchFeedRegistrationSchema>;
