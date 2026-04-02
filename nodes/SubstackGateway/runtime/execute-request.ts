import { Effect } from 'effect';
import type { IExecuteFunctions } from 'n8n-workflow';

import type { GatewayError } from '../domain/error';
import type { GatewayHttpRequest } from '../domain/http';

export const executeGatewayRequest = (
	context: IExecuteFunctions,
	request: GatewayHttpRequest,
): Effect.Effect<unknown, GatewayError> =>
	Effect.tryPromise({
		try: async () => {
			if (request.responseMode === 'empty') {
				await context.helpers.httpRequestWithAuthentication.call(context, 'substackGatewayApi', {
					json: true,
					method: request.method,
					url: request.url,
					...(request.qs !== undefined ? { qs: request.qs } : {}),
					...(request.body !== undefined ? { body: request.body } : {}),
				});

				return request.emptyResponseBody ?? {};
			}

			return await context.helpers.httpRequestWithAuthentication.call(
				context,
				'substackGatewayApi',
				{
					json: true,
					method: request.method,
					url: request.url,
					...(request.qs !== undefined ? { qs: request.qs } : {}),
					...(request.body !== undefined ? { body: request.body } : {}),
				},
			);
		},
		catch: (cause) => ({
			_tag: 'ApiError',
			message: cause instanceof Error ? cause.message : 'Gateway request failed',
			cause,
		}),
	});
