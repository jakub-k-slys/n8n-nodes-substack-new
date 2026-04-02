import type { ProfileCommand } from '../../domain/command';
import type { GatewayHttpRequest } from '../../domain/http';
import type { GatewayUrl } from '../../schema';

export const buildProfileRequest = (
	gatewayUrl: GatewayUrl,
	command: ProfileCommand,
): GatewayHttpRequest => {
	switch (command._tag) {
		case 'Get':
			return {
				method: 'GET',
				url: `${gatewayUrl}/profiles/${command.profileSlug}`,
				responseMode: 'single',
			};
		case 'GetNotes':
			return {
				method: 'GET',
				url: `${gatewayUrl}/profiles/${command.profileSlug}/notes`,
				qs: command.cursor === undefined ? undefined : { cursor: command.cursor },
				responseMode: 'items',
			};
		case 'GetPosts':
			return {
				method: 'GET',
				url: `${gatewayUrl}/profiles/${command.profileSlug}/posts`,
				qs: { limit: command.limit, offset: command.offset },
				responseMode: 'items',
			};
	}
};
