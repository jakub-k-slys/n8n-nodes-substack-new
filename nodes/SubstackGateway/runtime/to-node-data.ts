import type { INodeExecutionData } from 'n8n-workflow';

import type { GatewayResult } from '../domain/result';

export const toNodeExecutionData = (
	itemIndex: number,
	result: GatewayResult,
): INodeExecutionData[] =>
	(result._tag === 'Single' ? [result.item] : [...result.items]).map((json) => ({
		json,
		pairedItem: { item: itemIndex },
	}));
