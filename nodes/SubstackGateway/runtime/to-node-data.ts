import type { INodeExecutionData } from 'n8n-workflow';

import { getGatewayResultItems, type GatewayResult } from '../domain/result';

export const toNodeExecutionData = (
	itemIndex: number,
	result: GatewayResult,
): INodeExecutionData[] =>
	getGatewayResultItems(result).map((json) => ({
		json,
		pairedItem: { item: itemIndex },
	}));
