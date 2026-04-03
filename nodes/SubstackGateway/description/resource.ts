import type { INodeProperties } from 'n8n-workflow';
import { gatewayResourceCatalog } from '../domain/operation';

export const resourceProperty: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	default: 'ownPublication',
	options: gatewayResourceCatalog.map((definition) => ({
		name: definition.name,
		value: definition.resource,
	})),
};
