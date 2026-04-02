import { Effect, Match } from 'effect';
import type { IExecuteFunctions } from 'n8n-workflow';

import type { GatewayCommand } from '../domain/command';
import type { GatewayError } from '../domain/error';
import type {
	DraftInput,
	NoteInput,
	OwnPublicationInput,
	PostInput,
	ProfileInput,
} from '../domain/input';
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
				Effect.flatMap(readGatewayInput(context, itemIndex, decodedOperation), (input) =>
					Match.value(decodedOperation).pipe(
						Match.when({ _tag: 'OwnPublication' }, () =>
							Effect.succeed({
								_tag: 'OwnPublication',
								command: decodeOwnPublicationCommand(input as OwnPublicationInput),
							} as const),
						),
						Match.when({ _tag: 'Note' }, () =>
							Effect.map(decodeNoteCommand(input as NoteInput), (command) => ({
								_tag: 'Note',
								command,
							} as const)),
						),
						Match.when({ _tag: 'Draft' }, () =>
							Effect.map(decodeDraftCommand(input as DraftInput), (command) => ({
								_tag: 'Draft',
								command,
							} as const)),
						),
						Match.when({ _tag: 'Post' }, () =>
							Effect.map(decodePostCommand(input as PostInput), (command) => ({
								_tag: 'Post',
								command,
							} as const)),
						),
						Match.when({ _tag: 'Profile' }, () =>
							Effect.map(decodeProfileCommand(input as ProfileInput), (command) => ({
								_tag: 'Profile',
								command,
							} as const)),
						),
						Match.exhaustive,
					),
				),
			),
		),
	);
