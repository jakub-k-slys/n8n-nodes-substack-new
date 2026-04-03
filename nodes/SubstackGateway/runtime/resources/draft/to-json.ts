import { Match } from 'effect';
import type { IDataObject } from 'n8n-workflow';

import type { GatewayResult } from '../../../domain/result';
import {
	toJsonCreatedDraft,
	toJsonDeletedDraft,
	toJsonDraft,
	toJsonDraftSummary,
} from '../../serialize/model';

export const draftResultToJson = (
	result: GatewayResult & { readonly _tag: 'Draft' },
): ReadonlyArray<IDataObject> =>
	Match.value(result.result).pipe(
		Match.when({ _tag: 'List' }, ({ items }) => items.map(toJsonDraftSummary)),
		Match.when({ _tag: 'Created' }, ({ item }) => [toJsonCreatedDraft(item)]),
		Match.when({ _tag: 'Fetched' }, ({ item }) => [toJsonDraft(item)]),
		Match.when({ _tag: 'Updated' }, ({ item }) => [toJsonDraft(item)]),
		Match.when({ _tag: 'Deleted' }, ({ item }) => [toJsonDeletedDraft(item)]),
		Match.exhaustive,
	);
