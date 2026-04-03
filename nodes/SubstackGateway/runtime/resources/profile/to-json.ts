import { Match } from 'effect';
import type { IDataObject } from 'n8n-workflow';

import type { GatewayResult } from '../../../domain/result';
import { toJsonNote, toJsonPostSummary, toJsonProfile } from '../../serialize/model';

export const profileResultToJson = (
	result: GatewayResult & { readonly _tag: 'Profile' },
): ReadonlyArray<IDataObject> =>
	Match.value(result.result).pipe(
		Match.when({ _tag: 'Fetched' }, ({ item }) => [toJsonProfile(item)]),
		Match.when({ _tag: 'Notes' }, ({ items }) => items.map(toJsonNote)),
		Match.when({ _tag: 'Posts' }, ({ items }) => items.map(toJsonPostSummary)),
		Match.exhaustive,
	);
