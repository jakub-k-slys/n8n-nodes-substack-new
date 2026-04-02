import { Match } from 'effect';
import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

import type { GatewayResult } from '../domain/result';

const asItems = <T extends { readonly item: unknown } | { readonly items: ReadonlyArray<unknown> }>(
	result: T,
): ReadonlyArray<IDataObject> =>
	'item' in result
		? [result.item as IDataObject]
		: (result.items as ReadonlyArray<IDataObject>);

const toItems = (result: GatewayResult): ReadonlyArray<IDataObject> =>
	Match.value(result).pipe(
		Match.when({ _tag: 'OwnPublication' }, ({ result }) => asItems(result)),
		Match.when({ _tag: 'Note' }, ({ result }) => asItems(result)),
		Match.when({ _tag: 'Draft' }, ({ result }) => asItems(result)),
		Match.when({ _tag: 'Post' }, ({ result }) => asItems(result)),
		Match.when({ _tag: 'Profile' }, ({ result }) => asItems(result)),
		Match.exhaustive,
	);

export const toNodeExecutionData = (
	itemIndex: number,
	result: GatewayResult,
): INodeExecutionData[] =>
	toItems(result).map((json) => ({
		json,
		pairedItem: { item: itemIndex },
	}));
