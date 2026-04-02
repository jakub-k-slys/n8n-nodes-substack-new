import { Either } from 'effect';
import * as Schema from 'effect/Schema';

import type { GatewayError } from '../../domain/error';

export const decodeInput = <A, I, R>(schema: Schema.Schema<A, I, R>, input: unknown): A => {
	const decoded = Schema.decodeUnknownEither(schema as Schema.Schema<A, I>)(input);

	if (Either.isRight(decoded)) {
		return decoded.right;
	}

	throw {
		_tag: 'ParameterDecodeError',
		message: 'Invalid node parameters',
		cause: decoded.left,
	} satisfies GatewayError;
};
