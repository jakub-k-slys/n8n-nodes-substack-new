import type { IExecuteFunctions } from 'n8n-workflow';

import type { PostCommand } from '../../domain/command';
import { PostIdInputSchema } from '../../schema';
import { decodeInput } from './shared';

export const decodePostCommand = (
	context: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): PostCommand | undefined => {
	switch (operation) {
		case 'getPost':
			return {
				_tag: 'Get',
				...decodeInput(PostIdInputSchema, {
					postId: context.getNodeParameter('postId', itemIndex),
				}),
			};
		case 'getPostComments':
			return {
				_tag: 'GetComments',
				...decodeInput(PostIdInputSchema, {
					postId: context.getNodeParameter('postId', itemIndex),
				}),
			};
		default:
			return undefined;
	}
};
