import { Either } from 'effect';
import type { IExecuteFunctions } from 'n8n-workflow';

import type { DraftCommand } from '../../domain/command';
import type { GatewayError } from '../../domain/error';
import { DraftFieldsInputSchema, DraftIdInputSchema, DraftWithIdInputSchema } from '../../schema';
import { getDraftPayload } from '../params';
import { decodeInput } from './shared';

export const decodeDraftCommand = (
	context: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): Either.Either<DraftCommand | undefined, GatewayError> => {
	switch (operation) {
		case 'listDrafts':
			return Either.right({ _tag: 'List' });
		case 'createDraft':
			return Either.map(
				decodeInput(DraftFieldsInputSchema, getDraftPayload(context, itemIndex)),
				(input) => ({ _tag: 'Create', ...input }) as const,
			);
		case 'getDraft':
			return Either.map(
				decodeInput(DraftIdInputSchema, {
					draftId: context.getNodeParameter('draftId', itemIndex),
				}),
				(input) => ({ _tag: 'Get', ...input }) as const,
			);
		case 'updateDraft':
			return Either.map(
				decodeInput(DraftWithIdInputSchema, {
					draftId: context.getNodeParameter('draftId', itemIndex),
					...getDraftPayload(context, itemIndex),
				}),
				(input) => ({ _tag: 'Update', ...input }) as const,
			);
		case 'deleteDraft':
			return Either.map(
				decodeInput(DraftIdInputSchema, {
					draftId: context.getNodeParameter('draftId', itemIndex),
				}),
				(input) => ({ _tag: 'Delete', ...input }) as const,
			);
		default:
			return Either.right(undefined);
	}
};
