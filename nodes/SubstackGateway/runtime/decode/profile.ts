import { Either } from 'effect';
import type { IExecuteFunctions } from 'n8n-workflow';

import type { ProfileCommand } from '../../domain/command';
import type { GatewayError } from '../../domain/error';
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
): Either.Either<ProfileCommand | undefined, GatewayError> => {
	switch (operation) {
		case 'getProfile':
			return Either.map(
				decodeInput(ProfileSlugInputSchema, {
					profileSlug: context.getNodeParameter('profileSlug', itemIndex),
				}),
				(input) => ({ _tag: 'Get', ...input }) as const,
			);
		case 'getProfileNotes':
			return Either.map(
				decodeInput(ProfileNotesInputSchema, {
					profileSlug: context.getNodeParameter('profileSlug', itemIndex),
					cursor: getOptionalString(context, 'cursor', itemIndex),
				}),
				(input) => ({ _tag: 'GetNotes', ...input }) as const,
			);
		case 'getProfilePosts':
			return Either.map(
				decodeInput(ProfilePostsInputSchema, {
					profileSlug: context.getNodeParameter('profileSlug', itemIndex),
					limit: context.getNodeParameter('limit', itemIndex),
					offset: context.getNodeParameter('offset', itemIndex),
				}),
				(input) => ({ _tag: 'GetPosts', ...input }) as const,
			);
		default:
			return Either.right(undefined);
	}
};
