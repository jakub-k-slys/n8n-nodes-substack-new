export type OwnPublicationCommand =
	| { readonly _tag: 'OwnProfile' }
	| { readonly _tag: 'OwnNotes' }
	| { readonly _tag: 'OwnPosts' }
	| { readonly _tag: 'OwnFollowing' };

export type NoteCommand =
	| { readonly _tag: 'Create'; readonly content: string; readonly attachment?: string }
	| { readonly _tag: 'Get'; readonly noteId: number }
	| { readonly _tag: 'Delete'; readonly noteId: number };

export type DraftCommand =
	| { readonly _tag: 'List' }
	| {
			readonly _tag: 'Create';
			readonly title: string | null;
			readonly subtitle: string | null;
			readonly body: string | null;
	  }
	| { readonly _tag: 'Get'; readonly draftId: number }
	| {
			readonly _tag: 'Update';
			readonly draftId: number;
			readonly title: string | null;
			readonly subtitle: string | null;
			readonly body: string | null;
	  }
	| { readonly _tag: 'Delete'; readonly draftId: number };

export type PostCommand =
	| { readonly _tag: 'Get'; readonly postId: number }
	| { readonly _tag: 'GetComments'; readonly postId: number };

export type ProfileCommand =
	| { readonly _tag: 'Get'; readonly profileSlug: string }
	| { readonly _tag: 'GetNotes'; readonly profileSlug: string; readonly cursor?: string }
	| {
			readonly _tag: 'GetPosts';
			readonly profileSlug: string;
			readonly limit: number;
			readonly offset: number;
	  };

export type GatewayCommand =
	| { readonly _tag: 'OwnPublication'; readonly command: OwnPublicationCommand }
	| { readonly _tag: 'Note'; readonly command: NoteCommand }
	| { readonly _tag: 'Draft'; readonly command: DraftCommand }
	| { readonly _tag: 'Post'; readonly command: PostCommand }
	| { readonly _tag: 'Profile'; readonly command: ProfileCommand };
