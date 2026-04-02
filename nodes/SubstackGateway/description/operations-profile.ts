import type { INodeProperties } from 'n8n-workflow';

export const profileOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'getProfile',
	displayOptions: {
		show: {
			resource: ['profile'],
		},
	},
	options: [
		{
			name: 'Get',
			value: 'getProfile',
			action: 'Get a profile',
		},
		{
			name: 'Get Notes',
			value: 'getProfileNotes',
			action: 'Get notes for a profile',
		},
		{
			name: 'Get Posts',
			value: 'getProfilePosts',
			action: 'Get posts for a profile',
		},
	],
};
