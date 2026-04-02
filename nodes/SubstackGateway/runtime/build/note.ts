import type { NoteCommand } from '../../domain/command';
import type { GatewayHttpRequest } from '../../domain/http';

export const buildNoteRequest = (gatewayUrl: string, command: NoteCommand): GatewayHttpRequest => {
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
