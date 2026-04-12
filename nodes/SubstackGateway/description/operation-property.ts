import type { INodeProperties } from 'n8n-workflow';

import {
	gatewayResourceCatalogByResource,
	getOperationDescription,
	type GatewayResource,
} from '../domain/operation';

export const createOperationProperty = <Resource extends GatewayResource>(
	resource: Resource,
): INodeProperties => {
	const definition = gatewayResourceCatalogByResource[resource];

	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	return {
		displayName: 'Operation Name or ID',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: definition.defaultOperation,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: [resource],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getGatewayOperations',
			loadOptionsDependsOn: ['resource'],
		},
		options: definition.operations.map((operation) => ({
			name: operation.name,
			value: operation.value,
			action: operation.action,
			...(getOperationDescription(resource, operation.value) === undefined
				? {}
				: { description: getOperationDescription(resource, operation.value) }),
		})),
	};
};
