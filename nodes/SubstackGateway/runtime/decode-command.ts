import { Effect, Match } from 'effect';
import type { IExecuteFunctions } from 'n8n-workflow';

import type { GatewayCommand } from '../domain/command';
import type { GatewayError } from '../domain/error';
import { decodeDraftCommand } from './decode/draft';
import { decodeNoteCommand } from './decode/note';
import { decodeOwnPublicationCommand } from './decode/own-publication';
import { decodePostCommand } from './decode/post';
import { decodeProfileCommand } from './decode/profile';
import { decodeGatewayOperation } from './decode-operation';
import { readGatewayInput, readGatewaySelection } from './read-input';

export const decodeGatewayCommand = (
	context: IExecuteFunctions,
	itemIndex: number,
): Effect.Effect<GatewayCommand, GatewayError> =>
	readGatewaySelection(context, itemIndex).pipe(
		Effect.flatMap(({ resource, operation }) =>
			Effect.flatMap(decodeGatewayOperation(resource, operation), (decodedOperation) =>
				Match.value(decodedOperation).pipe(
					Match.when({ _tag: 'OwnPublication' }, (decodedOperation) =>
						Effect.map(readGatewayInput(context, itemIndex, decodedOperation), (input) => ({
							_tag: 'OwnPublication',
							command: decodeOwnPublicationCommand(input),
						} as const)),
					),
					Match.when({ _tag: 'Note' }, (decodedOperation) =>
						Effect.flatMap(readGatewayInput(context, itemIndex, decodedOperation), (input) =>
							Effect.map(decodeNoteCommand(input), (command) => ({
								_tag: 'Note',
								command,
							} as const)),
						),
					),
					Match.when({ _tag: 'Draft' }, (decodedOperation) =>
						Effect.flatMap(readGatewayInput(context, itemIndex, decodedOperation), (input) =>
							Effect.map(decodeDraftCommand(input), (command) => ({
								_tag: 'Draft',
								command,
							} as const)),
						),
					),
					Match.when({ _tag: 'Post' }, (decodedOperation) =>
						Effect.flatMap(readGatewayInput(context, itemIndex, decodedOperation), (input) =>
							Effect.map(decodePostCommand(input), (command) => ({
								_tag: 'Post',
								command,
							} as const)),
						),
					),
					Match.when({ _tag: 'Profile' }, (decodedOperation) =>
						Effect.flatMap(readGatewayInput(context, itemIndex, decodedOperation), (input) =>
							Effect.map(decodeProfileCommand(input), (command) => ({
								_tag: 'Profile',
								command,
							} as const)),
						),
					),
					Match.exhaustive,
				),
			),
		),
	);
