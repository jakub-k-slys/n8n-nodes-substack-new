import type { IDataObject } from 'n8n-workflow';

export type OwnPublicationResult =
	| { readonly _tag: 'Profile'; readonly item: IDataObject }
	| { readonly _tag: 'Notes'; readonly items: ReadonlyArray<IDataObject> }
	| { readonly _tag: 'Posts'; readonly items: ReadonlyArray<IDataObject> }
	| { readonly _tag: 'Following'; readonly items: ReadonlyArray<IDataObject> };

export type NoteResult =
	| { readonly _tag: 'Created'; readonly item: IDataObject }
	| { readonly _tag: 'Fetched'; readonly item: IDataObject }
	| { readonly _tag: 'Deleted'; readonly item: IDataObject };

export type DraftResult =
	| { readonly _tag: 'List'; readonly items: ReadonlyArray<IDataObject> }
	| { readonly _tag: 'Created'; readonly item: IDataObject }
	| { readonly _tag: 'Fetched'; readonly item: IDataObject }
	| { readonly _tag: 'Updated'; readonly item: IDataObject }
	| { readonly _tag: 'Deleted'; readonly item: IDataObject };

export type PostResult =
	| { readonly _tag: 'Fetched'; readonly item: IDataObject }
	| { readonly _tag: 'Comments'; readonly items: ReadonlyArray<IDataObject> };

export type ProfileResult =
	| { readonly _tag: 'Fetched'; readonly item: IDataObject }
	| { readonly _tag: 'Notes'; readonly items: ReadonlyArray<IDataObject> }
	| { readonly _tag: 'Posts'; readonly items: ReadonlyArray<IDataObject> };

export type GatewayResult =
	| { readonly _tag: 'OwnPublication'; readonly result: OwnPublicationResult }
	| { readonly _tag: 'Note'; readonly result: NoteResult }
	| { readonly _tag: 'Draft'; readonly result: DraftResult }
	| { readonly _tag: 'Post'; readonly result: PostResult }
	| { readonly _tag: 'Profile'; readonly result: ProfileResult };

export const getGatewayResultItems = (result: GatewayResult): ReadonlyArray<IDataObject> => {
	switch (result._tag) {
		case 'OwnPublication':
			return 'item' in result.result ? [result.result.item] : result.result.items;
		case 'Note':
			return [result.result.item];
		case 'Draft':
			return 'item' in result.result ? [result.result.item] : result.result.items;
		case 'Post':
			return 'item' in result.result ? [result.result.item] : result.result.items;
		case 'Profile':
			return 'item' in result.result ? [result.result.item] : result.result.items;
	}
};
