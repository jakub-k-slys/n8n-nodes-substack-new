import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

import type { GatewayResult } from '../domain/result';

const toItems = (result: GatewayResult): ReadonlyArray<IDataObject> => {
	switch (result._tag) {
		case 'OwnPublication':
			return 'item' in result.result
				? [result.result.item as IDataObject]
				: (result.result.items as ReadonlyArray<IDataObject>);
		case 'Note':
			return [result.result.item as IDataObject];
		case 'Draft':
			return 'item' in result.result
				? [result.result.item as IDataObject]
				: (result.result.items as ReadonlyArray<IDataObject>);
		case 'Post':
			return 'item' in result.result
				? [result.result.item as IDataObject]
				: (result.result.items as ReadonlyArray<IDataObject>);
		case 'Profile':
			return 'item' in result.result
				? [result.result.item as IDataObject]
				: (result.result.items as ReadonlyArray<IDataObject>);
	}
};

export const toNodeExecutionData = (
	itemIndex: number,
	result: GatewayResult,
): INodeExecutionData[] =>
	toItems(result).map((json) => ({
		json,
		pairedItem: { item: itemIndex },
	}));
