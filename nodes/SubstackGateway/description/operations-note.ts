import type { INodeProperties } from 'n8n-workflow';

export const noteOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'createNote',
	displayOptions: {
		show: {
			resource: ['note'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'createNote',
			action: 'Create a note',
		},
		{
			name: 'Delete',
			value: 'deleteNote',
			action: 'Delete a note',
		},
		{
			name: 'Get',
			value: 'getNote',
			action: 'Get a note',
		},
	],
};
