import type { INodeProperties } from 'n8n-workflow';

import { gatewayResourceCatalog, getOperationDescription } from '../domain/operation';

export const operationProperty: INodeProperties = {
	displayName: 'Operation Name or ID',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'ownProfile',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getGatewayOperations',
		loadOptionsDependsOn: ['resource'],
	},
	options: gatewayResourceCatalog.flatMap((resource) =>
		resource.operations.map((operation) => ({
			name: operation.name,
			value: operation.value,
			action: operation.action,
			...(getOperationDescription(resource.resource, operation.value) === undefined
				? {}
				: { description: getOperationDescription(resource.resource, operation.value) }),
		})),
	),
};
