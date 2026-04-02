import type { PostCommand } from '../../domain/command';
import type { GatewayHttpRequest } from '../../domain/http';
import type { GatewayUrl } from '../../schema';

export const buildPostRequest = (
	gatewayUrl: GatewayUrl,
	command: PostCommand,
): GatewayHttpRequest => {
	switch (command._tag) {
		case 'Get':
			return {
				method: 'GET',
				url: `${gatewayUrl}/posts/${command.postId}`,
				responseMode: 'single',
			};
		case 'GetComments':
			return {
				method: 'GET',
				url: `${gatewayUrl}/posts/${command.postId}/comments`,
				responseMode: 'items',
			};
	}
};
