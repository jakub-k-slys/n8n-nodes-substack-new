import { Either } from 'effect';
import type { IExecuteFunctions } from 'n8n-workflow';

import type { NoteCommand } from '../../domain/command';
import type { GatewayError } from '../../domain/error';
import { CreateNoteInputSchema, NoteIdInputSchema } from '../../schema';
import { getOptionalString } from '../params';
import { decodeInput } from './shared';

export const decodeNoteCommand = (
	context: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): Either.Either<NoteCommand | undefined, GatewayError> => {
	switch (operation) {
		case 'createNote':
			return Either.map(
				decodeInput(CreateNoteInputSchema, {
					content: context.getNodeParameter('content', itemIndex),
					attachment: getOptionalString(context, 'attachment', itemIndex),
				}),
				(input) => ({ _tag: 'Create', ...input }) as const,
			);
		case 'getNote':
			return Either.map(
				decodeInput(NoteIdInputSchema, {
					noteId: context.getNodeParameter('noteId', itemIndex),
				}),
				(input) => ({ _tag: 'Get', ...input }) as const,
			);
		case 'deleteNote':
			return Either.map(
				decodeInput(NoteIdInputSchema, {
					noteId: context.getNodeParameter('noteId', itemIndex),
				}),
				(input) => ({ _tag: 'Delete', ...input }) as const,
			);
		default:
			return Either.right(undefined);
	}
};
