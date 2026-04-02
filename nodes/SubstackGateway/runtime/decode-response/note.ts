import type { NoteCommand } from '../../domain/command';
import type { GatewayResult } from '../../domain/result';
import {
	NoteCreateResponseSchema,
	NoteDeleteResponseSchema,
	NoteGetResponseSchema,
} from '../../schema';
import { decodeResponseSchema, singleResult } from './shared';

export const decodeNoteResponse = (command: NoteCommand, response: unknown): GatewayResult => {
	switch (command._tag) {
		case 'Create':
			return singleResult(decodeResponseSchema(NoteCreateResponseSchema, response));
		case 'Get':
			return singleResult(decodeResponseSchema(NoteGetResponseSchema, response));
		case 'Delete':
			return singleResult(decodeResponseSchema(NoteDeleteResponseSchema, response));
	}
};
