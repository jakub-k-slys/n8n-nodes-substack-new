import type { INodeProperties } from 'n8n-workflow';

export const postOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'getPost',
	displayOptions: {
		show: {
			resource: ['post'],
		},
	},
	options: [
		{
			name: 'Get',
			value: 'getPost',
			action: 'Get a post',
		},
		{
			name: 'Get Comments',
			value: 'getPostComments',
			action: 'Get comments for a post',
		},
	],
};
