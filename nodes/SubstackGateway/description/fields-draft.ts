import type { INodeProperties } from 'n8n-workflow';

export const draftFields: INodeProperties[] = [
	{
		displayName: 'Draft ID',
		name: 'draftId',
		type: 'number',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['draft'],
				operation: ['deleteDraft', 'getDraft', 'updateDraft'],
			},
		},
		description: 'The numeric ID of the draft',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['draft'],
				operation: ['createDraft', 'updateDraft'],
			},
		},
		description: 'Draft title',
	},
	{
		displayName: 'Subtitle',
		name: 'subtitle',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['draft'],
				operation: ['createDraft', 'updateDraft'],
			},
		},
		description: 'Draft subtitle',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		default: '',
		typeOptions: {
			rows: 8,
		},
		displayOptions: {
			show: {
				resource: ['draft'],
				operation: ['createDraft', 'updateDraft'],
			},
		},
		description: 'Draft body content',
	},
];
