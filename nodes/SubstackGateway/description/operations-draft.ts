import type { INodeProperties } from 'n8n-workflow';

export const draftOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'listDrafts',
	displayOptions: {
		show: {
			resource: ['draft'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'createDraft',
			action: 'Create a draft',
		},
		{
			name: 'Delete',
			value: 'deleteDraft',
			action: 'Delete a draft',
		},
		{
			name: 'Get',
			value: 'getDraft',
			action: 'Get a draft',
		},
		{
			name: 'Get Many',
			value: 'listDrafts',
			action: 'Get many drafts',
		},
		{
			name: 'Update',
			value: 'updateDraft',
			action: 'Update a draft',
		},
	],
};
