import type { INodeProperties } from 'n8n-workflow';

export const resourceProperty: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	default: 'ownPublication',
	options: [
		{
			name: 'Draft',
			value: 'draft',
		},
		{
			name: 'Note',
			value: 'note',
		},
		{
			name: 'Own Publication',
			value: 'ownPublication',
		},
		{
			name: 'Post',
			value: 'post',
		},
		{
			name: 'Profile',
			value: 'profile',
		},
	],
};
