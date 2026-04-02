import { Effect } from 'effect';
import type { IExecuteFunctions } from 'n8n-workflow';

import type { GatewayCommand } from '../domain/command';
import type { GatewayError } from '../domain/error';
import { isGatewayError } from '../domain/error';
import { decodeDraftCommand } from './decode/draft';
import { decodeNoteCommand } from './decode/note';
import { decodeOwnPublicationCommand } from './decode/own-publication';
import { decodePostCommand } from './decode/post';
import { decodeProfileCommand } from './decode/profile';

export const decodeGatewayCommand = (
	context: IExecuteFunctions,
	itemIndex: number,
): Effect.Effect<GatewayCommand, GatewayError> =>
	Effect.try({
		try: () => {
			const resource = context.getNodeParameter('resource', itemIndex) as string;
			const operation = context.getNodeParameter('operation', itemIndex) as string;

			if (resource === 'ownPublication') {
				const command = decodeOwnPublicationCommand(operation);
				if (command !== undefined) return { _tag: 'OwnPublication', command };
			}

			if (resource === 'note') {
				const command = decodeNoteCommand(context, itemIndex, operation);
				if (command !== undefined) return { _tag: 'Note', command };
			}

			if (resource === 'draft') {
				const command = decodeDraftCommand(context, itemIndex, operation);
				if (command !== undefined) return { _tag: 'Draft', command };
			}

			if (resource === 'post') {
				const command = decodePostCommand(context, itemIndex, operation);
				if (command !== undefined) return { _tag: 'Post', command };
			}

			if (resource === 'profile') {
				const command = decodeProfileCommand(context, itemIndex, operation);
				if (command !== undefined) return { _tag: 'Profile', command };
			}

			throw { _tag: 'UnsupportedOperation', resource, operation } satisfies GatewayError;
		},
		catch: (cause) =>
			isGatewayError(cause)
				? cause
				: {
						_tag: 'UnexpectedError',
						message: cause instanceof Error ? cause.message : 'Unknown error',
						cause,
					},
	});
