import { Match } from 'effect';

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
): GatewayHttpRequest =>
	Match.value(command).pipe(
		Match.when({ _tag: 'OwnPublication' }, ({ command }) =>
			buildOwnPublicationRequest(gatewayUrl, command),
		),
		Match.when({ _tag: 'Note' }, ({ command }) => buildNoteRequest(gatewayUrl, command)),
		Match.when({ _tag: 'Draft' }, ({ command }) => buildDraftRequest(gatewayUrl, command)),
		Match.when({ _tag: 'Post' }, ({ command }) => buildPostRequest(gatewayUrl, command)),
		Match.when({ _tag: 'Profile' }, ({ command }) => buildProfileRequest(gatewayUrl, command)),
		Match.exhaustive,
	);
