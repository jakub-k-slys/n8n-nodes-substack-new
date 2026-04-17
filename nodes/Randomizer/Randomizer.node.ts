import type {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import {
	defaultMonthDays,
	defaultWeekdays,
	evaluateRandomizerSchedules,
	previewRandomizerSchedules,
	readRandomizerState,
	sanitizeMonthDays,
	sanitizeWeekdays,
	type RandomizerPeriodicity,
	type RandomizerSchedule,
	validateSchedule,
} from '../shared/randomizer';

type RandomizerScheduleInput = {
	readonly name?: string;
	readonly periodicity?: RandomizerPeriodicity;
	readonly windowStart?: string;
	readonly windowEnd?: string;
	readonly occurrences?: number;
	readonly weekdays?: unknown;
	readonly monthDays?: string;
	readonly minimumSpacingMinutes?: number;
};

type RandomizerScheduleCollection = {
	readonly schedule?: RandomizerScheduleInput[];
};

export class Randomizer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Randomizer',
		name: 'randomizer',
		icon: {
			light: 'file:../SubstackGateway/substackGateway.svg',
			dark: 'file:../SubstackGateway/substackGateway.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		description: 'Fire random UTC trigger events inside configured schedule windows',
		defaults: {
			name: 'Randomizer',
		},
		usableAsTool: true,
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Schedules',
				name: 'schedules',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Schedule',
				default: {
					schedule: [
						{
							name: 'Daily Window',
							periodicity: 'daily',
							windowStart: '10:00',
							windowEnd: '13:17',
							occurrences: 3,
							weekdays: [...defaultWeekdays],
							monthDays: defaultMonthDays.join(','),
							minimumSpacingMinutes: 0,
						},
					],
				},
				options: [
					{
						name: 'schedule',
						displayName: 'Schedule',
						values: [
							{
								displayName: 'Minimum Spacing Minutes',
								name: 'minimumSpacingMinutes',
								type: 'number',
								typeOptions: {
									minValue: 0,
								},
								default: 0,
								description: 'Minimum number of minutes between random fires inside the same window',
							},
							{
								displayName: 'Month Days',
								name: 'monthDays',
								type: 'string',
								default: defaultMonthDays.join(','),
								displayOptions: {
									show: {
										periodicity: ['monthly'],
									},
								},
								description: 'Comma-separated UTC month days from 1 to 31',
							},
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								required: true,
								default: '',
								description: 'Friendly schedule name included in emitted items',
							},
							{
								displayName: 'Occurrences',
								name: 'occurrences',
								type: 'number',
								required: true,
								typeOptions: {
									minValue: 1,
								},
								default: 3,
								description: 'How many random fires to create inside each matching window',
							},
							{
								displayName: 'Periodicity',
								name: 'periodicity',
								type: 'options',
								noDataExpression: true,
								default: 'daily',
								options: [
									{
										name: 'Daily',
										value: 'daily',
									},
									{
										name: 'Weekly',
										value: 'weekly',
									},
									{
										name: 'Monthly',
										value: 'monthly',
									},
								],
								description: 'How often to create a fresh random window in UTC',
							},
							{
								displayName: 'Weekdays',
								name: 'weekdays',
								type: 'multiOptions',
								default: [...defaultWeekdays],
								displayOptions: {
									show: {
										periodicity: ['weekly'],
									},
								},
								options: [
									{ name: 'Friday', value: 'friday' },
									{ name: 'Monday', value: 'monday' },
									{ name: 'Saturday', value: 'saturday' },
									{ name: 'Sunday', value: 'sunday' },
									{ name: 'Thursday', value: 'thursday' },
									{ name: 'Tuesday', value: 'tuesday' },
									{ name: 'Wednesday', value: 'wednesday' },
								],
								description: 'UTC weekdays to use for weekly schedules',
							},
							{
								displayName: 'Window End',
								name: 'windowEnd',
								type: 'string',
								required: true,
								default: '13:17',
								description: 'UTC window end in HH:mm format',
							},
							{
								displayName: 'Window Start',
								name: 'windowStart',
								type: 'string',
								required: true,
								default: '10:00',
								description: 'UTC window start in HH:mm format',
							},
						],
					},
				],
				description: 'UTC schedules that generate random fire times inside each configured window',
			},
		],
	};

	poll = async function (
		this: IPollFunctions,
	): Promise<INodeExecutionData[][] | null> {
		const schedules = getSchedules(this);
		const now = new Date();

		if (this.getMode() === 'manual') {
			const previewItems = previewRandomizerSchedules(now, schedules).map((occurrence) => ({
				json: {
					...occurrence,
					preview: true,
				},
			}));

			return previewItems.length === 0 ? null : [previewItems];
		}

		const pollState = this.getWorkflowStaticData('node') as JsonObject;
		const currentState = readRandomizerState(pollState.randomizer);
		const evaluation = evaluateRandomizerSchedules(now, schedules, currentState);

		pollState.randomizer = evaluation.state as unknown as JsonObject;

		const items = evaluation.emitted.map((occurrence) => ({
			json: occurrence,
		}));

		return items.length === 0 ? null : [items];
	};
}

const getSchedules = (context: IPollFunctions): readonly RandomizerSchedule[] => {
	const input = context.getNodeParameter('schedules') as RandomizerScheduleCollection;
	const schedules = input.schedule ?? [];

	if (schedules.length === 0) {
		throw new NodeOperationError(context.getNode(), 'At least one schedule is required');
	}

	try {
		return schedules.map((schedule, index) =>
			validateSchedule({
				key: `schedule-${index}`,
				name: String(schedule.name ?? '').trim(),
				periodicity: schedule.periodicity ?? 'daily',
				windowStart: String(schedule.windowStart ?? ''),
				windowEnd: String(schedule.windowEnd ?? ''),
				occurrences: Number(schedule.occurrences ?? 0),
				weekdays: sanitizeWeekdays(schedule.weekdays),
				monthDays: sanitizeMonthDays(String(schedule.monthDays ?? '')),
				minimumSpacingMinutes: Number(schedule.minimumSpacingMinutes ?? 0),
			}),
		);
	} catch (error) {
		throw new NodeOperationError(context.getNode(), error as Error);
	}
};
