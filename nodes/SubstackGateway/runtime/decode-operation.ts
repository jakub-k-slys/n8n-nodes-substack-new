import { Either } from 'effect';

import {
	buildGatewayOperation,
	gatewayResourceCatalogByResource,
	type GatewayOperation,
	type GatewayResource,
} from '../domain/operation';
import type { GatewayError } from '../domain/error';

const unsupported = (resource: string, operation: string): GatewayError =>
	({
		_tag: 'UnsupportedOperation',
		resource,
		operation,
	}) satisfies GatewayError;

const hasResource = (resource: string): resource is GatewayResource =>
	resource in gatewayResourceCatalogByResource;

export const decodeGatewayOperation = (
	resource: string,
	operation: string,
): Either.Either<GatewayOperation, GatewayError> => {
	if (!hasResource(resource)) {
		return Either.left(unsupported(resource, operation));
	}

	const definition = gatewayResourceCatalogByResource[resource];
	const supportedOperation = definition.operations.find(
		(candidate) => candidate.value === operation,
	)?.value;

	return supportedOperation === undefined
		? Either.left(unsupported(resource, operation))
		: Either.right(buildGatewayOperation(resource, supportedOperation));
};
