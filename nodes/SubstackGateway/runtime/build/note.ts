import type { NoteCommand } from '../../domain/command';
import type { GatewayHttpRequest } from '../../domain/http';
import type { GatewayUrl } from '../../schema';

export const buildNoteRequest = (
	gatewayUrl: GatewayUrl,
	command: NoteCommand,
): GatewayHttpRequest => {
	switch (command._tag) {
		case 'Create':
			return {
				method: 'POST',
				url: `${gatewayUrl}/notes`,
				body: {
					content: command.content,
					...(command.attachment !== undefined ? { attachment: command.attachment } : {}),
				},
				responseMode: 'single',
			};
		case 'Get':
			return {
				method: 'GET',
				url: `${gatewayUrl}/notes/${command.noteId}`,
				responseMode: 'single',
			};
		case 'Delete':
			return {
				method: 'DELETE',
				url: `${gatewayUrl}/notes/${command.noteId}`,
				responseMode: 'empty',
				emptyResponseBody: { success: true, noteId: command.noteId },
			};
	}
};
