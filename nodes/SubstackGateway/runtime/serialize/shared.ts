import * as Schema from 'effect/Schema';

export const optional = <T>(key: string, value: T | undefined): Record<string, T> =>
	value === undefined ? {} : { [key]: value };

export const encodeJson = <A>(schema: Schema.Schema<A>) => Schema.encodeSync(schema);
