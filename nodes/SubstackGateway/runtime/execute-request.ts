import * as HttpClient from '@effect/platform/HttpClient';
import * as ClientRequest from '@effect/platform/HttpClientRequest';
import * as ClientResponse from '@effect/platform/HttpClientResponse';
import { Effect, Match, pipe } from 'effect';
import type { IDataObject } from 'n8n-workflow';

import type { GatewayError } from '../domain/error';
import type { GatewayHttpRequest } from '../domain/http';

const toApiError = (message: string) => (cause: unknown) =>
	({
		_tag: 'ApiError',
		message,
		cause,
	}) satisfies GatewayError;

const toUrlParams = (qs: IDataObject) =>
	Object.fromEntries(
		Object.entries(qs).flatMap(([key, value]) => {
			if (value === undefined || value === null) {
				return [];
			}

			return [[key, String(value)]];
		}),
	);

const makeRequest = (
	request: GatewayHttpRequest,
): Effect.Effect<ClientRequest.HttpClientRequest, GatewayError> => {
	const baseRequest = Match.value(request.method).pipe(
		Match.when('GET', () => ClientRequest.get(request.url)),
		Match.when('POST', () => ClientRequest.post(request.url)),
		Match.when('PUT', () => ClientRequest.put(request.url)),
		Match.when('DELETE', () => ClientRequest.del(request.url)),
		Match.exhaustive,
	);

	return pipe(
		Effect.succeed(
			request.qs === undefined
				? baseRequest
				: ClientRequest.setUrlParams(baseRequest, toUrlParams(request.qs)),
		),
		Effect.flatMap((clientRequest) =>
			request.body === undefined
				? Effect.succeed(clientRequest)
				: pipe(
						ClientRequest.bodyJson(clientRequest, request.body),
						Effect.mapError(toApiError('Failed to encode gateway request body')),
					),
		),
	);
};

export const executeGatewayRequest = (
	request: GatewayHttpRequest,
): Effect.Effect<unknown, GatewayError, HttpClient.HttpClient> =>
	pipe(
		makeRequest(request),
		Effect.flatMap(HttpClient.execute),
		Effect.mapError(toApiError('Gateway request failed')),
		Effect.flatMap(ClientResponse.filterStatusOk),
		Effect.mapError(toApiError('Gateway request returned an error response')),
		Effect.flatMap((response) =>
			request.responseMode === 'empty'
				? Effect.succeed(request.emptyResponseBody ?? {})
				: pipe(
						response.json,
						Effect.mapError(toApiError('Failed to decode gateway response body')),
					),
		),
	);
