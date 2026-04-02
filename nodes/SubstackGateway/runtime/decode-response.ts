import { Either } from 'effect';
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
): Either.Either<GatewayResult, GatewayError> => {
	switch (command._tag) {
		case 'OwnPublication':
			return decodeOwnPublicationResponse(command.command, response);
		case 'Note':
			return decodeNoteResponse(command.command, response);
		case 'Draft':
			return decodeDraftResponse(command.command, response);
		case 'Post':
			return decodePostResponse(command.command, response);
		case 'Profile':
			return decodeProfileResponse(command.command, response);
	}
};
