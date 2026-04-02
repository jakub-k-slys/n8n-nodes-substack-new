import type { DraftCommand } from '../../domain/command';
import type { GatewayResult } from '../../domain/result';
import {
	DraftCreateResponseSchema,
	DraftDeleteResponseSchema,
	DraftGetResponseSchema,
	DraftListResponseSchema,
	DraftUpdateResponseSchema,
} from '../../schema';
import { decodeResponseSchema, manyResult, singleResult } from './shared';

export const decodeDraftResponse = (command: DraftCommand, response: unknown): GatewayResult => {
	switch (command._tag) {
		case 'List':
			return manyResult(decodeResponseSchema(DraftListResponseSchema, response).items);
		case 'Create':
			return singleResult(decodeResponseSchema(DraftCreateResponseSchema, response));
		case 'Get':
			return singleResult(decodeResponseSchema(DraftGetResponseSchema, response));
		case 'Update':
			return singleResult(decodeResponseSchema(DraftUpdateResponseSchema, response));
		case 'Delete':
			return singleResult(decodeResponseSchema(DraftDeleteResponseSchema, response));
	}
};
