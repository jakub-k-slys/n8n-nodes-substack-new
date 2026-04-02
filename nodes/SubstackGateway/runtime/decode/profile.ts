import type { IExecuteFunctions } from 'n8n-workflow';

import type { ProfileCommand } from '../../domain/command';
import {
	ProfileNotesInputSchema,
	ProfilePostsInputSchema,
	ProfileSlugInputSchema,
} from '../../schema';
import { getOptionalString } from '../params';
import { decodeInput } from './shared';

export const decodeProfileCommand = (
	context: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): ProfileCommand | undefined => {
	switch (operation) {
		case 'getProfile':
			return {
				_tag: 'Get',
				...decodeInput(ProfileSlugInputSchema, {
					profileSlug: context.getNodeParameter('profileSlug', itemIndex),
				}),
			};
		case 'getProfileNotes':
			return {
				_tag: 'GetNotes',
				...decodeInput(ProfileNotesInputSchema, {
					profileSlug: context.getNodeParameter('profileSlug', itemIndex),
					cursor: getOptionalString(context, 'cursor', itemIndex),
				}),
			};
		case 'getProfilePosts':
			return {
				_tag: 'GetPosts',
				...decodeInput(ProfilePostsInputSchema, {
					profileSlug: context.getNodeParameter('profileSlug', itemIndex),
					limit: context.getNodeParameter('limit', itemIndex),
					offset: context.getNodeParameter('offset', itemIndex),
				}),
			};
		default:
			return undefined;
	}
};
