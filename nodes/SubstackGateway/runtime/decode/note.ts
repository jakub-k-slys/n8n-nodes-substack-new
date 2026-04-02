import type { IExecuteFunctions } from 'n8n-workflow';

import type { NoteCommand } from '../../domain/command';
import { CreateNoteInputSchema, NoteIdInputSchema } from '../../schema';
import { getOptionalString } from '../params';
import { decodeInput } from './shared';

export const decodeNoteCommand = (
	context: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): NoteCommand | undefined => {
	switch (operation) {
		case 'createNote':
			return {
				_tag: 'Create',
				...decodeInput(CreateNoteInputSchema, {
					content: context.getNodeParameter('content', itemIndex),
					attachment: getOptionalString(context, 'attachment', itemIndex),
				}),
			};
		case 'getNote':
			return {
				_tag: 'Get',
				...decodeInput(NoteIdInputSchema, {
					noteId: context.getNodeParameter('noteId', itemIndex),
				}),
			};
		case 'deleteNote':
			return {
				_tag: 'Delete',
				...decodeInput(NoteIdInputSchema, {
					noteId: context.getNodeParameter('noteId', itemIndex),
				}),
			};
		default:
			return undefined;
	}
};
