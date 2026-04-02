import type {
	CommentResponse,
	CreateDraftResponse,
	CreateNoteResponse,
	DraftResponse,
	DraftSummaryResponse,
	FollowingUserResponse,
	FullPostResponse,
	NoteResponse,
	PostResponse,
	ProfileResponse,
} from '../schema';

export type OwnPublicationResult =
	| { readonly _tag: 'Profile'; readonly item: ProfileResponse }
	| { readonly _tag: 'Notes'; readonly items: ReadonlyArray<NoteResponse> }
	| { readonly _tag: 'Posts'; readonly items: ReadonlyArray<PostResponse> }
	| { readonly _tag: 'Following'; readonly items: ReadonlyArray<FollowingUserResponse> };

export type NoteResult =
	| { readonly _tag: 'Created'; readonly item: CreateNoteResponse }
	| { readonly _tag: 'Fetched'; readonly item: NoteResponse }
	| { readonly _tag: 'Deleted'; readonly item: { readonly success: boolean; readonly noteId: number } };

export type DraftResult =
	| { readonly _tag: 'List'; readonly items: ReadonlyArray<DraftSummaryResponse> }
	| { readonly _tag: 'Created'; readonly item: CreateDraftResponse }
	| { readonly _tag: 'Fetched'; readonly item: DraftResponse }
	| { readonly _tag: 'Updated'; readonly item: DraftResponse }
	| { readonly _tag: 'Deleted'; readonly item: { readonly success: boolean; readonly draftId: number } };

export type PostResult =
	| { readonly _tag: 'Fetched'; readonly item: FullPostResponse }
	| { readonly _tag: 'Comments'; readonly items: ReadonlyArray<CommentResponse> };

export type ProfileResult =
	| { readonly _tag: 'Fetched'; readonly item: ProfileResponse }
	| { readonly _tag: 'Notes'; readonly items: ReadonlyArray<NoteResponse> }
	| { readonly _tag: 'Posts'; readonly items: ReadonlyArray<PostResponse> };

export type GatewayResult =
	| { readonly _tag: 'OwnPublication'; readonly result: OwnPublicationResult }
	| { readonly _tag: 'Note'; readonly result: NoteResult }
	| { readonly _tag: 'Draft'; readonly result: DraftResult }
	| { readonly _tag: 'Post'; readonly result: PostResult }
	| { readonly _tag: 'Profile'; readonly result: ProfileResult };
