import { Match } from 'effect';
import type { IDataObject } from 'n8n-workflow';

import type { GatewayResult } from '../../../domain/result';
import {
	toJsonFollowingUser,
	toJsonNote,
	toJsonPostSummary,
	toJsonProfile,
} from '../../serialize/model';

export const ownPublicationResultToJson = (
	result: GatewayResult & { readonly _tag: 'OwnPublication' },
): ReadonlyArray<IDataObject> =>
	Match.value(result.result).pipe(
		Match.when({ _tag: 'Profile' }, ({ item }) => [toJsonProfile(item)]),
		Match.when({ _tag: 'Notes' }, ({ items }) => items.map(toJsonNote)),
		Match.when({ _tag: 'Posts' }, ({ items }) => items.map(toJsonPostSummary)),
		Match.when({ _tag: 'Following' }, ({ items }) => items.map(toJsonFollowingUser)),
		Match.exhaustive,
	);
