import { Effect } from 'effect';
import type { IDataObject, IExecuteFunctions, INodeExecutionData, JsonObject } from 'n8n-workflow';

type GatewayRequest =
	| { readonly _tag: 'OwnProfile' }
	| { readonly _tag: 'OwnNotes' }
	| { readonly _tag: 'OwnPosts' }
	| { readonly _tag: 'OwnFollowing' }
	| { readonly _tag: 'CreateNote'; readonly content: string; readonly attachment?: string }
	| { readonly _tag: 'GetNote'; readonly noteId: number }
	| { readonly _tag: 'DeleteNote'; readonly noteId: number }
	| { readonly _tag: 'ListDrafts' }
	| {
			readonly _tag: 'CreateDraft' | 'UpdateDraft';
			readonly draftId?: number;
			readonly title: string | null;
			readonly subtitle: string | null;
			readonly body: string | null;
	  }
	| { readonly _tag: 'GetDraft'; readonly draftId: number }
	| { readonly _tag: 'DeleteDraft'; readonly draftId: number }
	| { readonly _tag: 'GetPost'; readonly postId: number }
	| { readonly _tag: 'GetPostComments'; readonly postId: number }
	| { readonly _tag: 'GetProfile'; readonly profileSlug: string }
	| { readonly _tag: 'GetProfileNotes'; readonly profileSlug: string; readonly cursor?: string }
	| {
			readonly _tag: 'GetProfilePosts';
			readonly profileSlug: string;
			readonly limit: number;
			readonly offset: number;
	  };

type GatewayExecutionError =
	| {
			readonly _tag: 'UnsupportedOperation';
			readonly resource: string;
			readonly operation: string;
	  }
	| {
			readonly _tag: 'ApiError';
			readonly message: string;
			readonly cause: unknown;
	  }
	| {
			readonly _tag: 'UnexpectedError';
			readonly message: string;
			readonly cause: unknown;
	  };

type GatewayHttpRequest = {
	readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	readonly url: string;
	readonly qs?: IDataObject;
	readonly body?: IDataObject;
	readonly responseType: 'single' | 'items' | 'empty';
	readonly emptyResponseBody?: IDataObject;
};

const isGatewayExecutionError = (value: unknown): value is GatewayExecutionError =>
	typeof value === 'object' && value !== null && '_tag' in value;

const getOptionalString = (
	context: IExecuteFunctions,
	name: string,
	itemIndex: number,
): string | undefined => {
	const value = String(context.getNodeParameter(name, itemIndex, '')).trim();
	return value === '' ? undefined : value;
};

const getDraftPayload = (context: IExecuteFunctions, itemIndex: number) => ({
	title: getOptionalString(context, 'title', itemIndex) ?? null,
	subtitle: getOptionalString(context, 'subtitle', itemIndex) ?? null,
	body: getOptionalString(context, 'body', itemIndex) ?? null,
});

const decodeGatewayRequest = (
	context: IExecuteFunctions,
	itemIndex: number,
): Effect.Effect<GatewayRequest, GatewayExecutionError> =>
	Effect.try({
		try: () => {
			const resource = context.getNodeParameter('resource', itemIndex) as string;
			const operation = context.getNodeParameter('operation', itemIndex) as string;

			if (resource === 'ownPublication') {
				switch (operation) {
					case 'ownProfile':
						return { _tag: 'OwnProfile' } as const;
					case 'ownNotes':
						return { _tag: 'OwnNotes' } as const;
					case 'ownPosts':
						return { _tag: 'OwnPosts' } as const;
					case 'ownFollowing':
						return { _tag: 'OwnFollowing' } as const;
				}
			}

			if (resource === 'note') {
				switch (operation) {
					case 'createNote':
						return {
							_tag: 'CreateNote',
							content: context.getNodeParameter('content', itemIndex) as string,
							attachment: getOptionalString(context, 'attachment', itemIndex),
						} as const;
					case 'getNote':
						return {
							_tag: 'GetNote',
							noteId: context.getNodeParameter('noteId', itemIndex) as number,
						} as const;
					case 'deleteNote':
						return {
							_tag: 'DeleteNote',
							noteId: context.getNodeParameter('noteId', itemIndex) as number,
						} as const;
				}
			}

			if (resource === 'draft') {
				switch (operation) {
					case 'listDrafts':
						return { _tag: 'ListDrafts' } as const;
					case 'createDraft':
						return {
							_tag: 'CreateDraft',
							...getDraftPayload(context, itemIndex),
						} as const;
					case 'getDraft':
						return {
							_tag: 'GetDraft',
							draftId: context.getNodeParameter('draftId', itemIndex) as number,
						} as const;
					case 'updateDraft':
						return {
							_tag: 'UpdateDraft',
							draftId: context.getNodeParameter('draftId', itemIndex) as number,
							...getDraftPayload(context, itemIndex),
						} as const;
					case 'deleteDraft':
						return {
							_tag: 'DeleteDraft',
							draftId: context.getNodeParameter('draftId', itemIndex) as number,
						} as const;
				}
			}

			if (resource === 'post') {
				const postId = context.getNodeParameter('postId', itemIndex) as number;

				switch (operation) {
					case 'getPost':
						return { _tag: 'GetPost', postId } as const;
					case 'getPostComments':
						return { _tag: 'GetPostComments', postId } as const;
				}
			}

			if (resource === 'profile') {
				const profileSlug = context.getNodeParameter('profileSlug', itemIndex) as string;

				switch (operation) {
					case 'getProfile':
						return { _tag: 'GetProfile', profileSlug } as const;
					case 'getProfileNotes':
						return {
							_tag: 'GetProfileNotes',
							profileSlug,
							cursor: getOptionalString(context, 'cursor', itemIndex),
						} as const;
					case 'getProfilePosts':
						return {
							_tag: 'GetProfilePosts',
							profileSlug,
							limit: context.getNodeParameter('limit', itemIndex) as number,
							offset: context.getNodeParameter('offset', itemIndex) as number,
						} as const;
				}
			}

			throw {
				_tag: 'UnsupportedOperation',
				resource,
				operation,
			} satisfies GatewayExecutionError;
		},
		catch: (cause) =>
			isGatewayExecutionError(cause)
				? cause
				: {
						_tag: 'UnexpectedError',
						message: cause instanceof Error ? cause.message : 'Unknown error',
						cause,
					},
	});

const toGatewayHttpRequest = (gatewayUrl: string, request: GatewayRequest): GatewayHttpRequest => {
	switch (request._tag) {
		case 'OwnProfile':
			return { method: 'GET', url: `${gatewayUrl}/me`, responseType: 'single' };
		case 'OwnNotes':
			return { method: 'GET', url: `${gatewayUrl}/me/notes`, responseType: 'items' };
		case 'OwnPosts':
			return { method: 'GET', url: `${gatewayUrl}/me/posts`, responseType: 'items' };
		case 'OwnFollowing':
			return { method: 'GET', url: `${gatewayUrl}/me/following`, responseType: 'items' };
		case 'CreateNote':
			return {
				method: 'POST',
				url: `${gatewayUrl}/notes`,
				body: {
					content: request.content,
					...(request.attachment !== undefined ? { attachment: request.attachment } : {}),
				},
				responseType: 'single',
			};
		case 'GetNote':
			return {
				method: 'GET',
				url: `${gatewayUrl}/notes/${request.noteId}`,
				responseType: 'single',
			};
		case 'DeleteNote':
			return {
				method: 'DELETE',
				url: `${gatewayUrl}/notes/${request.noteId}`,
				responseType: 'empty',
				emptyResponseBody: { success: true, noteId: request.noteId },
			};
		case 'ListDrafts':
			return { method: 'GET', url: `${gatewayUrl}/drafts`, responseType: 'items' };
		case 'CreateDraft':
			return {
				method: 'POST',
				url: `${gatewayUrl}/drafts`,
				body: {
					title: request.title,
					subtitle: request.subtitle,
					body: request.body,
				},
				responseType: 'single',
			};
		case 'GetDraft':
			return {
				method: 'GET',
				url: `${gatewayUrl}/drafts/${request.draftId}`,
				responseType: 'single',
			};
		case 'UpdateDraft':
			return {
				method: 'PUT',
				url: `${gatewayUrl}/drafts/${request.draftId}`,
				body: {
					title: request.title,
					subtitle: request.subtitle,
					body: request.body,
				},
				responseType: 'single',
			};
		case 'DeleteDraft':
			return {
				method: 'DELETE',
				url: `${gatewayUrl}/drafts/${request.draftId}`,
				responseType: 'empty',
				emptyResponseBody: { success: true, draftId: request.draftId },
			};
		case 'GetPost':
			return {
				method: 'GET',
				url: `${gatewayUrl}/posts/${request.postId}`,
				responseType: 'single',
			};
		case 'GetPostComments':
			return {
				method: 'GET',
				url: `${gatewayUrl}/posts/${request.postId}/comments`,
				responseType: 'items',
			};
		case 'GetProfile':
			return {
				method: 'GET',
				url: `${gatewayUrl}/profiles/${request.profileSlug}`,
				responseType: 'single',
			};
		case 'GetProfileNotes':
			return {
				method: 'GET',
				url: `${gatewayUrl}/profiles/${request.profileSlug}/notes`,
				qs: request.cursor === undefined ? undefined : { cursor: request.cursor },
				responseType: 'items',
			};
		case 'GetProfilePosts':
			return {
				method: 'GET',
				url: `${gatewayUrl}/profiles/${request.profileSlug}/posts`,
				qs: { limit: request.limit, offset: request.offset },
				responseType: 'items',
			};
	}
};

const executeGatewayHttpRequest = (
	context: IExecuteFunctions,
	request: GatewayHttpRequest,
): Effect.Effect<IDataObject[], GatewayExecutionError> =>
	Effect.tryPromise({
		try: async () => {
			if (request.responseType === 'empty') {
				await context.helpers.httpRequestWithAuthentication.call(context, 'substackGatewayApi', {
					json: true,
					method: request.method,
					url: request.url,
					...(request.qs !== undefined ? { qs: request.qs } : {}),
					...(request.body !== undefined ? { body: request.body } : {}),
				});

				return [request.emptyResponseBody ?? {}];
			}

			const response = (await context.helpers.httpRequestWithAuthentication.call(
				context,
				'substackGatewayApi',
				{
					json: true,
					method: request.method,
					url: request.url,
					...(request.qs !== undefined ? { qs: request.qs } : {}),
					...(request.body !== undefined ? { body: request.body } : {}),
				},
			)) as IDataObject;

			return request.responseType === 'single'
				? [response]
				: Array.isArray(response.items)
					? (response.items as IDataObject[])
					: [];
		},
		catch: (cause) => ({
			_tag: 'ApiError',
			message: cause instanceof Error ? cause.message : 'Gateway request failed',
			cause,
		}),
	});

export const runGatewayOperation = (
	context: IExecuteFunctions,
	itemIndex: number,
	gatewayUrl: string,
): Promise<INodeExecutionData[]> =>
	Effect.runPromise(
		Effect.map(
			Effect.flatMap(decodeGatewayRequest(context, itemIndex), (request) =>
				executeGatewayHttpRequest(context, toGatewayHttpRequest(gatewayUrl, request)),
			),
			(items) =>
				items.map((json) => ({
					json,
					pairedItem: { item: itemIndex },
				})),
		),
	);

export const toGatewayErrorMessage = (error: unknown): string => {
	if (isGatewayExecutionError(error)) {
		if (error._tag === 'UnsupportedOperation') {
			return `Unsupported resource/operation combination: ${error.resource}/${error.operation}`;
		}

		return error.message;
	}

	return error instanceof Error ? error.message : 'Unknown error';
};

export const isGatewayOperationError = (
	error: unknown,
): error is Extract<GatewayExecutionError, { _tag: 'UnsupportedOperation' }> =>
	isGatewayExecutionError(error) && error._tag === 'UnsupportedOperation';

export const toGatewayApiCause = (error: unknown): JsonObject | undefined => {
	if (
		isGatewayExecutionError(error) &&
		error._tag === 'ApiError' &&
		typeof error.cause === 'object' &&
		error.cause !== null
	) {
		return error.cause as JsonObject;
	}

	if (typeof error === 'object' && error !== null) {
		return error as JsonObject;
	}

	return undefined;
};
