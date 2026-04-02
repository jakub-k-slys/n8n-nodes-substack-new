import type { JsonObject } from 'n8n-workflow';

export type GatewayError =
	| { readonly _tag: 'UnsupportedOperation'; readonly resource: string; readonly operation: string }
	| { readonly _tag: 'ParameterDecodeError'; readonly message: string; readonly cause: unknown }
	| { readonly _tag: 'ResponseDecodeError'; readonly message: string; readonly cause: unknown }
	| { readonly _tag: 'ApiError'; readonly message: string; readonly cause: unknown }
	| { readonly _tag: 'UnexpectedError'; readonly message: string; readonly cause: unknown };

export const isGatewayError = (value: unknown): value is GatewayError =>
	typeof value === 'object' && value !== null && '_tag' in value;

export const isUnsupportedOperationError = (
	error: unknown,
): error is Extract<GatewayError, { _tag: 'UnsupportedOperation' }> =>
	isGatewayError(error) && error._tag === 'UnsupportedOperation';

export const toGatewayErrorMessage = (error: unknown): string => {
	if (!isGatewayError(error)) {
		return error instanceof Error ? error.message : 'Unknown error';
	}

	return error._tag === 'UnsupportedOperation'
		? `Unsupported resource/operation combination: ${error.resource}/${error.operation}`
		: error.message;
};

export const toGatewayApiCause = (error: unknown): JsonObject | undefined => {
	if (isGatewayError(error) && error._tag === 'ApiError') {
		return typeof error.cause === 'object' && error.cause !== null
			? (error.cause as JsonObject)
			: undefined;
	}

	return typeof error === 'object' && error !== null ? (error as JsonObject) : undefined;
};
