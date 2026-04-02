import { Either, Match } from 'effect';
import type { GatewayCommand } from '../domain/command';
import type { GatewayError } from '../domain/error';
import type { GatewayResult } from '../domain/result';
import { decodeDraftResponse } from './decode-response/draft';
import { decodeNoteResponse } from './decode-response/note';
import { decodeOwnPublicationResponse } from './decode-response/own-publication';
import { decodePostResponse } from './decode-response/post';
import { decodeProfileResponse } from './decode-response/profile';

export const decodeGatewayResponse = (
	command: GatewayCommand,
	response: unknown,
): Either.Either<GatewayResult, GatewayError> =>
	Match.value(command).pipe(
		Match.when({ _tag: 'OwnPublication' }, ({ command }) =>
			decodeOwnPublicationResponse(command, response),
		),
		Match.when({ _tag: 'Note' }, ({ command }) => decodeNoteResponse(command, response)),
		Match.when({ _tag: 'Draft' }, ({ command }) => decodeDraftResponse(command, response)),
		Match.when({ _tag: 'Post' }, ({ command }) => decodePostResponse(command, response)),
		Match.when({ _tag: 'Profile' }, ({ command }) => decodeProfileResponse(command, response)),
		Match.exhaustive,
	);
