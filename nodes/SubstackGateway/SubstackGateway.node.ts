import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	default: 'ownPublication',
	options: [
		{
			name: 'Own Publication',
			value: 'ownPublication',
		},
	],
};

const ownPublicationOperationOptions: INodeProperties = {
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
			name: 'Own Profile',
			value: 'ownProfile',
			action: 'Get own profile',
			description: 'Get the authenticated user profile from Substack Gateway',
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
			name: 'Own Following',
			value: 'ownFollowing',
			action: 'Get own following',
			description: 'Get the accounts followed by the authenticated user',
		},
	],
};

export class SubstackGateway implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Substack Gateway',
		name: 'substackGateway',
		icon: { light: 'file:substackGateway.svg', dark: 'file:substackGateway.dark.svg' },
		group: ['input'],
		version: [1],
		description: 'Interact with the Substack Gateway API',
		defaults: {
			name: 'Substack Gateway',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'substackGatewayApi',
				required: true,
			},
		],
		properties: [resourceOptions, ownPublicationOperationOptions],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('substackGatewayApi');
		const gatewayUrl = String(credentials.gatewayUrl ?? '').replace(/\/+$/, '');
		const gatewayToken = String(credentials.gatewayToken ?? '');

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				if (resource !== 'ownPublication') {
					throw new NodeOperationError(this.getNode(), `Unsupported resource: ${resource}`, {
						itemIndex,
					});
				}

				const baseRequest = {
					method: 'GET' as const,
					json: true,
					headers: {
						'x-gateway-token': gatewayToken,
					},
				};

				if (operation === 'ownProfile') {
					const response = (await this.helpers.httpRequest({
						...baseRequest,
						url: `${gatewayUrl}/me`,
					})) as IDataObject;

					returnData.push({
						json: response,
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				if (operation === 'ownNotes') {
					const response = (await this.helpers.httpRequest({
						...baseRequest,
						url: `${gatewayUrl}/me/notes`,
					})) as IDataObject;
					const notes = Array.isArray(response.items) ? response.items : [];

					for (const note of notes) {
						returnData.push({
							json: note as IDataObject,
							pairedItem: { item: itemIndex },
						});
					}
					continue;
				}

				if (operation === 'ownPosts') {
					const response = (await this.helpers.httpRequest({
						...baseRequest,
						url: `${gatewayUrl}/me/posts`,
					})) as IDataObject;
					const posts = Array.isArray(response.items) ? response.items : [];

					for (const post of posts) {
						returnData.push({
							json: post as IDataObject,
							pairedItem: { item: itemIndex },
						});
					}
					continue;
				}

				if (operation === 'ownFollowing') {
					const response = (await this.helpers.httpRequest({
						...baseRequest,
						url: `${gatewayUrl}/me/following`,
					})) as IDataObject;
					const following = Array.isArray(response.items) ? response.items : [];

					for (const followedAccount of following) {
						returnData.push({
							json: followedAccount as IDataObject,
							pairedItem: { item: itemIndex },
						});
					}
					continue;
				}

				throw new NodeOperationError(
					this.getNode(),
					`Unsupported resource/operation combination: ${resource}/${operation}`,
					{ itemIndex },
				);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error',
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				if (error instanceof NodeOperationError) {
					throw error;
				}

				throw new NodeOperationError(
					this.getNode(),
					error instanceof Error ? error : new Error('Unknown error'),
					{ itemIndex },
				);
			}
		}

		return [returnData];
	}
}
