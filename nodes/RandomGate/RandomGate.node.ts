import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import {
	createMulberry32,
	normalizeThreshold,
	resolveSeed,
	shouldPass,
	type RandomNumberGenerator,
} from '../shared/random-gate';

export class RandomGate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Random Gate',
		name: 'randomGate',
		icon: {
			light: 'file:../SubstackGateway/substackGateway.svg',
			dark: 'file:../SubstackGateway/substackGateway.dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["passThroughPercent"] + "%"}}',
		description:
			'Probabilistically forward each input item. 0 always drops, 100 always passes, values in between roll per item.',
		defaults: {
			name: 'Random Gate',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Pass-Through Percent',
				name: 'passThroughPercent',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				default: 100,
				description:
					'Probability (0-100) that an input item is forwarded. 0 drops every item and ends the branch, 100 always forwards.',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Seed',
						name: 'seed',
						type: 'string',
						default: '',
						description:
							'Optional deterministic seed. Leave empty to use a non-deterministic random source.',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const thresholdRaw = this.getNodeParameter('passThroughPercent', 0, 100);
		const threshold = normalizeThreshold(thresholdRaw);
		const additionalOptions = this.getNodeParameter('additionalOptions', 0, {}) as {
			seed?: unknown;
		};
		const seed = resolveSeed(additionalOptions.seed);
		const rng: RandomNumberGenerator =
			seed === undefined ? Math.random : createMulberry32(seed);

		const passed: INodeExecutionData[] = [];

		for (let index = 0; index < items.length; index += 1) {
			const item = items[index];

			try {
				if (shouldPass(threshold, rng)) {
					passed.push(item);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					passed.push({
						json: {
							error: error instanceof Error ? error.message : String(error),
						},
						pairedItem: { item: index },
					});
					continue;
				}

				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: index });
			}
		}

		return [passed];
	}
}
