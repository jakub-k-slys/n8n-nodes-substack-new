import type { GatewayCommand } from '../domain/command';
import type { GatewayHttpRequest } from '../domain/http';
import type { GatewayUrl } from '../schema';
import { buildDraftRequest } from './build/draft';
import { buildNoteRequest } from './build/note';
import { buildOwnPublicationRequest } from './build/own-publication';
import { buildPostRequest } from './build/post';
import { buildProfileRequest } from './build/profile';

export const buildGatewayRequest = (
	gatewayUrl: GatewayUrl,
	command: GatewayCommand,
): GatewayHttpRequest => {
	switch (command._tag) {
		case 'OwnPublication':
			return buildOwnPublicationRequest(gatewayUrl, command.command);
		case 'Note':
			return buildNoteRequest(gatewayUrl, command.command);
		case 'Draft':
			return buildDraftRequest(gatewayUrl, command.command);
		case 'Post':
			return buildPostRequest(gatewayUrl, command.command);
		case 'Profile':
			return buildProfileRequest(gatewayUrl, command.command);
	}
};
