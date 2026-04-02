import { Either } from 'effect';
import * as Schema from 'effect/Schema';

import type { GatewayError } from '../../domain/error';

export const decodeInput = <A, I, R>(
	schema: Schema.Schema<A, I, R>,
	input: unknown,
): Either.Either<A, GatewayError> => {
	const decoded = Schema.decodeUnknownEither(schema as Schema.Schema<A, I>)(input);

	return Either.mapLeft(decoded, (cause) => ({
		_tag: 'ParameterDecodeError',
		message: 'Invalid node parameters',
		cause,
	}));
};
