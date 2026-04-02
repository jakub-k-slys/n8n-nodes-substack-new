import type { DraftCommand } from '../../domain/command';
import type { GatewayHttpRequest } from '../../domain/http';

export const buildDraftRequest = (
	gatewayUrl: string,
	command: DraftCommand,
): GatewayHttpRequest => {
	switch (command._tag) {
		case 'List':
			return { method: 'GET', url: `${gatewayUrl}/drafts`, responseMode: 'items' };
		case 'Create':
			return {
				method: 'POST',
				url: `${gatewayUrl}/drafts`,
				body: { title: command.title, subtitle: command.subtitle, body: command.body },
				responseMode: 'single',
			};
		case 'Get':
			return {
				method: 'GET',
				url: `${gatewayUrl}/drafts/${command.draftId}`,
				responseMode: 'single',
			};
		case 'Update':
			return {
				method: 'PUT',
				url: `${gatewayUrl}/drafts/${command.draftId}`,
				body: { title: command.title, subtitle: command.subtitle, body: command.body },
				responseMode: 'single',
			};
		case 'Delete':
			return {
				method: 'DELETE',
				url: `${gatewayUrl}/drafts/${command.draftId}`,
				responseMode: 'empty',
				emptyResponseBody: { success: true, draftId: command.draftId },
			};
	}
};
