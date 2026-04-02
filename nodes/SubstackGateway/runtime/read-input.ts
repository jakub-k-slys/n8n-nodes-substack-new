import { Effect, Match } from 'effect';
import type { IExecuteFunctions } from 'n8n-workflow';

import type { GatewayError } from '../domain/error';
import type {
	DraftInput,
	NoteInput,
	OwnPublicationInput,
	PostInput,
	ProfileInput,
} from '../domain/input';
import type { GatewayOperation } from '../domain/operation';
import { getDraftPayload, getOptionalString } from './params';

const unexpectedError = (cause: unknown): GatewayError =>
	({
		_tag: 'UnexpectedError',
		message: cause instanceof Error ? cause.message : 'Unknown error',
		cause,
	}) satisfies GatewayError;

export const readGatewaySelection = (
	context: IExecuteFunctions,
	itemIndex: number,
): Effect.Effect<{ readonly resource: string; readonly operation: string }, GatewayError> =>
	Effect.try({
		try: () => ({
			resource: String(context.getNodeParameter('resource', itemIndex)),
			operation: String(context.getNodeParameter('operation', itemIndex)),
		}),
		catch: unexpectedError,
	});

export const readGatewayInput = (
	context: IExecuteFunctions,
	itemIndex: number,
	operation: GatewayOperation,
): Effect.Effect<
	OwnPublicationInput | NoteInput | DraftInput | PostInput | ProfileInput,
	GatewayError
> =>
	Effect.try({
		try: () =>
			Match.value(operation).pipe(
				Match.when({ _tag: 'OwnPublication' }, ({ operation }) => ({
					_tag: operation,
				})),
				Match.when({ _tag: 'Note' }, ({ operation }) =>
					Match.value(operation).pipe(
						Match.when('createNote', () => ({
							_tag: 'createNote' as const,
							content: context.getNodeParameter('content', itemIndex),
							attachment: getOptionalString(context, 'attachment', itemIndex),
						})),
						Match.when('getNote', () => ({
							_tag: 'getNote' as const,
							noteId: context.getNodeParameter('noteId', itemIndex),
						})),
						Match.when('deleteNote', () => ({
							_tag: 'deleteNote' as const,
							noteId: context.getNodeParameter('noteId', itemIndex),
						})),
						Match.exhaustive,
					),
				),
				Match.when({ _tag: 'Draft' }, ({ operation }) =>
					Match.value(operation).pipe(
						Match.when('listDrafts', () => ({ _tag: 'listDrafts' as const })),
						Match.when('createDraft', () => ({
							_tag: 'createDraft' as const,
							...getDraftPayload(context, itemIndex),
						})),
						Match.when('getDraft', () => ({
							_tag: 'getDraft' as const,
							draftId: context.getNodeParameter('draftId', itemIndex),
						})),
						Match.when('updateDraft', () => ({
							_tag: 'updateDraft' as const,
							draftId: context.getNodeParameter('draftId', itemIndex),
							...getDraftPayload(context, itemIndex),
						})),
						Match.when('deleteDraft', () => ({
							_tag: 'deleteDraft' as const,
							draftId: context.getNodeParameter('draftId', itemIndex),
						})),
						Match.exhaustive,
					),
				),
				Match.when({ _tag: 'Post' }, ({ operation }) =>
					Match.value(operation).pipe(
						Match.when('getPost', () => ({
							_tag: 'getPost' as const,
							postId: context.getNodeParameter('postId', itemIndex),
						})),
						Match.when('getPostComments', () => ({
							_tag: 'getPostComments' as const,
							postId: context.getNodeParameter('postId', itemIndex),
						})),
						Match.exhaustive,
					),
				),
				Match.when({ _tag: 'Profile' }, ({ operation }) =>
					Match.value(operation).pipe(
						Match.when('getProfile', () => ({
							_tag: 'getProfile' as const,
							profileSlug: context.getNodeParameter('profileSlug', itemIndex),
						})),
						Match.when('getProfileNotes', () => ({
							_tag: 'getProfileNotes' as const,
							profileSlug: context.getNodeParameter('profileSlug', itemIndex),
							cursor: getOptionalString(context, 'cursor', itemIndex),
						})),
						Match.when('getProfilePosts', () => ({
							_tag: 'getProfilePosts' as const,
							profileSlug: context.getNodeParameter('profileSlug', itemIndex),
							limit: context.getNodeParameter('limit', itemIndex),
							offset: context.getNodeParameter('offset', itemIndex),
						})),
						Match.exhaustive,
					),
				),
				Match.exhaustive,
			),
		catch: unexpectedError,
	});
