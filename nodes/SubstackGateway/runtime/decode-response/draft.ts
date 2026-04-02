import { Either } from 'effect';
import type { DraftCommand } from '../../domain/command';
import type { GatewayError } from '../../domain/error';
import type { GatewayResult } from '../../domain/result';
import {
	DraftCreateResponseSchema,
	DraftDeleteResponseSchema,
	DraftGetResponseSchema,
	DraftListResponseSchema,
	DraftUpdateResponseSchema,
} from '../../schema';
import { decodeResponseSchema } from './shared';

export const decodeDraftResponse = (
	command: DraftCommand,
	response: unknown,
): Either.Either<GatewayResult, GatewayError> => {
	switch (command._tag) {
		case 'List':
			return Either.map(decodeResponseSchema(DraftListResponseSchema, response), ({ items }) => ({
				_tag: 'Draft',
				result: { _tag: 'List', items },
			}));
		case 'Create':
			return Either.map(decodeResponseSchema(DraftCreateResponseSchema, response), (item) => ({
				_tag: 'Draft',
				result: { _tag: 'Created', item },
			}));
		case 'Get':
			return Either.map(decodeResponseSchema(DraftGetResponseSchema, response), (item) => ({
				_tag: 'Draft',
				result: { _tag: 'Fetched', item },
			}));
		case 'Update':
			return Either.map(decodeResponseSchema(DraftUpdateResponseSchema, response), (item) => ({
				_tag: 'Draft',
				result: { _tag: 'Updated', item },
			}));
		case 'Delete':
			return Either.map(decodeResponseSchema(DraftDeleteResponseSchema, response), (item) => ({
				_tag: 'Draft',
				result: { _tag: 'Deleted', item },
			}));
	}
};
