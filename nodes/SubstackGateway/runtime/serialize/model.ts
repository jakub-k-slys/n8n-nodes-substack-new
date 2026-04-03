import type { IDataObject } from 'n8n-workflow';

import type {
	CreatedDraft,
	CreatedNote,
	DeletedDraft,
	DeletedNote,
	GatewayComment,
	GatewayDraft,
	GatewayDraftSummary,
	GatewayFollowingUser,
	GatewayNote,
	GatewayNoteAuthor,
	GatewayPost,
	GatewayPostSummary,
	GatewayProfile,
} from '../../domain/model';
import { optional } from './shared';

export const toJsonNoteAuthor = (author: GatewayNoteAuthor): IDataObject => ({
	id: author.id,
	name: author.name,
	handle: author.handle,
	avatarUrl: author.avatarUrl,
});

export const toJsonProfile = (profile: GatewayProfile): IDataObject => ({
	id: profile.id,
	handle: profile.handle,
	name: profile.name,
	url: profile.url,
	avatarUrl: profile.avatarUrl,
	...optional('bio', profile.bio),
});

export const toJsonFollowingUser = (user: GatewayFollowingUser): IDataObject => ({
	id: user.id,
	handle: user.handle,
});

export const toJsonNote = (note: GatewayNote): IDataObject => ({
	id: note.id,
	body: note.body,
	likesCount: note.likesCount,
	author: toJsonNoteAuthor(note.author),
	publishedAt: note.publishedAt,
});

export const toJsonPostSummary = (post: GatewayPostSummary): IDataObject => ({
	id: post.id,
	title: post.title,
	publishedAt: post.publishedAt,
	...optional('subtitle', post.subtitle),
	...optional('truncatedBody', post.truncatedBody),
});

export const toJsonPost = (post: GatewayPost): IDataObject => ({
	id: post.id,
	title: post.title,
	slug: post.slug,
	url: post.url,
	publishedAt: post.publishedAt,
	...optional('subtitle', post.subtitle),
	...optional('htmlBody', post.htmlBody),
	...optional('markdown', post.markdown),
	...optional('truncatedBody', post.truncatedBody),
	...optional('reactions', post.reactions),
	...optional('restacks', post.restacks),
	...optional('tags', post.tags),
	...optional('coverImage', post.coverImage),
});

export const toJsonDraft = (draft: GatewayDraft): IDataObject => ({
	...optional('title', draft.title),
	...optional('subtitle', draft.subtitle),
	...optional('body', draft.body),
});

export const toJsonDraftSummary = (draft: GatewayDraftSummary): IDataObject => ({
	id: draft.id,
	uuid: draft.uuid,
	...optional('title', draft.title),
	...optional('updated', draft.updated),
});

export const toJsonComment = (comment: GatewayComment): IDataObject => ({
	id: comment.id,
	body: comment.body,
	isAdmin: comment.isAdmin,
});

export const toJsonCreatedNote = (note: CreatedNote): IDataObject => ({
	id: note.id,
});

export const toJsonCreatedDraft = (draft: CreatedDraft): IDataObject => ({
	id: draft.id,
	uuid: draft.uuid,
});

export const toJsonDeletedNote = (note: DeletedNote): IDataObject => ({
	success: note.success,
	noteId: note.noteId,
});

export const toJsonDeletedDraft = (draft: DeletedDraft): IDataObject => ({
	success: draft.success,
	draftId: draft.draftId,
});
