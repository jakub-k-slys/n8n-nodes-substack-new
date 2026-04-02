import type { INodeProperties } from 'n8n-workflow';

export const ownPublicationOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'ownProfile',
	displayOptions: {
		show: {
			resource: ['ownPublication'],
		},
	},
	options: [
		{
			name: 'Own Following',
			value: 'ownFollowing',
			action: 'Get own following',
			description: 'Get the accounts followed by the authenticated user',
		},
		{
			name: 'Own Notes',
			value: 'ownNotes',
			action: 'Get own notes',
			description: 'Get notes from the authenticated user',
		},
		{
			name: 'Own Posts',
			value: 'ownPosts',
			action: 'Get own posts',
			description: 'Get posts from the authenticated user',
		},
		{
			name: 'Own Profile',
			value: 'ownProfile',
			action: 'Get own profile',
			description: 'Get the authenticated user profile from Substack Gateway',
		},
	],
};
