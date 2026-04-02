import { Either } from 'effect';
import * as Schema from 'effect/Schema';
import type { IDataObject } from 'n8n-workflow';

import type { GatewayError } from '../../domain/error';
import type { GatewayResult } from '../../domain/result';

export const decodeResponseSchema = <A, I, R>(
	schema: Schema.Schema<A, I, R>,
	input: unknown,
): A => {
	const decoded = Schema.decodeUnknownEither(schema as Schema.Schema<A, I>)(input);

	if (Either.isRight(decoded)) {
		return decoded.right;
	}

	throw {
		_tag: 'ResponseDecodeError',
		message: 'Invalid gateway response',
		cause: decoded.left,
	} satisfies GatewayError;
};

export const singleResult = (item: unknown): GatewayResult => ({
	_tag: 'Single',
	item: item as IDataObject,
});

export const manyResult = (items: ReadonlyArray<unknown>): GatewayResult => ({
	_tag: 'Many',
	items: items as IDataObject[],
});
