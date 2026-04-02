import type { INodeProperties } from 'n8n-workflow';

export const profileFields: INodeProperties[] = [
	{
		displayName: 'Profile Slug',
		name: 'profileSlug',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['getProfile', 'getProfileNotes', 'getProfilePosts'],
			},
		},
		description: 'The Substack profile slug or handle',
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['getProfileNotes'],
			},
		},
		description: 'Pagination cursor returned by a previous notes request',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
			numberPrecision: 0,
		},
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['getProfilePosts'],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		typeOptions: {
			minValue: 0,
			numberPrecision: 0,
		},
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['getProfilePosts'],
			},
		},
		description: 'Number of posts to skip',
	},
];
