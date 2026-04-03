import { Match } from 'effect';
import type { IDataObject } from 'n8n-workflow';

import type { GatewayResult } from '../../../domain/result';
import { toJsonComment, toJsonPost } from '../../serialize/model';

export const postResultToJson = (
	result: GatewayResult & { readonly _tag: 'Post' },
): ReadonlyArray<IDataObject> =>
	Match.value(result.result).pipe(
		Match.when({ _tag: 'Fetched' }, ({ item }) => [toJsonPost(item)]),
		Match.when({ _tag: 'Comments' }, ({ items }) => items.map(toJsonComment)),
		Match.exhaustive,
	);
