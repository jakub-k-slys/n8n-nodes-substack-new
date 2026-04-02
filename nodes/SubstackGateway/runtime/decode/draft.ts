import type { IExecuteFunctions } from 'n8n-workflow';

import type { DraftCommand } from '../../domain/command';
import { DraftFieldsInputSchema, DraftIdInputSchema, DraftWithIdInputSchema } from '../../schema';
import { getDraftPayload } from '../params';
import { decodeInput } from './shared';

export const decodeDraftCommand = (
	context: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): DraftCommand | undefined => {
	switch (operation) {
		case 'listDrafts':
			return { _tag: 'List' };
		case 'createDraft':
			return {
				_tag: 'Create',
				...decodeInput(DraftFieldsInputSchema, getDraftPayload(context, itemIndex)),
			};
		case 'getDraft':
			return {
				_tag: 'Get',
				...decodeInput(DraftIdInputSchema, {
					draftId: context.getNodeParameter('draftId', itemIndex),
				}),
			};
		case 'updateDraft':
			return {
				_tag: 'Update',
				...decodeInput(DraftWithIdInputSchema, {
					draftId: context.getNodeParameter('draftId', itemIndex),
					...getDraftPayload(context, itemIndex),
				}),
			};
		case 'deleteDraft':
			return {
				_tag: 'Delete',
				...decodeInput(DraftIdInputSchema, {
					draftId: context.getNodeParameter('draftId', itemIndex),
				}),
			};
		default:
			return undefined;
	}
};
