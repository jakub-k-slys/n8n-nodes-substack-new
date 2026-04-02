import { Either } from 'effect';
import type { NoteCommand } from '../../domain/command';
import type { GatewayError } from '../../domain/error';
import type { GatewayResult } from '../../domain/result';
import {
	NoteCreateResponseSchema,
	NoteDeleteResponseSchema,
	NoteGetResponseSchema,
} from '../../schema';
import { decodeResponseSchema, singleItem } from './shared';

export const decodeNoteResponse = (
	command: NoteCommand,
	response: unknown,
): Either.Either<GatewayResult, GatewayError> => {
	switch (command._tag) {
		case 'Create':
			return Either.map(decodeResponseSchema(NoteCreateResponseSchema, response), (item) => ({
				_tag: 'Note',
				result: { _tag: 'Created', item: singleItem(item) },
			}));
		case 'Get':
			return Either.map(decodeResponseSchema(NoteGetResponseSchema, response), (item) => ({
				_tag: 'Note',
				result: { _tag: 'Fetched', item: singleItem(item) },
			}));
		case 'Delete':
			return Either.map(decodeResponseSchema(NoteDeleteResponseSchema, response), (item) => ({
				_tag: 'Note',
				result: { _tag: 'Deleted', item: singleItem(item) },
			}));
	}
};
