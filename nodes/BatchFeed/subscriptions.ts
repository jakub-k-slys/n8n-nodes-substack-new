import { createHash } from 'node:crypto';

export const canonicalizeSubscriptions = (handles: readonly string[]): string[] => {
	const seen = new Set<string>();
	const result: string[] = [];

	for (const raw of handles) {
		const trimmed = raw.trim();

		if (trimmed.length === 0 || seen.has(trimmed)) {
			continue;
		}

		seen.add(trimmed);
		result.push(trimmed);
	}

	return result.sort((left, right) => left.localeCompare(right));
};

export const hashSubscriptions = (canonicalSubscriptions: readonly string[]): string =>
	createHash('sha256').update(JSON.stringify(canonicalSubscriptions)).digest('hex');
