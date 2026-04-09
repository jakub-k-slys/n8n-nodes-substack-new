import type { INodeExecutionData } from 'n8n-workflow';

import type { AtomFeedEntry } from './model';

const parseStructuredEntryId = (
	entryId: string | undefined,
): {
	readonly id: number | string | null;
	readonly type: string | null;
} => {
	if (entryId === undefined) {
		return {
			id: null,
			type: null,
		};
	}

	const [type, rawId, ...rest] = entryId.split(':');

	if (rawId === undefined || rest.length > 0 || type.length === 0 || rawId.length === 0) {
		return {
			id: entryId,
			type: null,
		};
	}

	return {
		id: /^\d+$/.test(rawId) ? Number(rawId) : rawId,
		type,
	};
};

export const toNodeExecutionData = (
	entries: readonly AtomFeedEntry[],
): INodeExecutionData[] =>
	entries.map((entry) => {
		const structuredEntryId = parseStructuredEntryId(entry.id);

		return {
			json: {
			id: structuredEntryId.id,
			type: structuredEntryId.type,
			title: entry.title ?? null,
			link: entry.link ?? null,
			updated: entry.updated ?? null,
			published: entry.published ?? null,
			author: entry.author ?? null,
			summary: entry.summary ?? null,
			content: entry.content ?? null,
		},
		};
	});
