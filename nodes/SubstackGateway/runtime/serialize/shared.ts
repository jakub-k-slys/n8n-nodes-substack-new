export const optional = <T>(key: string, value: T | undefined): Record<string, T> =>
	value === undefined ? {} : { [key]: value };
