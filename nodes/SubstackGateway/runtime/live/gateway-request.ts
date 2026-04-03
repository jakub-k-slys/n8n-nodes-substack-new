import * as ClientError from '@effect/platform/HttpClientError';
import * as HttpClientRequest from '@effect/platform/HttpClientRequest';
import * as UrlParams from '@effect/platform/UrlParams';
import { Effect } from 'effect';
import type {
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';

const textDecoder = new TextDecoder();

const toRequestBody = (
	request: HttpClientRequest.HttpClientRequest,
): string | IDataObject | IDataObject[] | FormData | URLSearchParams => {
	switch (request.body._tag) {
		case 'Empty':
			throw new Error('Empty HttpClient bodies should not be encoded');
		case 'Raw':
			if (
				typeof request.body.body === 'string' ||
				request.body.body instanceof FormData ||
				request.body.body instanceof URLSearchParams
			) {
				return request.body.body;
			}

			if (Array.isArray(request.body.body)) {
				return request.body.body as IDataObject[];
			}

			if (typeof request.body.body === 'object' && request.body.body !== null) {
				return request.body.body as IDataObject;
			}

			throw new Error(`Unsupported raw HttpClient body type: ${typeof request.body.body}`);
		case 'Uint8Array': {
			const body = textDecoder.decode(request.body.body);
			return request.body.contentType.includes('json') ? JSON.parse(body) : body;
		}
		default:
			throw new Error(`Unsupported HttpClient body type: ${request.body._tag}`);
	}
};

const toRequestMethod = (
	method: HttpClientRequest.HttpClientRequest['method'],
): IHttpRequestMethods => {
	switch (method) {
		case 'GET':
		case 'POST':
		case 'PUT':
		case 'DELETE':
		case 'PATCH':
		case 'HEAD':
			return method;
		default:
			throw new Error(`Unsupported HttpClient method: ${method}`);
	}
};

export const toRequestOptions = (
	request: HttpClientRequest.HttpClientRequest,
	url: URL,
): Effect.Effect<IHttpRequestOptions, ClientError.RequestError> =>
	Effect.try({
		try: () =>
			({
				json: true,
				returnFullResponse: true,
				method: toRequestMethod(request.method),
				url: url.toString(),
				...(Object.keys(request.headers).length === 0 ? {} : { headers: request.headers }),
				...(request.urlParams.length === 0 ? {} : { qs: UrlParams.toRecord(request.urlParams) }),
				...(request.body._tag === 'Empty' ? {} : { body: toRequestBody(request) }),
			}) satisfies IHttpRequestOptions,
		catch: (cause) =>
			new ClientError.RequestError({
				request,
				reason: 'Encode',
				cause,
				description: 'Failed to encode HttpClient request for n8n transport',
			}),
	});
