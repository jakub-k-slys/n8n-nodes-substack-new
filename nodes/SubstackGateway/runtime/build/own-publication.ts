import type { OwnPublicationCommand } from '../../domain/command';
import type { GatewayHttpRequest } from '../../domain/http';

export const buildOwnPublicationRequest = (
	gatewayUrl: string,
	command: OwnPublicationCommand,
): GatewayHttpRequest => {
	switch (command._tag) {
		case 'OwnProfile':
			return { method: 'GET', url: `${gatewayUrl}/me`, responseMode: 'single' };
		case 'OwnNotes':
			return { method: 'GET', url: `${gatewayUrl}/me/notes`, responseMode: 'items' };
		case 'OwnPosts':
			return { method: 'GET', url: `${gatewayUrl}/me/posts`, responseMode: 'items' };
		case 'OwnFollowing':
			return { method: 'GET', url: `${gatewayUrl}/me/following`, responseMode: 'items' };
	}
};
