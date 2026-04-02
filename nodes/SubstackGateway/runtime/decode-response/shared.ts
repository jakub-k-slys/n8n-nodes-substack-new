import { Either } from 'effect';
import * as Schema from 'effect/Schema';
import type { IDataObject } from 'n8n-workflow';

import type { GatewayError } from '../../domain/error';

export const decodeResponseSchema = <A, I, R>(
	schema: Schema.Schema<A, I, R>,
	input: unknown,
): Either.Either<A, GatewayError> => {
	const decoded = Schema.decodeUnknownEither(schema as Schema.Schema<A, I>)(input);

	return Either.mapLeft(decoded, (cause) => ({
		_tag: 'ResponseDecodeError',
		message: 'Invalid gateway response',
		cause,
	}));
};

export const singleItem = (item: unknown): IDataObject => item as IDataObject;

export const manyItems = (items: ReadonlyArray<unknown>): ReadonlyArray<IDataObject> =>
	items as IDataObject[];
