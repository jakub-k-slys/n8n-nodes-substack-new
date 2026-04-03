import { Match } from 'effect';
import type { IDataObject } from 'n8n-workflow';

import type { GatewayResult } from '../../../domain/result';
import { toJsonCreatedNote, toJsonDeletedNote, toJsonNote } from '../../serialize/model';

export const noteResultToJson = (
	result: GatewayResult & { readonly _tag: 'Note' },
): ReadonlyArray<IDataObject> =>
	Match.value(result.result).pipe(
		Match.when({ _tag: 'Created' }, ({ item }) => [toJsonCreatedNote(item)]),
		Match.when({ _tag: 'Fetched' }, ({ item }) => [toJsonNote(item)]),
		Match.when({ _tag: 'Deleted' }, ({ item }) => [toJsonDeletedNote(item)]),
		Match.exhaustive,
	);
